'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, MapPin, Package, Handshake, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Introduction */}
      <section className="px-4 py-16 sm:py-24 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 mb-6">
          Exchange clothes with people nearby.
        </h1>
        <p className="text-lg text-zinc-600 mb-10 max-w-2xl mx-auto">
          List clothes you no longer wear, find nearby matches, and arrange the exchange yourself.
          A simple, local way to refresh your wardrobe.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/discover">
            <Button size="lg" className="w-full sm:w-auto flex items-center gap-2">
              Explore nearby
              <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/list">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              List an item
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { icon: Package, title: 'List', text: 'Upload photos and details of your item.' },
              { icon: MapPin, title: 'Match', text: 'Find someone nearby looking for your size.' },
              { icon: Handshake, title: 'Agree', text: 'Make an offer and agree on an exchange.' },
              { icon: MapPin, title: 'Meet', text: 'Meet at a safe public location within 1km.' },
              { icon: CheckCircle, title: 'Exchange', text: 'Trade clothes and confirm the swap.' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 shadow-sm">
                  <step.icon size={20} />
                </div>
                <h3 className="font-medium text-sm">{step.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Focus */}
      <section className="px-4 py-16 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">Why local?</h2>
        <p className="text-zinc-600 leading-relaxed">
          We keep exchanges simple and safe. Phase 1 connects people within a 1 kilometer radius,
          making it easy to meet up quickly without the need for shipping or delivery services.
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500">
          <div className="font-bold text-black tracking-tighter">LOCAL LOOP</div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
            <Link href="/help" className="hover:text-black transition-colors">Help</Link>
          </div>
          <div>
            © {new Date().getFullYear()} Local Loop
          </div>
        </div>
      </footer>
    </div>
  );
}
