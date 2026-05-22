import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Image as ImageIcon, Sparkles, Loader2, ArrowLeft, Lock, Upload } from 'lucide-react';
import api from '../api/axios';

const AddMemory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal',
    unlockDate: ''
  });

  const categories = ['Personal', 'Career', 'Fitness', 'Relationships', 'Travel'];

  // Calculate minimum date (tomorrow)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length > 5) {
        setError('Maximum 5 photos allowed.');
        return;
      }
      setFiles(selectedFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setError('Please select at least one photo.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('unlockDate', formData.unlockDate);
      files.forEach(file => {
        data.append('photos', file);
      });

      await api.post('/memories', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to seal your memory. Please try again.');
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
          <div className="p-4 bg-blue-500/10 rounded-2xl">
            <ImageIcon className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Preserve a Memory</h1>
            <p className="text-foreground/60">Upload photos to be revealed in the future.</p>
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
              className="w-full bg-background/50 border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-lg"
              placeholder="e.g., Summer Trip 2024"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/80">Description</label>
            <textarea 
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full bg-background/50 border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none leading-relaxed"
              placeholder="Describe this memory..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/80 flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-500" /> Upload Photos (Max 5)
            </label>
            <input 
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full bg-background/50 border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-500 hover:file:bg-blue-500/20"
            />
            {files.length > 0 && (
              <p className="text-sm text-foreground/60">{files.length} photo(s) selected.</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" /> Category
              </label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-background text-foreground">{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" /> Unlock Date
              </label>
              <input 
                type="date" 
                required
                min={minDate}
                value={formData.unlockDate}
                onChange={(e) => setFormData({...formData, unlockDate: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Lock className="w-5 h-5" /> Seal into the Vault
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddMemory;
