'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ListingCard } from '@/components/listings/ListingCard';
import { Loader2, Filter, MapPin } from 'lucide-react';

export default function DiscoverPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    size: '',
  });
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    async function init() {
      try {
        // 1. Get user location
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('location')
          .eq('id', user.id)
          .single();

        if (!profile?.location) {
          setError('Please set your location in your profile to discover nearby items.');
          setLoading(false);
          return;
        }

        // Extract lat/lng from PostGIS point "POINT(lng lat)"
        const coordsStr = profile.location.replace('POINT(', '').replace(')', '');
        const [lng, lat] = coordsStr.split(' ').map(Number);
        setUserLocation({ lat, lng });

        await fetchListings(lat, lng);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function fetchListings(lat: number, lng: number) {
    setLoading(true);
    try {
      // Call RPC function for location-based search
      const { data, error } = await supabase.rpc('get_nearby_listings', {
        user_lat: lat,
        user_lng: lng,
        category_filter: filters.category ? [filters.category] : null,
        size_filter: filters.size ? [filters.size] : null,
      });

      if (error) throw error;

      // Enhance with image urls
      const enhancedListings = await Promise.all(data.map(async (l: any) => {
        const { data: images } = await supabase
          .from('listing_images')
          .select('url')
          .eq('listing_id', l.id)
          .order('display_order', { ascending: true })
          .limit(1);

        return {
          ...l,
          image_url: images?.[0]?.url,
        };
      }));

      setListings(enhancedListings);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (userLocation) {
      fetchListings(userLocation.lat, userLocation.lng);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nearby Discovery</h1>
          <p className="text-sm text-zinc-500 flex items-center gap-1 mt-1">
            <MapPin size={14} />
            Showing items within 1 km of you
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Input
              placeholder="Filter size..."
              value={filters.size}
              onChange={(e) => handleFilterChange('size', e.target.value)}
              className="pl-8"
            />
            <div className="absolute left-2 top-2.5 text-zinc-400">
              <Filter size={14} />
            </div>
          </div>
          <select
            className="h-10 rounded-sm border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {['T-shirt', 'Shirt', 'Hoodie', 'Sweatshirt', 'Jacket', 'Jeans', 'Trousers'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 size={32} className="animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-500">Finding nearby clothes...</p>
        </div>
      ) : error ? (
        <div className="text-center py-32 space-y-4">
          <p className="text-zinc-600">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-32 space-y-4">
          <div className="mx-auto w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
            <Package size={32} />
          </div>
          <h2 className="text-xl font-medium">No clothes available nearby yet.</h2>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto">
            Be the first to list something and help your community trade.
          </p>
          <Link href="/list">
            <Button className="mt-4">List your first item</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              matchType="Good"
              matchReason="Matches your general preferences."
            />
          ))}
        </div>
      )}
    </div>
  );
}
