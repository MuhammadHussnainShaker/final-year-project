'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  eventCount?: number;
}

const categoryColors = [
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-green-600',
  'from-blue-500 to-indigo-600',
  'from-amber-500 to-orange-600',
  'from-orange-500 to-red-500',
  'from-teal-500 to-cyan-600',
];

const fallbackCategories: Category[] = [
  { id: 1, documentId: '1', name: 'Music', slug: 'music', icon: '🎵', description: 'Live performances, concerts, and music festivals' },
  { id: 2, documentId: '2', name: 'Sports', slug: 'sports', icon: '⚽', description: 'Sports events, tournaments, and fitness activities' },
  { id: 3, documentId: '3', name: 'Technology', slug: 'technology', icon: '💻', description: 'Tech meetups, workshops, and hackathons' },
  { id: 4, documentId: '4', name: 'Art & Culture', slug: 'art-culture', icon: '🎨', description: 'Art exhibitions, cultural festivals, and creative events' },
  { id: 5, documentId: '5', name: 'Food & Drink', slug: 'food-drink', icon: '🍕', description: 'Food festivals, cooking classes, and culinary experiences' },
  { id: 6, documentId: '6', name: 'Community', slug: 'community', icon: '🤝', description: 'Community service, volunteering, and social gatherings' },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const [catsRes, eventsRes] = await Promise.all([
          fetch(`${STRAPI_URL}/api/categories?sort=name:asc`),
          fetch(`${STRAPI_URL}/api/events?populate=category&pagination[pageSize]=100&filters[status]=published`),
        ]);

        let cats: Category[] = fallbackCategories;
        if (catsRes.ok) {
          const catsData = await catsRes.json();
          if (catsData.data?.length > 0) {
            cats = catsData.data;
          }
        }

        let events: any[] = [];
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          events = eventsData.data || [];
        }

        // Count events per category
        const catCounts: Record<string, number> = {};
        events.forEach((evt: any) => {
          if (evt.category?.slug) {
            catCounts[evt.category.slug] = (catCounts[evt.category.slug] || 0) + 1;
          }
        });

        setCategories(
          cats.map((c) => ({
            ...c,
            eventCount: catCounts[c.slug] || 0,
          }))
        );
      } catch {
        setCategories(fallbackCategories.map((c) => ({ ...c, eventCount: 0 })));
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Event Categories</h1>
        <p className="mt-1 text-gray-500">
          Browse events by category to find what interests you
        </p>
      </div>

      {/* Category Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl bg-gray-100 animate-pulse h-48" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <Link key={cat.documentId} href={`/events?category=${cat.slug}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                <div
                  className={`h-32 bg-gradient-to-br ${categoryColors[i % categoryColors.length]} flex items-center justify-center`}
                >
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </span>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{cat.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant="secondary">
                      {cat.eventCount || 0} event{(cat.eventCount || 0) !== 1 ? 's' : ''}
                    </Badge>
                    <span className="text-sm text-indigo-600 font-medium flex items-center gap-1 group-hover:underline">
                      Browse <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
