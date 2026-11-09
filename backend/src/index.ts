import type { Core } from '@strapi/strapi';

const categories = [
  { name: 'Music', slug: 'music', icon: '🎵', description: 'Live performances, concerts, and music festivals' },
  { name: 'Sports', slug: 'sports', icon: '⚽', description: 'Sports events, tournaments, and fitness activities' },
  { name: 'Technology', slug: 'technology', icon: '💻', description: 'Tech meetups, workshops, and hackathons' },
  { name: 'Art & Culture', slug: 'art-culture', icon: '🎨', description: 'Art exhibitions, cultural festivals, and creative events' },
  { name: 'Food & Drink', slug: 'food-drink', icon: '🍕', description: 'Food festivals, cooking classes, and culinary experiences' },
  { name: 'Community', slug: 'community', icon: '🤝', description: 'Community service, volunteering, and social gatherings' },
];

const events = [
  {
    title: 'Summer Music Festival 2026',
    description: 'Join us for an unforgettable weekend of live music featuring local and international artists. Three stages, food trucks, and amazing vibes await you at this annual celebration of music and culture.',
    shortDescription: 'A weekend of live music with local and international artists across three stages.',
    date: '2026-09-15',
    time: '2:00 PM - 11:00 PM',
    venue: 'Bagh-e-Jinnah',
    city: 'Lahore',
    address: 'Bagh-e-Jinnah, Shahrah-e-Quaid-e-Azam, Lahore',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
    ticketPrice: 'PKR 2,500',
    organizerContact: 'events@lahoremusicfest.pk',
    isFeatured: false,
    categorySlug: 'music',
  },
  {
    title: 'React & Next.js Workshop',
    description: 'A hands-on workshop covering React 19, Next.js 16, and modern web development patterns. Perfect for beginners and intermediate developers looking to level up their skills.',
    shortDescription: 'Hands-on workshop covering React 19 and Next.js 16 for all skill levels.',
    date: '2026-09-05',
    time: '10:00 AM - 4:00 PM',
    venue: 'nHub Islamabad',
    city: 'Islamabad',
    address: 'nHub, F-7 Markaz, Islamabad',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    ticketPrice: 'Free',
    organizerContact: 'workshops@nhub.io',
    isFeatured: true,
    categorySlug: 'technology',
  },
  {
    title: 'Karachi Street Food Festival',
    description: 'Explore the diverse flavors of Karachi at this annual street food festival. From bun kabab to seafood, experience the best of Pakistani street food culture.',
    shortDescription: 'Annual street food festival celebrating the diverse flavors of Karachi.',
    date: '2026-09-20',
    time: '12:00 PM - 10:00 PM',
    venue: 'Sea View Beach',
    city: 'Karachi',
    address: 'Sea View Beach, Clifton, Karachi',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    ticketPrice: 'PKR 500',
    organizerContact: 'info@karachifoodfest.pk',
    isFeatured: true,
    categorySlug: 'food-drink',
  },
  {
    title: 'Community Clean-Up Drive',
    description: 'Join your neighbors in a community clean-up initiative. Help make our city cleaner and greener. All supplies will be provided. Refreshments included.',
    shortDescription: 'Community initiative to clean and green our neighborhoods. All supplies provided.',
    date: '2026-08-30',
    time: '7:00 AM - 12:00 PM',
    venue: 'Model Town Park',
    city: 'Lahore',
    address: 'Model Town Park, Model Town, Lahore',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
    ticketPrice: 'Free',
    organizerContact: 'volunteer@cleanlahore.org',
    isFeatured: false,
    categorySlug: 'community',
  },
  {
    title: 'ISB Football League Kickoff',
    description: 'The Islamabad Football League season kicks off with an exciting opening match. Watch local teams compete in this amateur league. Free entry for all.',
    shortDescription: 'Islamabad Football League season opener with local team competition.',
    date: '2026-09-10',
    time: '4:00 PM - 7:00 PM',
    venue: 'Jinnah Sports Complex',
    city: 'Islamabad',
    address: 'Jinnah Sports Complex, G-9, Islamabad',
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80',
    ticketPrice: 'Free',
    organizerContact: 'league@isbfootball.pk',
    isFeatured: false,
    categorySlug: 'sports',
  },
  {
    title: 'AI & Machine Learning Conference',
    description: "Pakistan's premier AI conference bringing together researchers, engineers, and industry leaders. Talks on LLMs, computer vision, NLP, and responsible AI development.",
    shortDescription: "Pakistan's premier AI conference with talks on LLMs, CV, and NLP.",
    date: '2026-10-15',
    time: '9:00 AM - 6:00 PM',
    venue: 'NUST Convention Centre',
    city: 'Islamabad',
    address: 'NUST, H-12, Islamabad',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    ticketPrice: 'PKR 5,000',
    organizerContact: 'register@pakaiconf.pk',
    isFeatured: false,
    categorySlug: 'technology',
  },
  {
    title: 'Sufi Music Night',
    description: 'An enchanting evening of Sufi music featuring traditional Qawwali performances and contemporary Sufi fusion. Experience the spiritual beauty of Sufi music under the stars.',
    shortDescription: 'Enchanting evening of Qawwali and Sufi fusion performances under the stars.',
    date: '2026-09-25',
    time: '7:00 PM - 11:00 PM',
    venue: 'Shalimar Gardens',
    city: 'Lahore',
    address: 'Shalimar Gardens, Grand Trunk Road, Lahore',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    ticketPrice: 'PKR 1,500',
    organizerContact: 'info@sufinights.pk',
    isFeatured: false,
    categorySlug: 'music',
  },
  {
    title: 'Quran Tilawat Competition',
    description: 'A city-wide Quran recitation competition for children and adults. Categories include Tajweed, Hifz, and Naat. Judges include renowned Qaris from across Pakistan. Prizes for top performers.',
    shortDescription: 'Quran recitation competition with Tajweed, Hifz, and Naat categories.',
    date: '2026-08-29',
    time: '4:00 PM - 8:00 PM',
    venue: 'Faisal Mosque Auditorium',
    city: 'Islamabad',
    address: 'Faisal Mosque, Shah Faisal Marg, Islamabad',
    imageUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ticketPrice: 'Free',
    organizerContact: 'events@quransociety.pk',
    isFeatured: true,
    categorySlug: 'community',
  },
  {
    title: 'Biryani Cooking Masterclass',
    description: 'Learn to cook the perfect Hyderabadi biryani from a professional chef. Includes all ingredients, recipe booklet, and a full biryani meal to take home.',
    shortDescription: 'Professional chef-led biryani cooking class with all ingredients included.',
    date: '2026-09-08',
    time: '2:00 PM - 5:00 PM',
    venue: 'The Cooking Studio',
    city: 'Karachi',
    address: 'The Cooking Studio, Bukhari Commercial, Phase 6, DHA, Karachi',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
    ticketPrice: 'PKR 3,500',
    organizerContact: 'classes@cookingstudio.pk',
    isFeatured: false,
    categorySlug: 'food-drink',
  },
  {
    title: 'Seerat-un-Nabi Conference',
    description: 'Annual conference on the life and teachings of Prophet Muhammad (PBUH). Features talks by renowned scholars, Naat recitations, and a special exhibition on Islamic history. Open to all.',
    shortDescription: 'Annual Seerat conference with scholarly talks, Naat, and Islamic exhibition.',
    date: '2026-09-18',
    time: '10:00 AM - 2:00 PM',
    venue: 'Badshahi Mosque',
    city: 'Lahore',
    address: 'Badshahi Mosque, Fort Road, Lahore',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=80',
    ticketPrice: 'Free',
    organizerContact: 'events@seeratconf.pk',
    isFeatured: true,
    categorySlug: 'community',
  },
  {
    title: 'Charity Cricket Match',
    description: "Watch local celebrities and cricketers compete in a charity cricket match. All proceeds go to education for underprivileged children. Fun activities for families.",
    shortDescription: "Charity cricket match with celebrities. Proceeds support children's education.",
    date: '2026-10-05',
    time: '3:00 PM - 8:00 PM',
    venue: 'Pindi Cricket Stadium',
    city: 'Rawalpindi',
    address: 'Pindi Cricket Stadium, Stadium Road, Rawalpindi',
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    ticketPrice: 'PKR 500',
    organizerContact: 'charity@cricketforchange.pk',
    isFeatured: false,
    categorySlug: 'sports',
  },
  {
    title: 'Photography Walk: Old Lahore',
    description: 'Explore the photogenic streets of Old Lahore with a professional photographer guide. Learn street photography techniques while capturing the beauty of Mughal architecture.',
    shortDescription: 'Guided photography walk through Old Lahore with a professional photographer.',
    date: '2026-09-12',
    time: '8:00 AM - 12:00 PM',
    venue: 'Walled City of Lahore',
    city: 'Lahore',
    address: 'Walled City of Lahore, Delhi Gate, Lahore',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    ticketPrice: 'PKR 800',
    organizerContact: 'walks@lahorephotography.pk',
    isFeatured: false,
    categorySlug: 'art-culture',
  },
  {
    title: 'Blood Donation Camp',
    description: 'Donate blood and save lives. Organized in collaboration with Red Crescent Society. Medical staff on-site. All donors receive a certificate and refreshments.',
    shortDescription: 'Blood donation camp with Red Crescent. Certificates and refreshments for donors.',
    date: '2026-09-22',
    time: '9:00 AM - 5:00 PM',
    venue: 'Aga Khan University Hospital',
    city: 'Karachi',
    address: 'Aga Khan University Hospital, Stadium Road, Karachi',
    imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&q=80',
    ticketPrice: 'Free',
    organizerContact: 'blood@redcrescent.pk',
    isFeatured: false,
    categorySlug: 'community',
  },
  {
    title: 'Islamic Calligraphy Exhibition',
    description: 'A beautiful exhibition of Islamic calligraphy art featuring works by master calligraphers from Pakistan and abroad. Live demonstrations of Thuluth, Nasta \'liq, and Kufic scripts. Works available for purchase.',
    shortDescription: 'Islamic calligraphy exhibition with live script demonstrations by master artists.',
    date: '2026-10-10',
    time: '11:00 AM - 7:00 PM',
    venue: 'Shakir Ali Museum',
    city: 'Lahore',
    address: 'Shakir Ali Museum, Model Town, Lahore',
    imageUrl: 'https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=800&q=80',
    ticketPrice: 'PKR 500',
    organizerContact: 'art@islamicartexhibition.pk',
    isFeatured: false,
    categorySlug: 'art-culture',
  },
];

export default {
  // Runs before Strapi initializes; use this hook to register custom extensions or configuration.
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // ─── 1. Public Role Permissions ───
    // Always ensure API read permissions exist for the public role.
    // Use the users-permissions service for reliability.
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (publicRole) {
      const apiActions = [
        'api::event.event.find',
        'api::event.event.findOne',
        'api::category.category.find',
        'api::category.category.findOne',
      ];

      for (const action of apiActions) {
        const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
          where: { action, role: publicRole.id },
        });

        if (!existing) {
          await strapi.db.query('plugin::users-permissions.permission').create({
            data: { action, role: publicRole.id },
          });
          strapi.log.info(`Created permission: ${action}`);
        }
      }
      strapi.log.info('Public role permissions verified.');
    }

    // ─── 2. Seed Data ───
    const existingCategories = await strapi.documents('api::category.category').findMany({});
    if (existingCategories.length > 0) {
      strapi.log.info('Seed data already exists. Skipping seed.');
      return;
    }

    strapi.log.info('Seeding database with categories and events...');

    // Create categories
    const categoryMap: Record<string, string> = {};
    for (const cat of categories) {
      const entry = await strapi.documents('api::category.category').create({
        data: {
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          description: cat.description,
        },
      });
      categoryMap[cat.slug] = entry.documentId;
      strapi.log.info(`Created category: ${cat.name}`);
    }

    // Create events with category relation
    for (const evt of events) {
      const entry = await strapi.documents('api::event.event').create({
        data: {
          title: evt.title,
          description: evt.description,
          shortDescription: evt.shortDescription,
          date: evt.date,
          time: evt.time,
          venue: evt.venue,
          city: evt.city,
          address: evt.address,
          imageUrl: evt.imageUrl,
          ticketPrice: evt.ticketPrice,
          organizerContact: evt.organizerContact,
          isFeatured: evt.isFeatured,
          categorySlug: evt.categorySlug,
          category: categoryMap[evt.categorySlug],
        },
      });
      strapi.log.info(`Created event: ${evt.title} -> ${evt.categorySlug}`);
    }

    strapi.log.info('Seed completed: 6 categories and 15 events created.');
  },
};
