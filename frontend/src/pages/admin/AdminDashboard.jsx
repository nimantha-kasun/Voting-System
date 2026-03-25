import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, PlusCircle, BarChart3, ListChecks, TrendingUp, Sparkles, Crown } from 'lucide-react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import CreatePoll from './CreatePoll';
import AdminPolls from './AdminPolls';
import Analytics from './Analytics';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const navItems = [
        { name: 'Active Polls', path: '/admin', icon: ListChecks },
        { name: 'Create Poll', path: '/admin/create', icon: PlusCircle },
        { name: 'Analytics', path: '/admin/analytics', icon: TrendingUp },
    ];

    return (
        <div className="flex h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
            {/* Sidebar */}
            <aside className="w-72 bg-white/80 backdrop-blur-xl border-r-2 border-orange-100 flex flex-col shadow-2xl shadow-orange-200/30">
                <div className="p-6 border-b-2 border-orange-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 rounded-xl shadow-lg shadow-orange-300">
                            <Crown className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
                                <BarChart3 className="text-orange-500" size={20} /> Admin Portal
                            </h2>
                            <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Control Panel</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-3">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${
                                    isActive 
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-300 scale-[1.02]' 
                                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:translate-x-1'
                                }`}
                            >
                                <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-orange-500'} />
                                {item.name}
                                {isActive && <Sparkles size={14} className="ml-auto animate-pulse" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t-2 border-orange-100 bg-gradient-to-r from-orange-50/50 to-amber-50/50">
                    <div className="flex items-center gap-3 mb-4 px-2 py-2 bg-white rounded-2xl shadow-md">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-md">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <span className="text-sm font-bold text-gray-800 block">{user?.name}</span>
                            <span className="text-[10px] text-orange-500 font-bold uppercase">Administrator</span>
                        </div>
                    </div>
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 font-bold hover:scale-[1.02] active:scale-[0.98] group"
                    >
                        <LogOut size={18} className="group-hover:rotate-12 transition-transform" /> 
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="animate-fadeIn">
                    <Routes>
                        <Route path="/" element={<AdminPolls />} />
                        <Route path="/create" element={<CreatePoll />} />
                        <Route path="/analytics" element={<Analytics />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;