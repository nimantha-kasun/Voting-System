import { useEffect, useState } from 'react';
import API from '../../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, Vote, ListChecks, TrendingUp, Award, BarChart2, Sparkles, Crown, Activity } from 'lucide-react';

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5', '#f59e0b'];

const Analytics = () => {
    const [stats, setStats] = useState({ totalPolls: 0, totalVotes: 0, pollData: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get('/polls');
                const detailedPolls = await Promise.all(
                    res.data.map(async (p) => {
                        const detail = await API.get(`/polls/${p._id}`);
                        const voteCount = detail.data.options.reduce((sum, opt) => sum + opt.vote_count, 0);
                        return { name: p.title, value: voteCount };
                    })
                );

                const totalVotes = detailedPolls.reduce((sum, p) => sum + p.value, 0);
                setStats({
                    totalPolls: res.data.length,
                    totalVotes,
                    pollData: detailedPolls.filter(p => p.value > 0) // Votes තියෙන ඒව විතරක් chart එකට ගමු
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Polls', value: stats.totalPolls, icon: ListChecks, color: 'text-orange-600', bg: 'bg-gradient-to-br from-orange-100 to-amber-100' },
        { title: 'Total Votes Cast', value: stats.totalVotes, icon: Vote, color: 'text-amber-600', bg: 'bg-gradient-to-br from-amber-100 to-yellow-100' },
        { title: 'Engagement Rate', value: stats.totalPolls > 0 ? `${(stats.totalVotes / stats.totalPolls).toFixed(1)}` : 0, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-gradient-to-br from-emerald-100 to-green-100' },
        { title: 'Top Poll Response', value: Math.max(...stats.pollData.map(p => p.value), 0), icon: Award, color: 'text-rose-600', bg: 'bg-gradient-to-br from-rose-100 to-pink-100' },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-orange-200 rounded-full animate-pulse"></div>
                <Activity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin text-orange-500" size={32} />
            </div>
            <p className="mt-4 font-bold text-orange-600 animate-pulse">Loading Analytics...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-3xl border-2 border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                    <Crown className="text-orange-500" size={28} />
                    <h1 className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent tracking-tight">System Analytics</h1>
                </div>
                <p className="text-orange-600 font-medium flex items-center gap-2">
                    <Sparkles size={16} /> Comprehensive overview of voting patterns and student engagement <Sparkles size={16} />
                </p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="group bg-white p-6 rounded-2xl shadow-2xl shadow-orange-200/40 border-2 border-orange-100 flex items-center gap-4 hover:shadow-2xl hover:shadow-orange-300/50 hover:scale-[1.02] transition-all duration-300">
                        <div className={`${card.bg} ${card.color} p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{card.title}</p>
                            <h4 className="text-2xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{card.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Distribution Pie Chart */}
                <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-orange-200/40 border-2 border-orange-100 hover:shadow-2xl hover:shadow-orange-300/50 transition-all duration-300">
                    <h3 className="text-xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
                        <TrendingUp size={22} className="text-orange-500" /> Vote Distribution
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.pollData}
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    labelLine={false}
                                >
                                    {stats.pollData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '16px', 
                                        border: '2px solid #fed7aa', 
                                        background: 'white', 
                                        fontWeight: 'bold',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36}
                                    wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#f97316' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {stats.pollData.length === 0 && (
                        <p className="text-center text-orange-500 mt-4 font-medium">No votes cast yet. Create a poll to get started!</p>
                    )}
                </div>

                {/* Comparison Bar Chart */}
                <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-orange-200/40 border-2 border-orange-100 hover:shadow-2xl hover:shadow-orange-300/50 transition-all duration-300">
                    <h3 className="text-xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
                        <BarChart2 size={22} className="text-orange-500" /> Poll Popularity
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.pollData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fed7aa" />
                                <XAxis 
                                    dataKey="name" 
                                    fontSize={10} 
                                    fontWeight={700}
                                    axisLine={false} 
                                    tickLine={false}
                                    tick={{ fill: '#f97316' }}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    fontSize={10} 
                                    fontWeight={700}
                                    tick={{ fill: '#f97316' }}
                                />
                                <Tooltip 
                                    cursor={{fill: '#fff3e6'}}
                                    contentStyle={{
                                        borderRadius: '16px', 
                                        border: '2px solid #fed7aa', 
                                        background: 'white',
                                        fontWeight: 'bold',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Bar 
                                    dataKey="value" 
                                    fill="#f97316" 
                                    radius={[12, 12, 0, 0]} 
                                    barSize={50}
                                >
                                    {stats.pollData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {stats.pollData.length === 0 && (
                        <p className="text-center text-orange-500 mt-4 font-medium">No poll data available yet. Votes will appear here!</p>
                    )}
                </div>
            </div>

            {/* Additional Insight Card */}
            {stats.totalVotes > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-3xl border-2 border-orange-100">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-3 rounded-xl shadow-lg">
                                <Activity className="text-white" size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-orange-500 uppercase tracking-widest">Key Insight</p>
                                <p className="text-sm font-bold text-gray-700">
                                    Average votes per poll: <span className="text-orange-600 text-lg">{stats.totalPolls > 0 ? (stats.totalVotes / stats.totalPolls).toFixed(1) : 0}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-orange-600">
                            <Sparkles size={16} />
                            <span className="text-xs font-bold">Real-time Analytics • Last Updated Now</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;