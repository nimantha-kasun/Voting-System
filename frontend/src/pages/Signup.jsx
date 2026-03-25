import { useState } from 'react';
import API from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Loader2, Sparkles } from 'lucide-react';

const Signup = () => {
    // Default role එක Student විදිහට hardcode කරලා තියෙන්නේ
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Student' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await API.post('/auth/register', formData);
            alert('🎉 Registration successful! Please login to continue.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 py-10">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl shadow-orange-200/50 border border-orange-100">
                <div className="text-center mb-6">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-300">
                        <UserPlus className="text-white" size={28} />
                    </div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">Create Account</h1>
                    <p className="text-orange-500 mt-2 font-medium italic">Join the community & start voting</p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-sm font-bold text-gray-700 block mb-2">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 text-orange-400" size={18} />
                            <input 
                                type="text" 
                                required
                                className="w-full pl-11 pr-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all bg-orange-50/30"
                                placeholder="John Doe"
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-700 block mb-2">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-orange-400" size={18} />
                            <input 
                                type="email" 
                                required
                                className="w-full pl-11 pr-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all bg-orange-50/30"
                                placeholder="name@example.com"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-700 block mb-2">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-orange-400" size={18} />
                            <input 
                                type="password" 
                                required
                                className="w-full pl-11 pr-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all bg-orange-50/30"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Hidden Information for UX */}
                    <p className="text-[11px] text-gray-400 text-center px-4">
                        By registering, you will be joined as a <b>Student</b> and can participate in all active event polls.
                    </p>

                    <button 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:scale-[1.02] active:scale-[0.98] text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-200 mt-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18} /> Create Student Account</>}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-medium text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-orange-600 font-bold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;