'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Package, MapPin, Ruler, Tag, ArrowLeft, Send } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offerMessage, setOfferMessage] = useState('');
  const [offerLoading, setOfferLoading] = useState(false);

  useEffect(() => {
    async function loadListing() {
      try {
        const { data, error: fetchError } = await supabase
          .from('listings')
          .select('*, profiles(*)')
          .eq('id', listingId)
          .single();

        if (fetchError) throw fetchError;

        const { data: images } = await supabase
          .from('listing_images')
          .select('url')
          .eq('listing_id', listingId)
          .order('display_order', { ascending: true });

        setListing({ ...data, images: images || [] });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadListing();
  }, [listingId]);

  const handleMakeOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setOfferLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to make an offer.');

      // To make a proper offer, the user needs to choose one of their own listings to offer in return.
      // For MVP simplification, we will redirect them to a "Select Your Item" page or a modal.
      // Here, we'll just notify them that they need to select an item.
      alert('Please go to your profile to select which of your items you want to offer in exchange.');
      router.push('/profile');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setOfferLoading(false);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading listing...</div>;
  if (error || !listing) return <div className="flex min-h-screen items-center justify-center">Listing not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link href="/discover" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft size={16} />
        Back to discovery
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-sm overflow-hidden bg-zinc-100 border border-zinc-200">
            {listing.images && listing.images.length > 0 ? (
              <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                <Package size={48} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {listing.images?.slice(1).map((img: any, i: number) => (
              <div key={i} className="aspect-square rounded-sm overflow-hidden border border-zinc-200 cursor-pointer hover:opacity-80">
                <img src={img.url} alt="detail" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Listing Details */}
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold tracking-tight">{listing.title}</h1>
              <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs font-medium rounded-sm border border-zinc-200">
                {listing.condition}
              </span>
            </div>
            <p className="text-sm text-zinc-500 flex items-center gap-1">
              <MapPin size={14} />
              Listed by {listing.profiles?.username} • Within 1 km
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-y border-zinc-200 py-6">
            <div className="flex items-center gap-3 text-sm">
              <Ruler size={16} className="text-zinc-400" />
              <span className="text-zinc-600">Size:</span>
              <span className="font-medium">{listing.size}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Tag size={16} className="text-zinc-400" />
              <span className="text-zinc-600">Category:</span>
              <span className="font-medium">{listing.category}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-zinc-600">Color:</span>
              <span className="font-medium">{listing.color || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-zinc-600">Brand:</span>
              <span className="font-medium">{listing.brand || 'Generic'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Description</h3>
            <p className="text-zinc-600 leading-relaxed">
              {listing.description || 'No description provided.'}
            </p>
          </div>

          <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-sm space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Handshake size={16} />
              Exchange Preference
            </h3>
            <p className="text-sm text-zinc-600 italic">
              {listing.wantInExchange || 'Open to suitable alternatives.'}
            </p>
          </div>

          {/* Offer Action */}
          <div className="space-y-4">
            <form onSubmit={handleMakeOffer} className="flex gap-2">
              <Input
                placeholder="Add a short message..."
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={offerLoading} className="flex items-center gap-2">
                {offerLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Make Offer
              </Button>
            </form>
            <p className="text-[10px] text-zinc-400 text-center">
              Making an offer means you agree to propose one of your own items in exchange.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
