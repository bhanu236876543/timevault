'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, MapPin, Award, Package, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', bio: '' });
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
        setEditForm({ username: data.username, bio: data.bio || '' });
      }
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        username: editForm.username,
        bio: editForm.bio,
      })
      .eq('id', user.id);

    if (error) {
      alert(error.message);
    } else {
      setProfile({ ...profile, ...editForm });
      setEditing(false);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (!profile) return <div className="flex min-h-screen items-center justify-center">Profile not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Profile Info */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-zinc-200 border border-zinc-300 mb-4 overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-3xl">
                  {profile.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            <p className="text-sm text-zinc-500 mb-4">{profile.bio || 'No bio yet'}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500 flex items-center gap-2">
                <Award size={16} />
                Avg Rating
              </span>
              <span className="font-medium">{profile.average_rating || 'No ratings'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500 flex items-center gap-2">
                <Package size={16} />
                Exchanges
              </span>
              <span className="font-medium">{profile.completed_exchanges_count || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500 flex items-center gap-2">
                <MapPin size={16} />
                Location
              </span>
              <span className="font-medium">Within 1km</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {editing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6 bg-white p-6 border border-zinc-200 rounded-sm">
              <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <textarea
                    className="w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-zinc-200 rounded-sm space-y-2">
                  <h3 className="font-medium">Active Listings</h3>
                  <p className="text-3xl font-bold">0</p>
                  <Link href="/list" className="text-sm text-blue-600 hover:underline">Manage listings &rarr;</Link>
                </div>
                <div className="p-6 border border-zinc-200 rounded-sm space-y-2">
                  <h3 className="font-medium">Completed Exchanges</h3>
                  <p className="text-3xl font-bold">{profile.completed_exchanges_count || 0}</p>
                  <Link href="/exchanges" className="text-sm text-blue-600 hover:underline">View history &rarr;</Link>
                </div>
              </div>
              <div className="p-6 border border-zinc-200 rounded-sm space-y-4">
                <h3 className="font-medium">Account Settings</h3>
                <div className="flex flex-col gap-3">
                  <Link href="/settings" className="flex items-center justify-between p-2 hover:bg-zinc-50 rounded-sm transition-colors text-sm">
                    <span className="flex items-center gap-2"><Settings size={16} /> Privacy & Security</span>
                    <span className="text-zinc-400">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
