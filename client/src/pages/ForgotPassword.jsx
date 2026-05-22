import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');
    
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('Password reset link sent! Check your email.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email.');
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
          <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
          <p className="text-foreground/60">Enter your email to receive a reset link.</p>
        </div>

        {message && (
          <div className="bg-green-500/10 text-green-500 border border-green-500/50 p-3 rounded-xl mb-6 text-sm">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 text-red-500 border border-red-500/50 p-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-foreground/40" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 bg-background/50 border border-border rounded-xl py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" 
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || message !== ''}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-primary hover:underline flex items-center justify-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
