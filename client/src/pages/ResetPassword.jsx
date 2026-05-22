import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired reset token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex items-center justify-center mt-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass p-8 rounded-2xl border border-border"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
          <p className="text-foreground/60">Enter your new secure password.</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 text-red-500 border border-red-500/50 p-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-foreground/40" />
              </div>
              <input 
                type="password" 
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 bg-background/50 border border-border rounded-xl py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password & Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
