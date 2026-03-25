import { useEffect, useState } from 'react';
import API from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Clock, Users, CheckCircle2, AlertCircle, Trash2, RefreshCw, Power, PowerOff, Sparkles, TrendingUp, Crown, ListChecks } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AdminPolls = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPolls = async () => {
        try {
            const res = await API.get('/polls');
            const detailedPolls = await Promise.all(
                res.data.map(async (poll) => {
                    const detailRes = await API.get(`/polls/${poll._id}`);
                    return { ...poll, options: detailRes.data.options };
                })
            );
            setPolls(detailedPolls);
        } catch (err) {
            toast.error("Failed to fetch polls");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolls();
    }, []);

    // Handle Manual Toggle (Open/Close)
    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
        if (!window.confirm(`Are you sure you want to ${newStatus === 'Closed' ? 'deactivate' : 'reactivate'} this poll?`)) return;

        try {
            await API.patch(`/polls/${id}/status`, { status: newStatus });
            toast.success(`Poll is now ${newStatus}`, { 
                icon: newStatus === 'Open' ? '🎉' : '🔒',
                style: { borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#fff', fontWeight: 'bold' }
            });
            fetchPolls();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    // Handle Delete Poll
    const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
            
            await API.delete(`/polls/${id}`); 
            
            toast.success("Poll deleted!");
            setPolls(polls.filter(p => p._id !== id));
        } catch (err) {
            console.error("Delete Error:", err.response); 
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-orange-200 rounded-full animate-pulse"></div>
                <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin text-orange-500" size={32} />
            </div>
            <p className="mt-4 font-bold text-orange-600 animate-pulse">Loading Poll Data...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Toaster position="top-right" />
            
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-3xl border-2 border-orange-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Crown className="text-orange-500" size={24} />
                        <h1 className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent tracking-tight">Poll Management</h1>
                    </div>
                    <p className="text-orange-600 font-medium">✨ Monitor live results and control poll visibility ✨</p>
                </div>
                <button 
                    onClick={fetchPolls} 
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-orange-300 hover:shadow-xl hover:shadow-orange-400 transition-all hover:scale-105 active:scale-95"
                >
                    <RefreshCw size={18} /> Refresh Data
                </button>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {polls.map((poll) => {
                    const isExpired = new Date() > new Date(poll.deadline);
                    const isManuallyClosed = poll.status === 'Closed';
                    const isClosed = isExpired || isManuallyClosed;
                    
                    const totalVotes = poll.options?.reduce((sum, opt) => sum + opt.vote_count, 0) || 0;
                    const chartData = poll.options?.map(opt => ({ name: opt.option_text, votes: opt.vote_count }));

                    return (
                        <div key={poll._id} className="bg-white rounded-[2rem] shadow-2xl shadow-orange-200/20 border-2 border-orange-50 p-8 flex flex-col lg:flex-row gap-10 overflow-hidden relative group hover:border-orange-200 transition-all duration-300">
                            
                            {/* Status Indicator Bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-2 ${isClosed ? 'bg-gray-300' : 'bg-gradient-to-b from-amber-500 to-orange-600'}`}></div>

                            {/* Left Side: Poll Info & Actions */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4 flex-wrap">
                                    {isClosed ? (
                                        <span className="flex items-center gap-1.5 text-[10px] font-black bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full uppercase tracking-wider">
                                            <PowerOff size={12} /> {isExpired ? 'Expired' : 'Deactivated'}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Active Now
                                        </span>
                                    )}
                                    <span className="text-[10px] font-bold text-orange-500 flex items-center gap-1 uppercase tracking-wider bg-orange-50 px-3 py-1.5 rounded-full">
                                        <Clock size={12} /> Deadline: {new Date(poll.deadline).toLocaleString()}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-gray-800 mb-6 leading-tight group-hover:text-orange-600 transition-colors">{poll.title}</h3>
                                
                                <div className="flex items-center gap-6 mb-8 bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1">
                                            <Users size={12} /> Responses
                                        </span>
                                        <span className="text-2xl font-black text-orange-600">{totalVotes}</span>
                                    </div>
                                    <div className="w-px h-10 bg-orange-200"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1">
                                            <TrendingUp size={12} /> Options
                                        </span>
                                        <span className="text-2xl font-black text-gray-700">{poll.options?.length}</span>
                                    </div>
                                </div>

                                {/* Control Buttons */}
                                <div className="flex flex-wrap gap-3">
                                    <button 
                                        onClick={() => handleToggleStatus(poll._id, poll.status)}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md ${
                                            poll.status === 'Open' 
                                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-500 hover:text-white' 
                                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-500 hover:text-white'
                                        }`}
                                    >
                                        {poll.status === 'Open' ? <><Power size={14} /> Deactivate</> : <><Power size={14} /> Activate</>}
                                    </button>

                                    <button 
                                        onClick={() => handleDelete(poll._id)}
                                        className="flex items-center gap-2 px-5 py-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-md"
                                    >
                                        <Trash2 size={14} /> Delete Poll
                                    </button>
                                </div>
                            </div>

                            {/* Right Side: Live Visual Analytics */}
                            <div className="flex-1 bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-3xl p-6 border-2 border-orange-100 relative">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                                        <Sparkles size={14} className={!isClosed ? "animate-pulse" : ""} /> Live Analytics
                                    </h4>
                                </div>
                                
                                <div className="h-56 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fed7aa" />
                                            <XAxis dataKey="name" fontSize={10} fontWeight={700} axisLine={false} tickLine={false} tick={{ fill: '#f97316' }} />
                                            <YAxis axisLine={false} tickLine={false} fontSize={10} fontWeight={700} tick={{ fill: '#f97316' }} />
                                            <Tooltip 
                                                cursor={{fill: '#fff3e6'}}
                                                contentStyle={{borderRadius: '16px', border: '2px solid #fed7aa', background: 'white', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                                            />
                                            <Bar dataKey="votes" radius={[8, 8, 0, 0]} barSize={32}>
                                                {chartData?.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f97316' : '#fb923c'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {polls.length === 0 && (
                    <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-orange-100 shadow-sm">
                        <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ListChecks size={48} className="text-orange-300" />
                        </div>
                        <h3 className="text-xl font-black text-orange-800 italic">No polls found</h3>
                        <p className="text-orange-400 mt-2 font-medium">Click "Create Poll" to start your first voting event! 🚀</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPolls;