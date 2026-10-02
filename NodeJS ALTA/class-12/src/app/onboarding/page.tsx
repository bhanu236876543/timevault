'use client'

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { MapPin, User } from 'lucide-react';

export default function OnboardingPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
  const router = useRouter();

  const handleGetLocation = () => {
    setLocationStatus('loading');
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLocationStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus('success');
      },
      (err) => {
        console.error(err);
        setError('Could not determine your location. Please enable location permissions.');
        setLocationStatus('error');
      }
    );
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('You must be logged in to complete onboarding.');
      setLoading(false);
      return;
    }

    // Convert coords to PostGIS point string: POINT(lng lat)
    const locationPoint = coords
      ? `POINT(${coords.lng} ${coords.lat})`
      : null;

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        username,
        location: locationPoint,
      })
      .eq('id', user.id);

    if (profileError) {
      setError(profileError.message);
    } else {
      router.push('/profile');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Complete your profile</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Tell us a bit about yourself to start exchanging.
          </p>
        </div>
        <form onSubmit={handleComplete} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User size={16} />
              Username
            </label>
            <Input
              type="text"
              placeholder="e.g. alex_clothes"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin size={16} />
              Your Location
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleGetLocation}
                disabled={locationStatus === 'loading' || locationStatus === 'success'}
              >
                {locationStatus === 'loading' ? 'Fetching...' :
                 locationStatus === 'success' ? 'Location set!' : 'Set Current Location'}
              </Button>
              {locationStatus === 'success' && (
                <Button type="button" variant="ghost" size="sm" onClick={() => {
                  setCoords(null);
                  setLocationStatus('idle');
                }}>
                  Clear
                </Button>
              )}
            </div>
            {locationStatus === 'success' && (
              <p className="text-xs text-green-600">
                Location captured. We only use this to find matches within 1km.
              </p>
            )}
            {locationStatus === 'error' && (
              <p className="text-xs text-red-600">
                {error}
              </p>
            )}
          </div>
          {error && (
            <div className="p-3 rounded-sm bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading || !username || !coords}>
            {loading ? 'Saving...' : 'Get Started'}
          </Button>
        </form>
      </div>
    </div>
  );
}
