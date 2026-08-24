'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Mail,
  ExternalLink,
  Star,
} from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  icon: string;
}

interface Event {
  id: number;
  documentId: string;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  address: string;
  imageUrl: string;
  ticketPrice: string;
  organizerContact: string;
  isFeatured: boolean;
  category?: Category;
}

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
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(
          `${STRAPI_URL}/api/events/${id}?populate=category`
        );
        if (!res.ok) {
          setError('Event not found');
          return;
        }
        const data = await res.json();
        setEvent(data.data);
      } catch {
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-64 bg-gray-200 rounded-xl" />
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {error || 'Event not found'}
        </h2>
        <p className="text-gray-500 mb-6">
          The event you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/events"
          className={buttonVariants({ className: 'bg-indigo-600 hover:bg-indigo-700' })}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Browse Events
        </Link>
      </div>
    );
  }

  const mapsUrl = event.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">
          Home
        </Link>
        <span>/</span>
        <Link href="/events" className="hover:text-indigo-600">
          Events
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{event.title}</span>
      </nav>

      {/* Hero Image */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-64 sm:h-80 lg:h-96 object-cover"
        />
        {event.category && (
          <Badge
            className={`absolute top-4 left-4 ${categoryColors[event.category.slug] || 'bg-gray-100 text-gray-700'} border-0 text-sm`}
          >
            {event.category.icon} {event.category.name}
          </Badge>
        )}
        {event.isFeatured && (
          <Badge className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 border-0 text-sm">
            <Star className="h-3.5 w-3.5 mr-1 fill-current" />
            Featured
          </Badge>
        )}
      </div>

      {/* Event Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{event.title}</h1>

          <div className="flex flex-wrap gap-2">
            {event.category && (
              <Badge
                className={`${categoryColors[event.category.slug] || 'bg-gray-100 text-gray-700'} border-0`}
              >
                {event.category.icon} {event.category.name}
              </Badge>
            )}
            {event.ticketPrice && (
              <Badge variant="outline" className="text-indigo-600">
                <Ticket className="h-3 w-3 mr-1" />
                {event.ticketPrice}
              </Badge>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Event</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </div>

          <Separator />

          {/* Location */}
          {event.venue && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Location</h2>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{event.venue}</p>
                  {event.address && (
                    <p className="text-sm text-gray-500 mt-1">{event.address}</p>
                  )}
                  {event.city && (
                    <p className="text-sm text-gray-500">{event.city}</p>
                  )}
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mt-2"
                    >
                      Get Directions
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Event Details</h3>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{formatDate(event.date)}</p>
                  <p className="text-sm text-gray-500">Date</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.time}</p>
                  <p className="text-sm text-gray-500">Time</p>
                </div>
              </div>

              {event.ticketPrice && (
                <div className="flex items-center gap-3">
                  <Ticket className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.ticketPrice}</p>
                    <p className="text-sm text-gray-500">Ticket Price</p>
                  </div>
                </div>
              )}

              {event.organizerContact && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Organizer</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${event.organizerContact}`}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        {event.organizerContact}
                      </a>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Link
            href="/login"
            className={buttonVariants({
              className: 'w-full bg-indigo-600 hover:bg-indigo-700',
            })}
          >
            RSVP for This Event
          </Link>
        </div>
      </div>

      {/* Back Link */}
      <div className="mt-12 pt-8 border-t">
        <Link
          href="/events"
          className={buttonVariants({ variant: 'ghost' })}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>
      </div>
    </div>
  );
}
