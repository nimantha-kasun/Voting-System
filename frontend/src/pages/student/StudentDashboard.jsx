import { useEffect, useState, useContext } from 'react';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, Vote, CheckCircle2, Clock, BarChart2, Zap, Rocket, History, Trophy, Users, TrendingUp, Award, CalendarCheck, CalendarX } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import Countdown from '../../components/polls/Countdown';

const StudentDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await API.get('/polls');
            const detailedPolls = await Promise.all(
                res.data.map(async (p) => {
                    const detail = await API.get(`/polls/${p._id}`);
                    return { 
                        ...p, 
                        options: detail.data.options,
                        userVotedOption: detail.data.userVotedOption 
                    };
                })
            );
            setPolls(detailedPolls);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleVote = async (pollId, optionId) => {
        try {
            await API.post('/votes', { poll_id: pollId, option_id: optionId });
            
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.7 },
                colors: ['#f59e0b', '#ef4444', '#ec489a', '#8b5cf6']
            });

            toast.success('Vote recorded! Thank you for participating.', {
                icon: '🎉',
                style: { borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#fff', fontWeight: 'bold' },
            });

            fetchData(); 
        } catch (err) {
            toast.error(err.response?.data?.message || 'You have already voted or the poll is closed.');
        }
    };

    // Separate polls into active and ended
    const activePolls = polls.filter(poll => new Date() <= new Date(poll.deadline));
    const endedPolls = polls.filter(poll => new Date() > new Date(poll.deadline));
    
    // Statistics for summary cards
    const totalVotes = polls.reduce((sum, poll) => {
        return sum + poll.options.reduce((optSum, opt) => optSum + opt.vote_count, 0);
    }, 0);
    
    const userVotedPolls = polls.filter(poll => poll.userVotedOption != null);
    const userVotedCount = userVotedPolls.length;
    const userParticipationRate = polls.length > 0 ? ((userVotedCount / polls.length) * 100).toFixed(1) : 0;
    
    const mostPopularPoll = [...polls].sort((a, b) => {
        const aVotes = a.options.reduce((sum, opt) => sum + opt.vote_count, 0);
        const bVotes = b.options.reduce((sum, opt) => sum + opt.vote_count, 0);
        return bVotes - aVotes;
    })[0];
    
    const mostPopularVotes = mostPopularPoll ? 
        mostPopularPoll.options.reduce((sum, opt) => sum + opt.vote_count, 0) : 0;

    // Summary Cards Data
    const summaryCards = [
        {
            title: 'Available Events',
            value: activePolls.length,
            icon: CalendarCheck,
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-50 to-emerald-50',
            textColor: 'text-green-600',
            description: 'Ready to vote now'
        },
        {
            title: 'Ended Events',
            value: endedPolls.length,
            icon: CalendarX,
            gradient: 'from-gray-500 to-gray-600',
            bgGradient: 'from-gray-50 to-slate-50',
            textColor: 'text-gray-600',
            description: 'Results available'
        },
        {
            title: 'Your Participation',
            value: `${userVotedCount}/${polls.length}`,
            subValue: `${userParticipationRate}%`,
            icon: Trophy,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50',
            textColor: 'text-purple-600',
            description: 'Polls completed'
        },
        {
            title: 'Total Votes',
            value: totalVotes.toLocaleString(),
            icon: Users,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50',
            textColor: 'text-blue-600',
            description: 'Community votes'
        }
    ];

    // Reusable Poll Card Component
    const PollCard = ({ poll }) => {
        const isExpired = new Date() > new Date(poll.deadline);
        const hasVoted = poll.userVotedOption != null;
        const chartData = poll.options.map(opt => ({ name: opt.option_text, votes: opt.vote_count }));
        const totalVotes = poll.options.reduce((acc, opt) => acc + opt.vote_count, 0);

        return (
            <div className="group bg-white rounded-[2rem] shadow-2xl shadow-orange-200/40 border-2 border-orange-100 overflow-hidden flex flex-col transition-all duration-300 hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-orange-300/50">
                <div className="p-8 flex-1 bg-gradient-to-br from-white to-amber-50/30">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            {isExpired ? (
                                <span className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase italic shadow-md">Ended</span>
                            ) : (
                                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow-md animate-pulse">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> Live
                                </span>
                            )}
                            {hasVoted && (
                                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">✓ Voted</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-orange-500 font-bold bg-orange-50 px-3 py-1 rounded-full">
                            <Clock size={14} className="text-orange-500" />
                            <Countdown deadline={poll.deadline} />
                        </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 leading-snug group-hover:from-orange-600 group-hover:to-amber-600 transition-all duration-300">{poll.title}</h3>
                    <p className="text-sm text-orange-500 mb-8 flex items-center gap-1 font-semibold">
                        <Zap size={14} className="text-amber-500 animate-pulse" /> Total {totalVotes} student responses 🎯
                    </p>

                    {/* Voting Actions */}
                    {!isExpired ? (
                        <div className="grid grid-cols-1 gap-3 mb-8">
                            {poll.options.map((opt) => {
                                const isMyVote = poll.userVotedOption === opt._id;
                                return (
                                    <button 
                                        key={opt._id}
                                        disabled={hasVoted}
                                        onClick={() => handleVote(poll._id, opt._id)}
                                        className={`relative w-full text-left px-5 py-4 border-2 rounded-2xl transition-all duration-300 font-bold flex justify-between items-center group/btn shadow-md ${
                                            isMyVote 
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-transparent text-white shadow-lg shadow-purple-300 scale-[1.02]' 
                                            : 'bg-white border-orange-200 text-gray-700 hover:border-orange-400 hover:shadow-lg hover:scale-[1.01]'
                                        } ${hasVoted && !isMyVote ? 'opacity-50 grayscale-[0.3]' : ''}`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="text-xl">{['🔥', '⚡', '💎', '🎨', '🚀', '✨'][Math.floor(Math.random() * 6)]}</span>
                                            {opt.option_text}
                                        </span>
                                        {isMyVote ? (
                                            <CheckCircle2 size={18} className="text-white animate-pulse" />
                                        ) : (
                                            <CheckCircle2 size={18} className="opacity-0 group-hover/btn:opacity-100 text-orange-400 transition-opacity" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mb-8 p-5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border-2 border-dashed border-gray-300 text-center">
                            <p className="text-gray-500 font-bold text-sm italic">📊 Voting has been finalized for this event.</p>
                        </div>
                    )}

                    {/* Results Visualization */}
                    <div className="mt-4 pt-6 border-t-2 border-orange-100">
                        <div className="flex justify-between items-end mb-4">
                            <p className="text-[11px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1.5">
                                <BarChart2 size={14} className="text-orange-500" /> Real-time Analytics 📈
                            </p>
                        </div>
                        <div className="h-44 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical" margin={{ left: -20, right: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} fontSize={10} fontWeight={700} axisLine={false} tickLine={false} tick={{ fill: '#f97316' }} />
                                    <Tooltip cursor={{fill: '#fff3e6'}} contentStyle={{borderRadius: '12px', border: '2px solid #fed7aa', background: 'white', fontWeight: 'bold'}} />
                                    <Bar dataKey="votes" radius={[0, 8, 8, 0]} barSize={20}>
                                        {chartData.map((entry, i) => (
                                            <Cell key={i} fill={poll.userVotedOption === poll.options[i]._id ? '#f97316' : '#fed7aa'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
            <Toaster position="top-center" reverseOrder={false} />
            
            {/* Navigation Bar */}
            <nav className="bg-white/90 backdrop-blur-xl border-b border-orange-200/50 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg shadow-orange-100/30">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 rounded-xl shadow-lg shadow-orange-300 text-white animate-pulse">
                        <Vote size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent leading-tight">Student Portal</h1>
                        <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Welcome, {user?.name}!</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 bg-gradient-to-r from-amber-50 to-orange-50 p-1.5 rounded-2xl border border-orange-200">
                    <div className="pl-3 hidden sm:block">
                        <p className="text-xs text-orange-500 font-medium">Logged in as</p>
                        <p className="text-sm font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">{user?.name}</p>
                    </div>
                    <button 
                        onClick={logout} 
                        className="bg-white text-orange-500 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-xl shadow-sm border border-orange-200 transition-all hover:shadow-lg hover:scale-105"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-6 md:p-10">
                {/* Header Section */}
                <header className="mb-8 relative">
                    <div className="absolute -left-4 top-0 w-1 h-12 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full hidden md:block animate-pulse"></div>
                    <h2 className="text-4xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent tracking-tight">My Dashboard</h2>
                    <p className="text-orange-600 mt-2 text-lg font-medium">✨ Your voice matters. Cast your vote and make an impact! ✨</p>
                </header>

                {/* Summary Cards Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <Award className="text-orange-500" size={24} />
                        <h3 className="text-xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Quick Stats</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {summaryCards.map((card, index) => (
                            <div 
                                key={index}
                                className={`group bg-gradient-to-br ${card.bgGradient} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-white/50 cursor-pointer`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`bg-gradient-to-r ${card.gradient} p-2.5 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                        <card.icon size={20} className="text-white" />
                                    </div>
                                    {card.subValue && (
                                        <span className="text-xs font-black text-gray-500 bg-white/50 px-2 py-1 rounded-full">
                                            {card.subValue}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-2xl font-black text-gray-800 mb-1">
                                    {card.value}
                                </h3>
                                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    {card.title}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-2">
                                    {card.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Available Events Section */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2.5 rounded-xl shadow-md">
                            <Rocket className="text-white" size={22} />
                        </div>
                        <h2 className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Available Events</h2>
                        {activePolls.length > 0 && (
                            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                {activePolls.length} Active
                            </span>
                        )}
                    </div>
                    
                    {activePolls.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {activePolls.map(poll => <PollCard key={poll._id} poll={poll} />)}
                        </div>
                    ) : (
                        <div className="p-12 bg-white rounded-3xl border-4 border-dashed border-green-200 text-center shadow-lg">
                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CalendarCheck size={48} className="text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-green-600">No Available Events</h3>
                            <p className="text-green-500 mt-2 font-medium">Check back later for exciting new voting opportunities! 🎯</p>
                        </div>
                    )}
                </section>

                {/* Ended Events Section */}
                {endedPolls.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-2.5 rounded-xl shadow-md">
                                <History className="text-white" size={22} />
                            </div>
                            <h2 className="text-2xl font-black bg-gradient-to-r from-gray-500 to-gray-400 bg-clip-text text-transparent">Ended Events</h2>
                            <span className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                {endedPolls.length} Completed
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 opacity-80">
                            {endedPolls.map(poll => <PollCard key={poll._id} poll={poll} />)}
                        </div>
                    </section>
                )}

                {/* Empty State for No Polls */}
                {polls.length === 0 && !loading && (
                    <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-orange-200 shadow-2xl">
                        <div className="bg-gradient-to-br from-amber-100 to-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <Vote size={48} className="text-orange-400" />
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">No Polls Available</h3>
                        <p className="text-orange-400 mt-2 font-medium">✨ Check back later for exciting upcoming student events! ✨</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;