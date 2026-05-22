import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Loader2, Calendar, CheckCircle2, Circle } from 'lucide-react';
import api from '../api/axios';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    deadline: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data);
    } catch (err) {
      console.error("Failed to load goals", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/goals', newGoal);
      setGoals([res.data, ...goals]);
      setNewGoal({ title: '', description: '', deadline: '' });
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to add goal", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleGoalStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Completed' ? 'In Progress' : 'Completed';
      const res = await api.put(`/goals/${id}`, { status: newStatus });
      setGoals(goals.map(g => g._id === id ? res.data : g));
    } catch (err) {
      console.error("Failed to update goal", err);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals(goals.filter(g => g._id !== id));
    } catch (err) {
      console.error("Failed to delete goal", err);
    }
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Your Goals</h1>
          <p className="text-foreground/60">Track your progress and reflect on your achievements.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
          <Plus className="w-5 h-5" /> Add Goal
        </button>
      </div>

      {showAddForm && (
        <motion.form 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAddGoal}
          className="glass p-6 rounded-2xl mb-8 space-y-4 border border-primary/20"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Goal Title</label>
            <input 
              type="text" required
              value={newGoal.title}
              onChange={e => setNewGoal({...newGoal, title: e.target.value})}
              className="w-full bg-background/50 border border-border rounded-xl py-2 px-3 text-foreground"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              value={newGoal.description}
              onChange={e => setNewGoal({...newGoal, description: e.target.value})}
              className="w-full bg-background/50 border border-border rounded-xl py-2 px-3 text-foreground resize-none"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Deadline (Optional)</label>
            <input 
              type="date"
              value={newGoal.deadline}
              onChange={e => setNewGoal({...newGoal, deadline: e.target.value})}
              className="w-full bg-background/50 border border-border rounded-xl py-2 px-3 text-foreground [color-scheme:dark]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm text-foreground/60 hover:text-foreground">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 disabled:opacity-70">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Goal'}
            </button>
          </div>
        </motion.form>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : goals.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center border-dashed border-2 border-border">
          <Target className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
          <p className="text-foreground/60">Set your first goal to start tracking your future achievements.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map(goal => (
            <motion.div 
              key={goal._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`glass p-6 rounded-2xl border-l-4 ${goal.status === 'Completed' ? 'border-l-green-500 opacity-70' : 'border-l-primary'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-4">
                  <h3 className={`text-xl font-semibold mb-1 ${goal.status === 'Completed' ? 'line-through text-foreground/60' : ''}`}>{goal.title}</h3>
                  <p className="text-sm text-foreground/70">{goal.description}</p>
                </div>
                <button onClick={() => toggleGoalStatus(goal._id, goal.status)} className="text-foreground/40 hover:text-green-500 transition-colors">
                  {goal.status === 'Completed' ? <CheckCircle2 className="w-7 h-7 text-green-500" /> : <Circle className="w-7 h-7" />}
                </button>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs text-foreground/50">
                  {goal.deadline && (
                    <>
                      <Calendar className="w-3 h-3" />
                      {new Date(goal.deadline).toLocaleDateString()}
                    </>
                  )}
                </div>
                <button onClick={() => deleteGoal(goal._id)} className="text-xs text-red-400 hover:text-red-300">
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Goals;
