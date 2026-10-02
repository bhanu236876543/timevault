'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Star, CheckCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function RatePage() {
  const params = useParams();
  const router = useRouter();
  const exchangeId = params.id as string;

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [reviewee, setReviewee] = useState<any>(null);

  useEffect(() => {
    async function loadExchange() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: exchange } = await supabase
        .from('exchanges')
        .select('*, user_a(profiles(*)), user_b(profiles(*))')
        .eq('id', exchangeId)
        .single();

      if (exchange) {
        // The reviewee is the other person in the exchange
        const revieweeProfile = exchange.user_a?.id === user.id ? exchange.user_b : exchange.user_a;
        setReviewee(revieweeProfile);
      }
    }
    loadExchange();
  }, [exchangeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Submit rating
      const { error: rateError } = await supabase.from('ratings').insert({
        exchange_id: exchangeId,
        reviewer_id: user.id,
        reviewee_id: reviewee.id,
        rating,
        review,
      });

      if (rateError) throw rateError;

      // 2. Update reviewee's average rating in profiles
      const { data: allRatings } = await supabase
        .from('ratings')
        .select('rating')
        .eq('reviewee_id', reviewee.id);

      const avg = allRatings.reduce((acc, r) => acc + r.rating, 0) / allRatings.length;

      await supabase
        .from('profiles')
        .update({ average_rating: avg })
        .eq('id', reviewee.id);

      setCompleted(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold">Thank you!</h1>
        <p className="text-zinc-500 max-w-xs mx-auto">Your feedback helps keep Local Loop a trusted community.</p>
        <Button onClick={() => router.push('/exchanges')} className="mt-4">Back to my exchanges</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Rate your exchange</h1>
        <p className="text-sm text-zinc-500 mt-2">How was your experience with {reviewee?.profiles?.username}?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                fill={star <= rating ? 'currentColor' : 'none'}
                className={star <= rating ? 'text-yellow-400' : 'text-zinc-300'}
              />
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Your review (optional)</label>
          <textarea
            className="w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            rows={4}
            placeholder="How was the item? Was the meeting smooth?"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading || rating === 0}>
          {loading ? 'Submitting...' : 'Submit Rating'}
        </Button>
      </form>
    </div>
  );
}
