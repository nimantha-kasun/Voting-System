import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Loader2, Sparkles } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await API.post('/auth/login', formData);
            login(res.data.user, res.data.token);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl shadow-orange-200/50 border border-orange-100 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-300 animate-pulse">
                        <LogIn className="text-white" size={28} />
                    </div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">Welcome Back</h1>
                    <p className="text-orange-500 mt-2 font-medium">✨ Sign in to the Event Voting Portal ✨</p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 rounded-xl text-sm font-medium animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <label className="text-sm font-bold text-gray-700 block mb-2">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-orange-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                            <input 
                                type="email" 
                                required
                                className="w-full pl-11 pr-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all bg-orange-50/30 hover:bg-white focus:bg-white"
                                placeholder="name@example.com"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="text-sm font-bold text-gray-700 block mb-2">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-orange-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                            <input 
                                type="password" 
                                required
                                className="w-full pl-11 pr-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all bg-orange-50/30 hover:bg-white focus:bg-white"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-300 hover:shadow-xl hover:shadow-orange-400 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18} /> Sign In</>}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-medium text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-bold hover:from-amber-700 hover:to-orange-700 transition-all">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;