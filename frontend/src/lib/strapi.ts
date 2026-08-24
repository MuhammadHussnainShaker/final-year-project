import type { Event, Category, StrapiResponse, StrapiSingleResponse } from '@/types';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${STRAPI_URL}/api${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error?.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Events
export async function getEvents(params?: {
  category?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<StrapiResponse<Event[]>> {
  const searchParams = new URLSearchParams();
  searchParams.set('populate', 'category');
  searchParams.set('sort', 'date:asc');

  if (params?.category) {
    searchParams.set('filters[category][slug][$eq]', params.category);
  }

  if (params?.search) {
    searchParams.set('filters[$or][0][title][$containsi]', params.search);
    searchParams.set('filters[$or][1][shortDescription][$containsi]', params.search);
    searchParams.set('filters[$or][2][venue][$containsi]', params.search);
    searchParams.set('filters[$or][3][city][$containsi]', params.search);
    searchParams.set('filters[$or][4][description][$containsi]', params.search);
  }

  if (params?.featured !== undefined) {
    searchParams.set('filters[isFeatured][$eq]', String(params.featured));
  }

  if (params?.page) {
    searchParams.set('pagination[page]', String(params.page));
  }

  if (params?.pageSize) {
    searchParams.set('pagination[pageSize]', String(params.pageSize));
  }

  return fetchAPI<StrapiResponse<Event[]>>(`/events?${searchParams.toString()}`);
}

export async function getEvent(documentId: string): Promise<StrapiSingleResponse<Event>> {
  const searchParams = new URLSearchParams();
  searchParams.set('populate', 'category');

  return fetchAPI<StrapiSingleResponse<Event>>(
    `/events/${documentId}?${searchParams.toString()}`
  );
}

export async function getFeaturedEvents(): Promise<StrapiResponse<Event[]>> {
  const searchParams = new URLSearchParams();
  searchParams.set('populate', 'category');
  searchParams.set('sort', 'date:asc');
  searchParams.set('filters[isFeatured][$eq]', 'true');
  searchParams.set('pagination[pageSize]', '6');

  return fetchAPI<StrapiResponse<Event[]>>(`/events?${searchParams.toString()}`);
}

// Categories
export async function getCategories(): Promise<StrapiResponse<Category[]>> {
  return fetchAPI<StrapiResponse<Category[]>>('/categories?sort=name:asc');
}

export async function getCategory(slug: string): Promise<StrapiResponse<Category[]>> {
  const searchParams = new URLSearchParams();
  searchParams.set('filters[slug][$eq]', slug);

  return fetchAPI<StrapiResponse<Category[]>>(`/categories?${searchParams.toString()}`);
}

// Auth
export async function strapiRegister(data: {
  username: string;
  email: string;
  password: string;
}): Promise<{ jwt: string; user: { id: number; username: string; email: string } }> {
  return fetchAPI('/auth/local/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function strapiLogin(data: {
  identifier: string;
  password: string;
}): Promise<{ jwt: string; user: { id: number; username: string; email: string } }> {
  return fetchAPI('/auth/local', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function strapiGetMe(token: string) {
  return fetch(`${STRAPI_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}
