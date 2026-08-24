export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface Event {
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
  publishedAt: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}
