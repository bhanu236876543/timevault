import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Settings = () => {
  const { user, login } = useAuth(); // login function in AuthContext updates user state
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || ''
  });
  const [file, setFile] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const data = new FormData();
      if (formData.name !== user.name) data.append('name', formData.name);
      if (file) data.append('profilePicture', file);

      const res = await api.put('/auth/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update local storage and context
      const currentToken = localStorage.getItem('token');
      localStorage.setItem('user', JSON.stringify(res.data));
      login(res.data, currentToken); // update context
      
      setMessage('Profile updated successfully!');
      setFile(null);
    } catch (err) {
      setMessage('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const getProfileUrl = () => {
    if (file) return URL.createObjectURL(file);
    if (user?.profilePicture) {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const baseUrl = apiBase.replace('/api', '');
      return `${baseUrl}${user.profilePicture}`;
    }
    return null;
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto mt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-foreground/60">Manage your profile and preferences.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-2xl border border-border"
      >
        {message && (
          <div className={`p-4 rounded-xl mb-6 ${message.includes('success') ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-background/50 border-2 border-primary/50 flex items-center justify-center">
                {getProfileUrl() ? (
                  <img src={getProfileUrl()} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-foreground/20" />
                )}
              </div>
              <label className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                <Camera className="w-8 h-8 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
              </label>
            </div>
            <p className="text-sm text-foreground/50 mt-2">Click to change avatar</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Email Address (Read-only)</label>
            <input 
              type="email" 
              disabled
              value={user?.email || ''}
              className="w-full bg-background/30 border border-border/50 rounded-xl py-3 px-4 text-foreground/50 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Display Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-background/50 border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="pt-4 border-t border-border/50">
            <button 
              type="submit" 
              disabled={isLoading || (!file && formData.name === user?.name)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Settings;
