'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, Star, Calendar, MapPin } from 'lucide-react';

interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

interface Event {
  id: number;
  documentId: string;
  title: string;
  shortDescription: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  imageUrl: string;
  ticketPrice: string;
  isFeatured: boolean;
  category?: Category;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const categoryColors: Record<string, string> = {
  music: 'bg-rose-100 text-rose-700',
  sports: 'bg-emerald-100 text-emerald-700',
  technology: 'bg-blue-100 text-blue-700',
  'art-culture': 'bg-amber-100 text-amber-700',
  'food-drink': 'bg-orange-100 text-orange-700',
  community: 'bg-teal-100 text-teal-700',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function EventsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Fetch data from Strapi
  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, catsRes] = await Promise.all([
          fetch(`${STRAPI_URL}/api/events?populate=category&sort=date:asc&pagination[pageSize]=100&filters[status]=published`),
          fetch(`${STRAPI_URL}/api/categories?sort=name:asc`),
        ]);

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(eventsData.data || []);
        }

        if (catsRes.ok) {
          const catsData = await catsRes.json();
          setCategories(catsData.data || []);
        }
      } catch {
        // Strapi may not be running
        setEvents([]);
        setCategories([
          { id: 1, documentId: '1', name: 'Music', slug: 'music', icon: '🎵', description: '' },
          { id: 2, documentId: '2', name: 'Sports', slug: 'sports', icon: '⚽', description: '' },
          { id: 3, documentId: '3', name: 'Technology', slug: 'technology', icon: '💻', description: '' },
          { id: 4, documentId: '4', name: 'Art & Culture', slug: 'art-culture', icon: '🎨', description: '' },
          { id: 5, documentId: '5', name: 'Food & Drink', slug: 'food-drink', icon: '🍕', description: '' },
          { id: 6, documentId: '6', name: 'Community', slug: 'community', icon: '🤝', description: '' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Client-side filtering
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory = !selectedCategory || event.category?.slug === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.shortDescription?.toLowerCase().includes(query) ||
        event.venue?.toLowerCase().includes(query) ||
        event.city?.toLowerCase().includes(query) ||
        event.category?.name?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  const activeFilters = selectedCategory || searchQuery;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Events</h1>
        <p className="mt-1 text-gray-500">
          Discover upcoming events in your area
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search events, venues, cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              !selectedCategory
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.documentId}
              onClick={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Active Filters */}
        {activeFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Filters:</span>
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                <button onClick={() => setSelectedCategory('')} className="ml-1 hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                &quot;{searchQuery}&quot;
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
              }}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-500">
        {loading ? 'Loading...' : `${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''} found`}
      </div>

      {/* Event Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl bg-gray-100 animate-pulse h-80" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500 mb-4">
            {activeFilters
              ? 'Try adjusting your search or filter criteria.'
              : 'No events are available yet. Start the Strapi backend to see events.'}
          </p>
          {activeFilters && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Link key={event.documentId} href={`/events/${event.documentId}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {event.category && (
                    <Badge
                      className={`absolute top-3 left-3 ${categoryColors[event.category.slug] || 'bg-gray-100 text-gray-700'} border-0`}
                    >
                      {event.category.icon} {event.category.name}
                    </Badge>
                  )}
                  {event.isFeatured && (
                    <Badge className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 border-0">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{event.shortDescription}</p>
                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                      {formatDate(event.date)}
                    </span>
                    {event.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                        {event.city}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-indigo-600">
                      {event.ticketPrice || 'Free'}
                    </span>
                    <span className="text-sm text-indigo-600 font-medium group-hover:underline">
                      View Details →
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
