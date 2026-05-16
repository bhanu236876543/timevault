import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Clock, Lock, Target } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center flex-1 w-full mt-12 md:mt-24">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Your memories, secured for the future
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50"
        >
          Send Letters to <br/> Your Future Self
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-foreground/60 mb-10 max-w-2xl"
        >
          TimeVault is a secure digital capsule for your thoughts, memories, and goals. 
          Lock them away and discover them again when the time is right.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-all transform hover:-translate-y-1">
            Start Your Vault
          </Link>
          <Link to="/login" className="w-full sm:w-auto px-8 py-4 glass text-foreground font-semibold rounded-xl hover:bg-white/10 transition-all border border-border">
            Login to Vault
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 pb-20">
        {[
          {
            icon: <Mail className="w-6 h-6 text-primary" />,
            title: "Future Letters",
            desc: "Write to yourself 1, 5, or 10 years from now. We'll deliver it when the time comes."
          },
          {
            icon: <Lock className="w-6 h-6 text-primary" />,
            title: "Secure Vault",
            desc: "Your memories are encrypted and locked. Only you can access them when unlocked."
          },
          {
            icon: <Target className="w-6 h-6 text-primary" />,
            title: "Track Goals",
            desc: "Set long-term goals and reflect on your progress when your capsule opens."
          }
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-foreground/60">{feature.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Home;
