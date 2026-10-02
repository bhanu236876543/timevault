'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Clock, CheckCircle, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ExchangesPage() {
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExchanges() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('exchanges')
        .select('*, user_a(profiles(*)), user_b(profiles(*))')
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (data) setExchanges(data);
      setLoading(false);
    }
    loadExchanges();
  }, []);

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading exchanges...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">My Exchanges</h1>
        <p className="text-sm text-zinc-500">Track your active and completed clothing swaps.</p>
      </div>

      <div className="space-y-6">
        {exchanges.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-300 rounded-sm">
            <p className="text-sm text-zinc-500">You haven't had any exchanges yet.</p>
            <Link href="/discover">
              <Button variant="outline" className="mt-4">Discover nearby items</Button>
            </Link>
          </div>
        ) : (
          exchanges.map((ex) => (
            <div key={ex.id} className="p-5 border border-zinc-200 rounded-sm bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold">
                  {ex.user_a?.profiles?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{ex.user_a?.profiles?.username}</span>
                    <span className="text-zinc-300">↔</span>
                    <span className="text-sm font-medium">{ex.user_b?.profiles?.username}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${
                      ex.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      ex.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {ex.status}
                    </span>
                    {ex.meeting_date && (
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {ex.meeting_date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Link href={`/exchanges/${ex.id}`}>
                <Button variant="outline" size="sm">Manage Exchange</Button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
