import { strapiGet } from "@/lib/strapi";
import type { StrapiEvent, StrapiResponse } from "@/types";

export default async function Home() {
  let events: StrapiEvent[] = [];
  try {
    const res = await strapiGet<StrapiResponse<StrapiEvent>>("/events?populate=*&sort=date:asc");
    events = res.data;
  } catch {
    // Backend not running — show fallback
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">EventHub</h1>
          <p className="text-xl text-blue-100">Discover amazing events near you</p>
        </div>
      </section>

      {/* Events List */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-500">No events found. Make sure the backend is running.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {event.city}
                    </span>
                    {event.isFeatured && (
                      <span className="text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{event.date} · {event.time}</p>
                  <p className="text-sm text-gray-600 mb-3">{event.venue}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-600">{event.ticketPrice}</span>
                    <a
                      href={`/events/${event.documentId}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Details →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
