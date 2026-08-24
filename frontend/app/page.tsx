"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { strapiGet } from "@/lib/strapi";
import type { StrapiEvent, StrapiResponse } from "@/types";

const categoryBadgeColors: Record<string, string> = {
  music: "bg-blue-600",
  sports: "bg-green-600",
  technology: "bg-purple-600",
  "art-culture": "bg-orange-500",
  "food-drink": "bg-red-500",
  community: "bg-teal-600",
};

const slugToName: Record<string, string> = {
  music: "Music",
  sports: "Sports",
  technology: "Technology",
  "art-culture": "Art & Culture",
  "food-drink": "Food & Drink",
  community: "Community",
};

function getCategoryBadge(slug: string): { name: string; color: string } {
  const name = slugToName[slug] || "Event";
  const color = categoryBadgeColors[slug] || "bg-gray-600";
  return { name, color };
}

function getCategoryName(event: StrapiEvent): string {
  return event.category?.name || slugToName[event.categorySlug || ""] || "Uncategorized";
}

const categories = ["All", "Music", "Sports", "Technology", "Art & Culture", "Food & Drink", "Community"];

export default function Home() {
  const [events, setEvents] = useState<StrapiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await strapiGet<StrapiResponse<StrapiEvent>>("/events?sort=date:asc");
        setEvents(res.data);
      } catch {
        // Backend not running
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const featuredEvents = events.filter((e) => e.isFeatured).slice(0, 6);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        event.title.toLowerCase().includes(q) ||
        event.venue?.toLowerCase().includes(q) ||
        event.city?.toLowerCase().includes(q) ||
        event.description?.toLowerCase().includes(q);
      const eventName = getCategoryName(event);
      const matchesCategory = selectedCategory === "All" || eventName === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [events, search, selectedCategory]);

  const hasFilters = search || selectedCategory !== "All";

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction === "left" ? -340 : 340, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Featured Events Carousel ── */}
      {featuredEvents.length > 0 && (
        <section className="max-w-7xl mx-auto pt-8 pb-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Events</h2>
            <Link href="/events" className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1">
              View All <span className="text-lg leading-none">&rsaquo;</span>
            </Link>
          </div>
          <div className="relative group">
            <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition opacity-0 group-hover:opacity-100" aria-label="Scroll left">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>              <div ref={scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {featuredEvents.map((event) => {
                const badge = getCategoryBadge(event.categorySlug || "");
                return (
                  <div key={event.id} className="min-w-[280px] sm:min-w-[300px] max-w-[300px] border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white shrink-0 snap-start">
                    <div className="relative">
                      <img src={event.imageUrl || "/placeholder-event.jpg"} alt={event.title} className="w-full h-44 object-cover" />
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition" aria-label="Save event">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      </button>
                      <span className={`absolute bottom-3 left-3 text-xs font-semibold text-white px-3 py-1 rounded-full ${badge.color}`}>{badge.name}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {event.city || event.venue}
                        </span>
                      </div>
                      <Link href={`/events/${event.documentId}`} className="block w-full text-center py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">View Details</Link>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition opacity-0 group-hover:opacity-100" aria-label="Scroll right">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </section>
      )}

      {featuredEvents.length === 0 && events.length === 0 && (
        <section className="max-w-7xl mx-auto pt-8 pb-6 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Events</h2>
          <p className="text-gray-500">No events available. Make sure the backend is running.</p>
        </section>
      )}

      {/* ── Search Bar ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-3 max-w-3xl">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by title, organizer, venue, or city"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </button>
        </div>

        {/* ── Filter Row ── */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mt-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === "All" ? "Category" : cat}</option>
            ))}
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Event Mode</option>
            <option>In-Person</option>
            <option>Online</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {hasFilters && (
            <button
              onClick={() => { setSearch(""); setSelectedCategory("All"); }}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>

        {/* ── List / Map Toggle ── */}
        <div className="flex items-center gap-1 mt-6 border border-gray-200 rounded-lg p-1 w-full sm:w-fit">
          <button
            onClick={() => setViewMode("list")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            List View
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "map" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Map View
          </button>
        </div>

        {/* ── Event List ── */}
        <div className="mt-6">
          {!loading && filteredEvents.length > 0 && (
            <div className="space-y-4">
              {filteredEvents.map((event) => {
                const badge = getCategoryBadge(event.categorySlug || "");
                return (
                  <div key={event.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white">
                    {/* Thumbnail */}
                    <img src={event.imageUrl || "/placeholder-event.jpg"} alt={event.title} className="w-full sm:w-40 h-48 sm:h-28 object-cover rounded-lg shrink-0" />
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{event.title}</h3>
                        <button className="shrink-0 mt-0.5" aria-label="Save event">
                          <svg className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                        <span className={`text-xs font-medium text-white px-2 py-0.5 rounded-full ${badge.color}`}>{badge.name}</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {event.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="truncate">{event.venue}{event.city ? `, ${event.city}` : ""}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        In-Person
                      </div>
                    </div>
                    {/* View Details */}
                    <div className="flex items-center sm:items-end shrink-0">
                      <Link href={`/events/${event.documentId}`} className="w-full sm:w-auto px-5 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap text-center">
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
              <p className="text-gray-500">{hasFilters ? "Try adjusting your search or filters" : "Make sure the backend is running."}</p>
              {hasFilters && (
                <button onClick={() => { setSearch(""); setSelectedCategory("All"); }} className="mt-3 text-sm text-blue-600 hover:underline font-medium">Clear Filters</button>
              )}
            </div>
          )}

          {/* Map placeholder */}
          {viewMode === "map" && (
            <div className="mt-4 border border-gray-200 rounded-xl h-96 bg-gray-100 flex items-center justify-center text-gray-400">
              <p>Map view — coming in final deliverable</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
