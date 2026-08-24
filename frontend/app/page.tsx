"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { strapiGet } from "@/lib/strapi";
import type { StrapiEvent, StrapiResponse } from "@/types";
import EventCard from "@/components/events/EventCard";

const categories = [
  { name: "Music", icon: "🎵", color: "bg-rose-50 border-rose-200 hover:bg-rose-100" },
  { name: "Sports", icon: "⚽", color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100" },
  { name: "Technology", icon: "💻", color: "bg-blue-50 border-blue-200 hover:bg-blue-100" },
  { name: "Art & Culture", icon: "🎨", color: "bg-amber-50 border-amber-200 hover:bg-amber-100" },
  { name: "Food & Drink", icon: "🍕", color: "bg-orange-50 border-orange-200 hover:bg-orange-100" },
  { name: "Community", icon: "🤝", color: "bg-teal-50 border-teal-200 hover:bg-teal-100" },
];

const steps = [
  { number: "1", title: "Browse", description: "Explore events on the map or in the list view" },
  { number: "2", title: "RSVP", description: "Register for events that interest you" },
  { number: "3", title: "Attend", description: "Show up and enjoy the event" },
];

export default function Home() {
  const [events, setEvents] = useState<StrapiEvent[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await strapiGet<StrapiResponse<StrapiEvent>>(
          "/events?populate=*&sort=date:asc"
        );
        setEvents(res.data);
      } catch {
        // Backend not running
      }
    }
    fetchEvents();
  }, []);

  const featuredEvents = events.filter((e) => e.isFeatured).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">EventHub</h1>
          <p className="text-xl text-blue-100 mb-8">
            Discover amazing events near you
          </p>
          <Link
            href="/events"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Browse Events
          </Link>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Events</h2>
            <Link href="/events" className="text-sm text-blue-600 hover:underline font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Categories Preview */}
      <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/events?category=${encodeURIComponent(cat.name)}`}
                className={`flex flex-col items-center p-6 rounded-xl border transition-colors ${cat.color}`}
              >
                <span className="text-3xl mb-2">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
