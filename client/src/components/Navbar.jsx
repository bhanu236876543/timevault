import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight">TimeVault</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Home</Link>
          <Link to="/features" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Features</Link>
          <Link to="/pricing" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Log in
          </Link>
          <Link to="/register" className="text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
