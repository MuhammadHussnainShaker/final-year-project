import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Search, Star } from 'lucide-react';
import { getFeaturedEvents, getCategories } from '@/lib/strapi';
import type { Event, Category } from '@/types';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const categoryColors: Record<string, string> = {
  music: 'bg-rose-100 text-rose-700',
  sports: 'bg-emerald-100 text-emerald-700',
  technology: 'bg-blue-100 text-blue-700',
  'art-culture': 'bg-amber-100 text-amber-700',
  'food-drink': 'bg-orange-100 text-orange-700',
  community: 'bg-teal-100 text-teal-700',
};

async function FeaturedEvents() {
  let events: Event[] = [];
  try {
    const res = await getFeaturedEvents();
    events = res.data || [];
  } catch {
    // Strapi may not be running
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No featured events available yet. Start the Strapi backend to see events.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.slice(0, 6).map((event) => (
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
                  <span className="text-indigo-600">📅</span>
                  {formatDate(event.date)}
                </span>
                {event.city && (
                  <span className="flex items-center gap-1">
                    <span className="text-indigo-600">📍</span>
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
  );
}

async function CategoryGrid() {
  let categories: Category[] = [];
  try {
    const res = await getCategories();
    categories = res.data || [];
  } catch {
    categories = [
      { id: 1, documentId: '1', name: 'Music', slug: 'music', icon: '🎵', description: '' },
      { id: 2, documentId: '2', name: 'Sports', slug: 'sports', icon: '⚽', description: '' },
      { id: 3, documentId: '3', name: 'Technology', slug: 'technology', icon: '💻', description: '' },
      { id: 4, documentId: '4', name: 'Art & Culture', slug: 'art-culture', icon: '🎨', description: '' },
      { id: 5, documentId: '5', name: 'Food & Drink', slug: 'food-drink', icon: '🍕', description: '' },
      { id: 6, documentId: '6', name: 'Community', slug: 'community', icon: '🤝', description: '' },
    ];
  }

  const colors = [
    'from-rose-500 to-pink-600',
    'from-emerald-500 to-green-600',
    'from-blue-500 to-indigo-600',
    'from-amber-500 to-orange-600',
    'from-orange-500 to-red-500',
    'from-teal-500 to-cyan-600',
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((cat, i) => (
        <Link key={cat.documentId} href={`/events?category=${cat.slug}`}>
          <div className="group relative overflow-hidden rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${colors[i % colors.length]} opacity-90 group-hover:opacity-100 transition-opacity`}
            />
            <div className="relative z-10">
              <span className="text-4xl mb-3 block">{cat.icon}</span>
              <h3 className="font-semibold text-white">{cat.name}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-white/10 text-white border-white/20 hover:bg-white/20">
              🎉 Discover what&apos;s happening near you
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Find Events,{' '}
              <span className="text-indigo-200">Connect</span> with Communities
            </h1>
            <p className="mt-6 text-lg text-indigo-100 max-w-2xl mx-auto leading-relaxed">
              From workshops and concerts to sports events and community drives — explore local
              events, RSVP, and never miss out on what matters to you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/events"
                className={buttonVariants({
                  size: 'lg',
                  className: 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg',
                })}
              >
                <Search className="h-4 w-4 mr-2" />
                Browse Events
              </Link>
              <Link
                href="/register"
                className={buttonVariants({
                  size: 'lg',
                  variant: 'outline',
                  className: 'border-white/30 text-white hover:bg-white/10',
                })}
              >
                Create Account
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Events</h2>
            <p className="mt-1 text-gray-500">Hand-picked events you don&apos;t want to miss</p>
          </div>
          <Link
            href="/events"
            className="hidden sm:flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View all events <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <FeaturedEvents />
      </section>

      {/* Categories */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Browse by Category</h2>
            <p className="mt-1 text-gray-500">Find events that match your interests</p>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-1 text-gray-500">Three simple steps to get started</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '🔍',
              title: 'Browse Events',
              description: 'Explore upcoming events by category, date, or location on our interactive platform.',
            },
            {
              icon: '🎟️',
              title: 'RSVP & Register',
              description: 'Save events you love and register with a single click. Never miss what matters to you.',
            },
            {
              icon: '🎉',
              title: 'Attend & Connect',
              description: 'Show up, have a great time, and connect with people who share your interests.',
            },
          ].map((step, i) => (
            <div key={i} className="text-center p-6">
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Discover Events?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
            Join our community and never miss out on exciting events near you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className={buttonVariants({
                size: 'lg',
                className: 'bg-white text-indigo-600 hover:bg-indigo-50',
              })}
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              href="/events"
              className={buttonVariants({
                size: 'lg',
                variant: 'outline',
                className: 'border-white/30 text-white hover:bg-white/10',
              })}
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
