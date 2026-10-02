'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { MapPin, Ruler, Tag } from 'lucide-react';

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    category: string;
    size: string;
    condition: string;
    distance: number;
    image_url?: string;
  };
  matchType?: 'Strong' | 'Good' | 'Possible' | null;
  matchReason?: string;
}

export const ListingCard = ({ listing, matchType, matchReason }: ListingCardProps) => {
  return (
    <div className="group bg-white border border-zinc-200 rounded-sm overflow-hidden hover:border-zinc-400 transition-colors flex flex-col">
      <div className="aspect-square relative overflow-hidden bg-zinc-100">
        {listing.image_url ? (
          <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            <Tag size={32} />
          </div>
        )}
        {matchType && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider rounded-sm border border-zinc-200">
            {matchType} Match
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm line-clamp-1">{listing.title}</h3>
          <span className="text-[10px] text-zinc-500 flex items-center gap-1">
            <MapPin size={10} />
            {listing.distance.toFixed(1)} km
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded-sm flex items-center gap-1">
            <Ruler size={10} />
            {listing.size}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded-sm">
            {listing.category}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded-sm">
            {listing.condition}
          </span>
        </div>
        {matchReason && (
          <p className="text-xs text-zinc-500 mb-4 italic line-clamp-2">
            "{matchReason}"
          </p>
        )}
        <Link href={`/listings/${listing.id}`} className="mt-auto">
          <Button variant="outline" size="sm" className="w-full">
            View Item
          </Button>
        </Link>
      </div>
    </div>
  );
};
