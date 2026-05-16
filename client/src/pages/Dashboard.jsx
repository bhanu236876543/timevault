import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Image as ImageIcon, Target, Plus, Clock, LockOpen, Lock } from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ totalLetters: 0, unlockedLetters: 0 });
  const [recentLetters, setRecentLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data.stats || { totalLetters: 0, unlockedLetters: 0 });
        setRecentLetters(res.data.recentLetters || []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="flex-1 w-full mt-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold tracking-tight mb-2"
          >
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-foreground/60"
          >
            Your time vault is secure.
          </motion.p>
        </div>
        <button onClick={logout} className="text-sm text-red-400 hover:text-red-300 transition-colors">
          Log out
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-2xl border-l-4 border-l-primary"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-foreground/60 text-sm font-medium mb-1">Letters Written</p>
              <h3 className="text-3xl font-bold">{stats.totalLetters}</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl">
              <Mail className="w-6 h-6 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-2xl border-l-4 border-l-green-500"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-foreground/60 text-sm font-medium mb-1">Unlocked</p>
              <h3 className="text-3xl font-bold">{stats.unlockedLetters}</h3>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl">
              <LockOpen className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-2xl border-l-4 border-l-yellow-500"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-foreground/60 text-sm font-medium mb-1">Locked</p>
              <h3 className="text-3xl font-bold">{stats.totalLetters - stats.unlockedLetters}</h3>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <Lock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Cards & Recent Letters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Letters</h2>
            <button className="text-sm text-primary hover:underline font-medium">View All</button>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass h-24 rounded-2xl w-full"></div>
              ))}
            </div>
          ) : recentLetters.length > 0 ? (
            <div className="space-y-4">
              {recentLetters.map((letter) => (
                <motion.div 
                  key={letter._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass p-5 rounded-2xl flex items-center justify-between group hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${letter.isUnlocked ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {letter.isUnlocked ? <LockOpen className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{letter.title}</h4>
                      <p className="text-sm text-foreground/60 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 
                        Unlocks on {new Date(letter.unlockDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {letter.isUnlocked && (
                    <button className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-colors">
                      Read Now
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass p-10 rounded-2xl text-center border-dashed border-2 border-border">
              <Mail className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No letters yet</h3>
              <p className="text-foreground/60 mb-6">Your vault is empty. Start by writing your first letter to the future.</p>
              <Link to="/write-letter" className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                Write a Letter
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link to="/write-letter" className="glass p-5 rounded-2xl flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all group text-left w-full">
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                <Plus className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-semibold">Write Letter</h4>
                <p className="text-xs text-foreground/60">To your future self</p>
              </div>
            </Link>
            
            <button className="glass p-5 rounded-2xl flex items-center gap-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group text-left w-full">
              <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <ImageIcon className="w-6 h-6 text-blue-500 group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-semibold">Add Memory</h4>
                <p className="text-xs text-foreground/60">Upload a photo/video</p>
              </div>
            </button>

            <button className="glass p-5 rounded-2xl flex items-center gap-4 hover:border-green-500/50 hover:bg-green-500/5 transition-all group text-left">
              <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500 group-hover:text-white transition-colors">
                <Target className="w-6 h-6 text-green-500 group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-semibold">Set a Goal</h4>
                <p className="text-xs text-foreground/60">Track your progress</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
