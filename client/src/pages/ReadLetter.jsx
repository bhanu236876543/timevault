import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, Calendar, Sparkles, Loader2 } from 'lucide-react';
import api from '../api/axios';

const ReadLetter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [letter, setLetter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const res = await api.get('/letters');
        const found = res.data.find(l => l._id === id);
        if (!found) {
          setError('Letter not found');
        } else if (!found.isUnlocked) {
          setError('This letter is still locked!');
        } else {
          setLetter(found);
        }
      } catch (err) {
        setError('Failed to load letter');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLetter();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !letter) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="glass p-8 rounded-2xl text-center border-red-500/20">
          <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-foreground/60 mb-6">{error}</p>
          <Link to="/dashboard" className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl">
            Return to Vault
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto mt-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Vault
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 md:p-12 rounded-2xl border border-primary/30 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-border/50">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{letter.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Written: {new Date(letter.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><Sparkles className="w-4 h-4" /> Mood: {letter.moodCategory}</span>
              {letter.recipientEmail && (
                <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> Sent to: {letter.recipientEmail}</span>
              )}
            </div>
          </div>
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg leading-relaxed whitespace-pre-wrap text-foreground/90 font-medium">
            {letter.content}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ReadLetter;
