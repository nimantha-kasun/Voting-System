import { useState } from 'react';
import API from '../../services/api';
import { Plus, Trash2, Send, Calendar, ListPlus, Sparkles, Crown, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const CreatePoll = () => {
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('');
    const [options, setOptions] = useState(['', '']); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Add a new option
    const addOption = () => setOptions([...options, '']);

    // Remove an option (at least 2 options should remain)
    const removeOption = (index) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        } else {
            toast.error('You need at least 2 options for a poll!', {
                icon: '⚠️',
                style: { borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#fff' }
            });
        }
    };

    // When changing the input, make sure to update it
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!title.trim()) {
            toast.error('Please enter a poll title!', {
                icon: '📝',
                style: { borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#fff' }
            });
            return;
        }
        
        if (!deadline) {
            toast.error('Please select a voting deadline!', {
                icon: '⏰',
                style: { borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#fff' }
            });
            return;
        }
        
        const validOptions = options.filter(opt => opt.trim());
        if (validOptions.length < 2) {
            toast.error('Please add at least 2 valid options!', {
                icon: '❌',
                style: { borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#fff' }
            });
            return;
        }
        
        setLoading(true);
        try {
            // Send data to the backend
            await API.post('/polls', { title, deadline, options: validOptions });
            
            toast.success('Poll created successfully! 🎉', {
                icon: '🚀',
                style: { borderRadius: '16px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' },
                duration: 3000
            });
            
            setTimeout(() => {
                navigate('/admin'); // Go back to the dashboard
            }, 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create poll', {
                icon: '💔',
                style: { borderRadius: '16px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff' }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Toaster position="top-right" />
            
            <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-3xl border-2 border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                    <Crown className="text-orange-500" size={28} />
                    <h1 className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Create New Poll</h1>
                </div>
                <p className="text-orange-600 font-medium flex items-center gap-2">
                    <Sparkles size={16} /> Setup a new event or topic for students to vote on <Sparkles size={16} />
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-2xl shadow-orange-200/40 border-2 border-orange-100 space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                        <ListPlus size={16} className="text-orange-500" />
                        Poll Question / Title
                    </label>
                    <div className="relative group">
                        <ListPlus className="absolute left-4 top-3.5 text-orange-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                        <input 
                            type="text" 
                            required
                            className="w-full pl-11 pr-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all bg-orange-50/30 hover:bg-white focus:bg-white"
                            placeholder="e.g., Who should be the next batch representative? 🎓"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                </div>

                {/* Deadline */}
                <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                        <Calendar size={16} className="text-orange-500" />
                        Voting Deadline
                    </label>
                    <div className="relative group">
                        <Calendar className="absolute left-4 top-3.5 text-orange-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                        <input 
                            type="datetime-local" 
                            required
                            className="w-full pl-11 pr-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all bg-orange-50/30 hover:bg-white focus:bg-white"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>
                    <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
                        <AlertCircle size={10} />
                        Set the date and time when voting will automatically close
                    </p>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                        <Plus size={16} className="text-orange-500" />
                        Poll Options (min 2 required)
                    </label>
                    {options.map((option, index) => (
                        <div key={index} className="flex gap-2 animate-in fade-in duration-300">
                            <div className="relative flex-1 group">
                                <input 
                                    type="text" 
                                    required
                                    className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all bg-orange-50/30 hover:bg-white focus:bg-white"
                                    placeholder={`Option ${index + 1}`}
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                />
                            </div>
                            {options.length > 2 && (
                                <button 
                                    type="button" 
                                    onClick={() => removeOption(index)}
                                    className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-300 hover:scale-110"
                                    title="Remove option"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    ))}
                    
                    <button 
                        type="button" 
                        onClick={addOption}
                        className="flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-all duration-300 px-2 py-2 hover:translate-x-1 group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
                        Add another option
                    </button>
                    
                    <p className="text-xs text-gray-500 mt-2">
                        💡 Tip: Clear and specific options get better response rates!
                    </p>
                </div>

                <hr className="border-orange-100" />

                <button 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-300 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Poll...
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            Publish Poll 🚀
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreatePoll;