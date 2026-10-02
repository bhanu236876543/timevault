'use client'

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { Package, Image as ImageIcon, Loader2, X } from 'lucide-react';

const CATEGORIES = ['T-shirt', 'Shirt', 'Hoodie', 'Sweatshirt', 'Jacket', 'Jeans', 'Trousers'];
const CONDITIONS = ['Like New', 'Good', 'Fair'];

export default function ListPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    color: '',
    style: '',
    brand: '',
    wantInExchange: '',
  });

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadImages = async (listingId: string) => {
    const uploadedUrls: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${listingId}/${Math.random()}.${fileExt}`;
      const filePath = `listings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('clothing-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('clothing-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get current location from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('location')
        .eq('id', user.id)
        .single();

      if (!profile?.location) {
        throw new Error('Please set your location in your profile first.');
      }

      // 1. Create listing
      const { data: listing, error: listError } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          ...formData,
          location: profile.location,
          status: 'AVAILABLE',
        })
        .select()
        .single();

      if (listError) throw listError;

      // 2. Upload images
      if (images.length > 0) {
        const urls = await handleUploadImages(listing.id);
        const imagesData = urls.map((url, index) => ({
          listing_id: listing.id,
          url: url,
          display_order: index,
        }));
        const { error: imgError } = await supabase.from('listing_images').insert(imagesData);
        if (imgError) throw imgError;
      }

      router.push('/profile');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">List an item</h1>
        <p className="text-sm text-zinc-500">Give your clothes a second life.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Photos Section */}
        <div className="space-y-4">
          <label className="text-sm font-medium flex items-center gap-2">
            <ImageIcon size={16} />
            Photos
          </label>
          <div className="grid grid-cols-3 gap-4">
            {previews.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-sm overflow-hidden border border-zinc-200">
                <img src={url} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-zinc-100"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-sm border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 transition-colors text-zinc-400">
              <ImageIcon size={24} />
              <span className="text-xs mt-2">Add Photo</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
          <p className="text-xs text-zinc-500">Upload high-quality photos to get more matches.</p>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="e.g. Vintage Levi's 501"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Brand</label>
            <Input
              placeholder="e.g. Levi's"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              className="w-full h-10 rounded-sm border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Size</label>
            <Input
              placeholder="e.g. M, 32x30, EU 42"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Condition</label>
            <select
              className="w-full h-10 rounded-sm border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              required
            >
              <option value="">Select Condition</option>
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <Input
              placeholder="e.g. Navy Blue"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Style</label>
          <Input
            placeholder="e.g. Casual, Streetwear, Minimalist"
            value={formData.style}
            onChange={(e) => setFormData({ ...formData, style: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            rows={3}
            placeholder="Tell potential exchangers about the item..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-sm space-y-4">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Handshake size={16} />
            What are you looking for in exchange?
          </label>
          <textarea
            className="w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            rows={2}
            placeholder="e.g. Looking for a size L shirt in a casual style, open to alternatives."
            value={formData.wantInExchange}
            onChange={(e) => setFormData({ ...formData, wantInExchange: e.target.value })}
          />
          <p className="text-xs text-zinc-500">This helps others determine if they are a good match for you.</p>
        </div>

        {error && (
          <div className="p-3 rounded-sm bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Publishing Listing...
            </span>
          ) : 'Publish Listing'}
        </Button>
      </form>
    </div>
  );
}
