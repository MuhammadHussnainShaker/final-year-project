"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { strapiGet } from "@/lib/strapi";
import type { StrapiCategory, StrapiEvent, StrapiResponse } from "@/types";

const categoryColors: Record<string, string> = {
  Music: "bg-rose-50 border-rose-200 hover:bg-rose-100",
  Sports: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
  Technology: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  "Art & Culture": "bg-amber-50 border-amber-200 hover:bg-amber-100",
  "Food & Drink": "bg-orange-50 border-orange-200 hover:bg-orange-100",
  Community: "bg-teal-50 border-teal-200 hover:bg-teal-100",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<StrapiCategory[]>([]);
  const [events, setEvents] = useState<StrapiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, evtRes] = await Promise.all([
          strapiGet<StrapiResponse<StrapiCategory>>("/categories"),
          strapiGet<StrapiResponse<StrapiEvent>>("/events?populate=*"),
        ]);
        setCategories(catRes.data);
        setEvents(evtRes.data);
      } catch {
        // Backend not running
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const nameToSlug: Record<string, string> = { Music: "music", Sports: "sports", Technology: "technology", "Art & Culture": "art-culture", "Food & Drink": "food-drink", Community: "community" };

  function getEventCount(categoryName: string): number {
    const slug = nameToSlug[categoryName] || '';
    return events.filter((e) => e.category?.name === categoryName || e.categorySlug === slug).length;
  }

  return (
    <div className="min-h-[80vh] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-500">
            Browse events by category
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border rounded-xl p-8 bg-white animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded mb-4" />
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Category Grid */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const count = getEventCount(cat.name);
              return (
                <Link
                  key={cat.id}
                  href={`/events?category=${encodeURIComponent(cat.name)}`}
                  className={`block border rounded-xl p-8 transition-colors ${
                    categoryColors[cat.name] || "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-4xl mb-4 block">{cat.icon || "📌"}</span>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{cat.name}</h2>
                  <p className="text-sm text-gray-500 mb-3">
                    {count} event{count !== 1 ? "s" : ""}
                  </p>
                  {cat.description && (
                    <p className="text-sm text-gray-600 mb-4">{cat.description}</p>
                  )}
                  <span className="text-sm text-blue-600 hover:underline font-medium">
                    Browse Events →
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No categories found</h3>
            <p className="text-gray-500">Make sure the backend is running and categories are seeded.</p>
          </div>
        )}
      </div>
    </div>
  );
}
