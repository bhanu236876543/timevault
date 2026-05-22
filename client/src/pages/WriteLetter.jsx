import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, PenTool, Sparkles, Loader2, ArrowLeft, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const WriteLetter = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    recipientEmail: '',
    moodCategory: 'Hopeful',
    unlockDate: ''
  });

  const moods = ['Hopeful', 'Reflective', 'Determined', 'Anxious', 'Joyful', 'Nostalgic'];

  // Calculate minimum date (tomorrow)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/letters', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to seal your letter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto mt-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Vault
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-2xl border border-border"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-primary/10 rounded-2xl">
            <PenTool className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Write to the Future</h1>
            <p className="text-foreground/60">Seal your thoughts, to be opened when the time is right.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/80">Title</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-background/50 border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-lg"
              placeholder="e.g., To myself in 5 years..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/80">Recipient Email (Optional)</label>
            <input 
              type="email" 
              value={formData.recipientEmail}
              onChange={(e) => setFormData({...formData, recipientEmail: e.target.value})}
              className="w-full bg-background/50 border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-lg"
              placeholder="Who should receive this when it unlocks?"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/80">Your Message</label>
            <textarea 
              required
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={8}
              className="w-full bg-background/50 border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none leading-relaxed"
              placeholder="Start writing..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Current Mood
              </label>
              <select 
                value={formData.moodCategory}
                onChange={(e) => setFormData({...formData, moodCategory: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
              >
                {moods.map(mood => (
                  <option key={mood} value={mood} className="bg-background text-foreground">{mood}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Unlock Date
              </label>
              <input 
                type="date" 
                required
                min={minDate}
                value={formData.unlockDate}
                onChange={(e) => setFormData({...formData, unlockDate: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_35px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Lock className="w-5 h-5" /> Seal into the Vault
                </>
              )}
            </button>
            <p className="text-center text-xs text-foreground/50 mt-4 flex justify-center gap-1">
              Once sealed, this letter cannot be opened until the unlock date.
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default WriteLetter;
