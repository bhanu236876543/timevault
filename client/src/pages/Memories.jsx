import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Plus, Loader2, Lock, LockOpen, Clock } from 'lucide-react';
import api from '../api/axios';

const Memories = () => {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const res = await api.get('/memories');
      setMemories(res.data);
    } catch (err) {
      console.error("Failed to load memories", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (path) => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const baseUrl = apiBase.replace('/api', '');
    return `${baseUrl}${path}`;
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Memory Vault</h1>
          <p className="text-foreground/60">Photos and moments sealed for the future.</p>
        </div>
        <Link 
          to="/add-memory"
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        >
          <Plus className="w-5 h-5" /> Seal Memory
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : memories.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center border-dashed border-2 border-border max-w-2xl mx-auto">
          <ImageIcon className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No memories sealed</h3>
          <p className="text-foreground/60 mb-6">Upload photos to be revealed in the future.</p>
          <Link to="/add-memory" className="inline-flex px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all">
            Add First Memory
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map(memory => (
            <motion.div 
              key={memory._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl overflow-hidden group border border-border"
            >
              <div className="aspect-video bg-background/50 relative overflow-hidden flex items-center justify-center">
                {memory.isUnlocked && memory.photos?.length > 0 ? (
                  <img src={getImageUrl(memory.photos[0])} alt={memory.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6 bg-gradient-to-br from-background to-blue-900/20 w-full h-full flex flex-col items-center justify-center">
                    <Lock className="w-10 h-10 text-blue-500/50 mb-2" />
                    <span className="text-sm font-medium text-blue-500/80">Sealed Memory</span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-md flex items-center gap-1 backdrop-blur-md ${memory.isUnlocked ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                    {memory.isUnlocked ? <LockOpen className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {memory.isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold truncate">{memory.title}</h3>
                  <span className="text-xs px-2 py-1 bg-white/5 rounded-md text-foreground/60">{memory.category}</span>
                </div>
                {memory.isUnlocked ? (
                  <p className="text-sm text-foreground/70 line-clamp-2">{memory.description}</p>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-foreground/50 mt-2">
                    <Clock className="w-4 h-4" />
                    Unlocks on {new Date(memory.unlockDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Memories;
