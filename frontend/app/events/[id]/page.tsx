"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { strapiGet } from "@/lib/strapi";
import type { StrapiEvent, StrapiResponse } from "@/types";

const categoryColors: Record<string, string> = {
  Music: "bg-rose-100 text-rose-700",
  Sports: "bg-emerald-100 text-emerald-700",
  Technology: "bg-blue-100 text-blue-700",
  "Art & Culture": "bg-amber-100 text-amber-700",
  "Food & Drink": "bg-orange-100 text-orange-700",
  Community: "bg-teal-100 text-teal-700",
};

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<StrapiEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await strapiGet<StrapiResponse<StrapiEvent>>(
          `/events?filters[documentId][$eq]=${id}&populate=*`
        );
        setEvent(res.data[0] || null);
      } catch {
        // Not found or backend error
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-64 bg-gray-200 rounded" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-gray-500 mb-4">This event doesn&apos;t exist or has been removed.</p>
          <Link href="/events" className="text-blue-600 hover:underline">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const slugToName: Record<string, string> = { music: "Music", sports: "Sports", technology: "Technology", "art-culture": "Art & Culture", "food-drink": "Food & Drink", community: "Community" };
  const categoryName = event.category?.name || slugToName[event.categorySlug || ""] || "Uncategorized";
  const mapsUrl = event.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`
    : null;

  return (
    <div className="min-h-[80vh] bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/events" className="hover:text-blue-600">Events</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{event.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Image */}
        <div className="rounded-xl overflow-hidden mb-8">
          <img
            src={event.imageUrl || "/placeholder-event.jpg"}
            alt={event.title}
            className="w-full h-64 sm:h-80 object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category + Date */}
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  categoryColors[categoryName] || "bg-gray-100 text-gray-700"
                }`}
              >
                {categoryName}
              </span>
              {event.isFeatured && (
                <span className="text-xs font-medium bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full">
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>

            {/* Date & Time */}
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{event.date} · {event.time}</span>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-2">About this event</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Venue / Directions */}
            {(event.venue || event.address) && (
              <div className="bg-white rounded-lg border p-4">
                <h2 className="text-lg font-semibold mb-2">📍 Venue</h2>
                {event.venue && <p className="text-gray-700 font-medium">{event.venue}</p>}
                {event.address && <p className="text-gray-500 text-sm">{event.address}</p>}
                {event.city && <p className="text-gray-500 text-sm">{event.city}</p>}
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm text-blue-600 hover:underline font-medium"
                  >
                    Get Directions →
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Ticket Info */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Ticket Information</h3>
              <p className="text-2xl font-bold text-green-600">
                {event.ticketPrice || "Free"}
              </p>
            </div>

            {/* Organizer */}
            {event.organizerContact && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold mb-2">Organizer</h3>
                <p className="text-gray-600 text-sm">{event.organizerContact}</p>
              </div>
            )}

            {/* Back Link */}
            <Link
              href="/events"
              className="block text-center text-sm text-blue-600 hover:underline font-medium py-2"
            >
              ← Back to all events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
