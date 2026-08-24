"use client";

import Link from "next/link";
import type { StrapiEvent } from "@/types";

const categoryColors: Record<string, string> = {
  Music: "bg-rose-100 text-rose-700",
  Sports: "bg-emerald-100 text-emerald-700",
  Technology: "bg-blue-100 text-blue-700",
  "Art & Culture": "bg-amber-100 text-amber-700",
  "Food & Drink": "bg-orange-100 text-orange-700",
  Community: "bg-teal-100 text-teal-700",
};

function getCategoryColor(name: string): string {
  return categoryColors[name] || "bg-gray-100 text-gray-700";
}

export default function EventCard({ event }: { event: StrapiEvent }) {
  const categoryName = event.category?.name || "Uncategorized";

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="relative">
        <img
          src={event.imageUrl || "/placeholder-event.jpg"}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <span
          className={`absolute top-3 left-3 text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(categoryName)}`}
        >
          {categoryName}
        </span>
        {event.isFeatured && (
          <span className="absolute top-3 right-3 text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
            Featured
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{event.title}</h3>
        <p className="text-sm text-gray-500 mb-1">
          {event.date} · {event.time}
        </p>
        {(event.venue || event.city) && (
          <p className="text-sm text-gray-500 mb-2">
            📍 {event.venue}
            {event.city ? `, ${event.city}` : ""}
          </p>
        )}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {event.shortDescription}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-green-600">
            {event.ticketPrice || "Free"}
          </span>
          <Link
            href={`/events/${event.documentId}`}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
