'use client'

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    targetId: '',
    targetType: 'listing',
    reason: 'misleading listing',
    details: '',
  });

  const router = useRouter();

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to report.');

      const { error } = await supabase.from('reports').insert({
        reporter_id: user.id,
        target_id: formData.targetId,
        target_type: formData.targetType,
        reason: formData.reason,
        details: formData.details,
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold">Report Submitted</h1>
        <p className="text-zinc-500 max-w-xs mx-auto">Our team will review the report and take appropriate action.</p>
        <Button onClick={() => router.push('/discover')} className="mt-4">Back to discovery</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Report an Issue</h1>
        <p className="text-sm text-zinc-500 mt-2">Help us keep Local Loop safe and honest.</p>
      </div>

      <form onSubmit={handleReport} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">What are you reporting?</label>
          <select
            className="w-full h-10 rounded-sm border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            value={formData.targetType}
            onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
          >
            <option value="listing">A Clothing Listing</option>
            <option value="user">A User Profile</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">ID of listing or user</label>
          <Input
            placeholder="Paste the ID here"
            value={formData.targetId}
            onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Reason</label>
          <select
            className="w-full h-10 rounded-sm border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          >
            <option value="misleading listing">Misleading Listing</option>
            <option value="inappropriate content">Inappropriate Content</option>
            <option value="unsafe behavior">Unsafe Behavior</option>
            <option value="counterfeit item">Counterfeit Item</option>
            <option value="damaged item misrepresented">Damaged Item Misrepresented</option>
            <option value="suspicious behavior">Suspicious Behavior</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Details</label>
          <textarea
            className="w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            rows={4}
            placeholder="Please provide more information..."
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </form>
    </div>
  );
}
