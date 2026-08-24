export interface StrapiEvent {
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
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  category?: StrapiCategory;
}

export interface StrapiCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
