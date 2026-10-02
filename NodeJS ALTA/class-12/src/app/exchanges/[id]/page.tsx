'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Calendar, Clock, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function ExchangeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const exchangeId = params.id as string;

  const [exchange, setExchange] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [meetingForm, setMeetingForm] = useState({ date: '', time: '', area: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    async function loadExchange() {
      const { data, error } = await supabase
        .from('exchanges')
        .select('*, user_a(profiles(*)), user_b(profiles(*))')
        .eq('id', exchangeId)
        .single();

      if (data) setExchange(data);
      setLoading(false);
    }
    loadExchange();
  }, [exchangeId]);

  const handleSetMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    const { error } = await supabase
      .from('exchanges')
      .update({
        meeting_date: meetingForm.date,
        meeting_time: meetingForm.time,
        meeting_area: meetingForm.area,
        status: 'MEETING_CONFIRMED',
      })
      .eq('id', exchangeId);

    if (error) alert(error.message);
    else {
      setExchange({ ...exchange, ...meetingForm, status: 'MEETING_CONFIRMED' });
    }
    setSubmitLoading(false);
  };

  const handleConfirmExchange = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isUserA = exchange.user_a === user.id;
    const updateField = isUserA ? 'user_a_confirmed' : 'user_b_confirmed';

    const { error } = await supabase
      .from('exchanges')
      .update({ [updateField]: true })
      .eq('id', exchangeId);

    if (error) alert(error.message);
    else {
      // Check if both confirmed
      const { data: updated } = await supabase
        .from('exchanges')
        .select('user_a_confirmed, user_b_confirmed')
        .eq('id', exchangeId)
        .single();

      if (updated?.user_a_confirmed && updated?.user_b_confirmed) {
        await supabase
          .from('exchanges')
          .update({ status: 'COMPLETED', completed_at: new Date().toISOString() })
          .eq('id', exchangeId);
      }
      window.location.reload();
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading exchange...</div>;
  if (!exchange) return <div className="flex min-h-screen items-center justify-center">Exchange not found.</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Exchange Details</h1>
        <p className="text-sm text-zinc-500">Coordinate your meeting and confirm the swap.</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-sm p-6 space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold">
              {exchange.user_a?.profiles?.username?.[0]?.toUpperCase()}
            </div>
            <span className="font-medium">{exchange.user_a?.profiles?.username}</span>
          </div>
          <span className="text-zinc-300">↔</span>
          <div className="flex items-center gap-4">
            <span className="font-medium">{exchange.user_b?.profiles?.username}</span>
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold">
              {exchange.user_b?.profiles?.username?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            exchange.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
            exchange.status === 'MEETING_CONFIRMED' ? 'bg-blue-100 text-blue-700' :
            'bg-zinc-100 text-zinc-600'
          }`}>
            {exchange.status}
          </span>
        </div>

        {exchange.status === 'ACCEPTED' && (
          <form onSubmit={handleSetMeeting} className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Calendar size={16} />
              Arrange Meeting
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-zinc-500">Date</label>
                <Input type="date" required value={meetingForm.date} onChange={e => setMeetingForm({...meetingForm, date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-zinc-500">Time</label>
                <Input type="time" required value={meetingForm.time} onChange={e => setMeetingForm({...meetingForm, time: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-zinc-500 flex items-center gap-1">
                <MapPin size={12} />
                Public Meeting Area
              </label>
              <Input placeholder="e.g. University Library Entrance" required value={meetingForm.area} onChange={e => setMeetingForm({...meetingForm, area: e.target.value})} />
            </div>
            <Button type="submit" className="w-full" disabled={submitLoading}>
              {submitLoading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Meeting Details'}
            </Button>
          </form>
        )}

        {exchange.status === 'MEETING_CONFIRMED' && (
          <div className="space-y-6">
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-zinc-400" />
                <span className="font-medium">{exchange.meeting_date} at {exchange.meeting_time}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-zinc-400" />
                <span className="font-medium">{exchange.meeting_area}</span>
              </div>
            </div>
            <div className="text-center space-y-4">
              <p className="text-sm text-zinc-500">Once you have physically exchanged the clothes, please confirm below.</p>
              <Button onClick={handleConfirmExchange} className="w-full flex items-center gap-2">
                <CheckCircle size={18} />
                I have received the item
              </Button>
            </div>
          </div>
        )}

        {exchange.status === 'COMPLETED' && (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold">Exchange Completed!</h3>
            <p className="text-sm text-zinc-500">You have successfully traded your clothes.</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push('/exchanges')}>
              Back to my exchanges
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
