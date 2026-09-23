export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface MovieItem {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  bannerUrl?: string | null;
  trailerUrl?: string | null;
  genre: string;
  language: string;
  durationMin: number;
  releaseDate: string | Date;
  rating: number;
  isActive: boolean;
}

export interface TheatreItem {
  id: string;
  name: string;
  city: string;
  address: string;
  screens?: ScreenItem[];
}

export interface ScreenItem {
  id: string;
  name: string;
  theatreId: string;
  theatre?: TheatreItem;
  screenType: string;
  totalRows: number;
  seatsPerRow: number;
}

export interface ShowItem {
  id: string;
  movieId: string;
  movie?: MovieItem;
  screenId: string;
  screen?: ScreenItem;
  startTime: string | Date;
  priceSilver: number;
  priceGold: number;
  priceVip: number;
  bookings?: BookingItem[];
}

export interface BookingItem {
  id: string;
  bookingNumber: string;
  userId: string;
  user?: { name: string; email: string };
  showId: string;
  show?: ShowItem;
  seats: string[]; // parsed array e.g. ["A1", "A2"]
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string | Date;
}
