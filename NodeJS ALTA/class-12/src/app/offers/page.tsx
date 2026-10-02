'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Package, Send, Check, X, Clock } from 'lucide-react';
import Link from 'next/link';

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');

  useEffect(() => {
    async function loadOffers() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('offers')
        .select('*, profiles(!inner), requested_listing:listings!inner(title, size), offered_listing:listings(title, size)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (data) setOffers(data);
      setLoading(false);
    }
    loadOffers();
  }, []);

  const handleResponse = async (offerId: string, status: 'ACCEPTED' | 'DECLINED') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('offers')
      .update({ status })
      .eq('id', offerId);

    if (error) {
      alert(error.message);
    } else {
      // If accepted, create an exchange record
      if (status === 'ACCEPTED') {
        const offer = offers.find(o => o.id === offerId);
        const { error: exchangeError } = await supabase.from('exchanges').insert({
          offer_id: offerId,
          user_a: offer.sender_id,
          user_b: offer.receiver_id,
          status: 'ACCEPTED',
        });
        if (exchangeError) alert('Offer accepted but exchange creation failed.');
      }
      // Refresh list
      window.location.reload();
    }
  };

  const filteredOffers = offers.filter(o =>
    activeTab === 'sent' ? o.sender_id === supabase.auth.getUser().then(res => res.data.user?.id) : o.receiver_id === supabase.auth.getUser().then(res => res.data.user?.id)
  );

  // Since we can't await in filter, I'll just handle it in a separate effect or use a state for userId
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));
  }, []);

  const finalOffers = offers.filter(o =>
    activeTab === 'sent' ? o.sender_id === userId : o.receiver_id === userId
  );

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading offers...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Exchange Offers</h1>
        <p className="text-sm text-zinc-500">Manage your clothing exchange requests.</p>
      </div>

      <div className="flex border-b border-zinc-200 mb-8">
        <Button
          variant={activeTab === 'received' ? 'primary' : 'ghost'}
          className="rounded-none border-b-2 border-transparent data-[active=true]:border-black"
          onClick={() => setActiveTab('received')}
        >
          Received
        </Button>
        <Button
          variant={activeTab === 'sent' ? 'primary' : 'ghost'}
          className="rounded-none border-b-2 border-transparent data-[active=true]:border-black"
          onClick={() => setActiveTab('sent')}
        >
          Sent
        </Button>
      </div>

      <div className="space-y-4">
        {finalOffers.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-300 rounded-sm">
            <Package size={32} className="mx-auto text-zinc-300 mb-3" />
            <p className="text-sm text-zinc-500">No {activeTab} offers yet.</p>
          </div>
        ) : (
          finalOffers.map((offer) => (
            <div key={offer.id} className="p-4 border border-zinc-200 rounded-sm bg-white flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-zinc-100 text-xs font-medium">
                  {offer.profiles?.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{offer.profiles?.username}</span>
                  <span className="text-xs text-zinc-500">
                    {activeTab === 'received' ? 'offered' : 'requested'} {offer.requested_listing?.title}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-between">
                <div className="text-right mr-4">
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-sm ${
                    offer.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                    offer.status === 'DECLINED' ? 'bg-red-100 text-red-700' :
                    'bg-zinc-100 text-zinc-600'
                  }`}>
                    {offer.status}
                  </span>
                </div>
                {offer.status === 'SENT' && activeTab === 'received' && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleResponse(offer.id, 'DECLINED')} className="text-red-600 hover:bg-red-50">
                      <X size={14} />
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleResponse(offer.id, 'ACCEPTED')} className="flex items-center gap-1">
                      <Check size={14} />
                      Accept
                    </Button>
                  </div>
                )}
                {offer.status === 'ACCEPTED' && (
                  <Link href={`/exchanges/${offer.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      View Exchange <ArrowRight size={14} />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Simple ArrowRight component for the Link
function ArrowRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}
