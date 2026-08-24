"use client";

import { useState, useEffect, useMemo } from "react";
import { strapiGet } from "@/lib/strapi";
import type { StrapiEvent, StrapiResponse } from "@/types";
import EventCard from "@/components/events/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories = [
  "All",
  "Music",
  "Sports",
  "Technology",
  "Art & Culture",
  "Food & Drink",
  "Community",
];

export default function EventsPage() {
  const [events, setEvents] = useState<StrapiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await strapiGet<StrapiResponse<StrapiEvent>>(
          "/events?populate=*&sort=date:asc"
        );
        setEvents(res.data);
      } catch {
        // Backend not running — show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        !search ||
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.venue?.toLowerCase().includes(search.toLowerCase()) ||
        event.city?.toLowerCase().includes(search.toLowerCase()) ||
        event.description?.toLowerCase().includes(search.toLowerCase());

      const slugToName: Record<string, string> = { music: "Music", sports: "Sports", technology: "Technology", "art-culture": "Art & Culture", "food-drink": "Food & Drink", community: "Community" };
      const eventName = event.category?.name || slugToName[event.categorySlug || ""] || "";
      const matchesCategory =
        selectedCategory === "All" ||
        eventName === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [events, search, selectedCategory]);

  const hasFilters = search || selectedCategory !== "All";

  return (
    <div className="min-h-[80vh] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Events</h1>
          <p className="text-gray-500">
            Discover workshops, concerts, meetups, and more
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search + Filters */}
        <div className="mb-6 space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-4">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden bg-white animate-pulse">
                <div className="w-full h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Event grid */}
        {!loading && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <svg
              className="mx-auto w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No events found
            </h3>
            <p className="text-gray-500 mb-4">
              {hasFilters
                ? "Try adjusting your search or filters"
                : "No events are available yet. Make sure the backend is running."}
            </p>
            {hasFilters && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
