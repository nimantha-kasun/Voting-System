import React from 'react';
import { Link } from 'react-router-dom';
import { Vote, ShieldCheck, BarChart3, Users, ArrowRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <header className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pt-16 pb-32">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-bounce">
                            <Vote size={18} />
                            <span>Digital Voting Revolution v1.0</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
                            Your Voice, <br />
                            <span className="bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">Your Future.</span>
                        </h1>
                        
                        <p className="text-lg text-slate-600 max-w-2xl mb-10 font-medium">
                            Experience a secure, transparent, and real-time polling system designed for students. 
                            Cast your vote and see the results instantly!
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link 
                                to="/login" 
                                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-200 hover:scale-105"
                            >
                                Get Started <ArrowRight size={20} />
                            </Link>
                            <Link 
                                to="/signup" 
                                className="bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 opacity-20">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-orange-300 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-300 rounded-full blur-3xl"></div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-24 container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900">Why Use Our Voting System?</h2>
                    <div className="h-1.5 w-20 bg-orange-500 mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Feature 1 */}
                    <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-100 hover:border-orange-200 transition-all group">
                        <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-800">Secure & Private</h3>
                        <p className="text-slate-500">Your identity and votes are protected using advanced authentication systems.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-100 hover:border-orange-200 transition-all group">
                        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
                            <BarChart3 size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-800">Real-time Results</h3>
                        <p className="text-slate-500">Watch the live analytics and charts as student responses come in instantly.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-100 hover:border-orange-200 transition-all group">
                        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all">
                            <Users size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-800">User Friendly</h3>
                        <p className="text-slate-500">A smooth and intuitive interface designed specifically for students and admins.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Vote className="text-orange-500" />
                        <span className="font-bold text-xl uppercase tracking-widest">StudentPolls</span>
                    </div>
                    <p className="text-slate-400 text-sm">© 2026 Voting System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;