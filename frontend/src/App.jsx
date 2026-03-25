import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import Home from './pages/Home';

// Helper component to protect routes
const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/" element={<Home />} />
                        
                        {/* Admin Routes */}
                        <Route path="/admin/*" element={
                            <ProtectedRoute role="Admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />

                        {/* Student Routes */}
                        <Route path="/student/*" element={
                            <ProtectedRoute role="Student">
                                <StudentDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;