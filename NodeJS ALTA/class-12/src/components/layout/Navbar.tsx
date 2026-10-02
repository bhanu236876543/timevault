'use client'

import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { User, Package, MapPin, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="border-b border-zinc-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              LOCAL LOOP
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
              <Link href="/discover" className="hover:text-black transition-colors flex items-center gap-2">
                <MapPin size={16} />
                Discover
              </Link>
              <Link href="/list" className="hover:text-black transition-colors flex items-center gap-2">
                <Package size={16} />
                List Item
              </Link>
              <Link href="/offers" className="hover:text-black transition-colors">
                Offers
              </Link>
              <Link href="/exchanges" className="hover:text-black transition-colors">
                Exchanges
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="text-sm font-medium text-zinc-600 hover:text-black transition-colors flex items-center gap-2">
                  <User size={16} />
                  Profile
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Join</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
