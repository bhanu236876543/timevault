import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Plus, Loader2, Heart } from 'lucide-react';
import api from '../api/axios';

const Moods = () => {
  const [moodLogs, setMoodLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    moodScore: 5,
    emotion: 'Calm',
    note: ''
  });

  const emotions = ['Joyful', 'Calm', 'Hopeful', 'Nostalgic', 'Stressed', 'Anxious', 'Sad'];

  useEffect(() => {
    fetchMoodLogs();
  }, []);

  const fetchMoodLogs = async () => {
    try {
      const res = await api.get('/moods');
      // Sort by date ascending for the chart
      const sorted = res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setMoodLogs(sorted);
    } catch (err) {
      console.error("Failed to load mood logs", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogMood = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/moods', formData);
      setMoodLogs([...moodLogs, res.data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
      setFormData({ moodScore: 5, emotion: 'Calm', note: '' });
    } catch (err) {
      console.error("Failed to log mood", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format data for Recharts
  const chartData = moodLogs.map(log => ({
    date: new Date(log.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: log.moodScore,
    emotion: log.emotion
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 border border-border/50 text-sm rounded-lg shadow-xl">
          <p className="font-semibold mb-1">{label}</p>
          <p className="text-primary">Score: {payload[0].value}/10</p>
          <p className="text-foreground/70">{payload[0].payload.emotion}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto mt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Activity className="w-8 h-8 text-pink-500" />
          Mood Analytics
        </h1>
        <p className="text-foreground/60">Track your emotional journey over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Log Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-6 rounded-2xl h-fit border border-border/50"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            How are you feeling?
          </h2>
          <form onSubmit={handleLogMood} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex justify-between">
                <span>Mood Score</span>
                <span className="text-pink-500 font-bold">{formData.moodScore}/10</span>
              </label>
              <input 
                type="range" 
                min="1" max="10" 
                value={formData.moodScore}
                onChange={e => setFormData({...formData, moodScore: parseInt(e.target.value)})}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-foreground/50">
                <span>Struggling</span>
                <span>Thriving</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Emotion</label>
              <select 
                value={formData.emotion}
                onChange={e => setFormData({...formData, emotion: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-xl py-2 px-3 text-foreground"
              >
                {emotions.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Note (Optional)</label>
              <textarea 
                value={formData.note}
                onChange={e => setFormData({...formData, note: e.target.value})}
                rows={2}
                className="w-full bg-background/50 border border-border rounded-xl py-2 px-3 text-foreground resize-none"
                placeholder="Why do you feel this way?"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Log Mood</>}
            </button>
          </form>
        </motion.div>

        {/* Chart Area */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="glass p-6 rounded-2xl border border-border/50">
            <h2 className="text-xl font-bold mb-6">Mood Trend</h2>
            <div className="h-72 w-full">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                </div>
              ) : chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
                    <YAxis domain={[1, 10]} stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="score" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-foreground/50 text-center">
                  Not enough data yet. Log your mood a few times to see your trend line!
                </div>
              )}
            </div>
          </div>

          {/* Recent Logs List */}
          <div className="glass p-6 rounded-2xl border border-border/50">
            <h2 className="text-xl font-bold mb-4">Recent Logs</h2>
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
            ) : moodLogs.length === 0 ? (
              <p className="text-foreground/50">No mood logs found.</p>
            ) : (
              <div className="space-y-3">
                {[...moodLogs].reverse().slice(0, 5).map(log => (
                  <div key={log._id} className="flex justify-between items-center p-3 bg-background/30 rounded-lg">
                    <div>
                      <p className="font-semibold">{log.emotion}</p>
                      {log.note && <p className="text-sm text-foreground/60 truncate max-w-xs">{log.note}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-pink-500 font-bold">{log.moodScore}/10</p>
                      <p className="text-xs text-foreground/40">{new Date(log.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Moods;
