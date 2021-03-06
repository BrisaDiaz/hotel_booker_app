import { NextPage } from 'next';

export type Feature = {
  id: number;
  name: string;
  hotelsCount?: number;
};
export type Features = {
  __typename: string;
  accessible: boolean;
  freeCancellation: boolean;
  familyFriendly: boolean;
  petFriendly: boolean;
  smokerFriendly: boolean;
  ecoFriendly: boolean;
};
export type WithQuantityFeature = {
  id: number;
  type: string;
  quantity: number;
};
export interface Image {
  id: number;
  albumId: number;
  src: string;
}
export interface RoomModel {
  id: number;
  hotel: Hotel;
  hotelId: number;
  category: string;
  name: string;
  mts2: number;
  mainImage: string;
  lowestPrice: number;
  cancellationFee: number;
  taxesAndCharges: number;
  maximumGuests: number;
  maximumStay: number;
  minimumStay: number;
  description: string;
  freeCancellation: boolean;
  smocking: boolean;
  amenities: Feature[];
  services: Feature[];
  beds: WithQuantityFeature[];
  rooms: { id: number; number: number }[];
  miniatures: Image[];
  imagesCount: number;
}

export interface Hotel {
  id: number;
  name: string;
  brand: string;
  category: string;
  lowestPrice: number;
  address: {
    holeAddress: string;
    country: string;
    postalCode: string;
    administrativeArea: string;
    city: string;
    street: string;
  };
  checkInHour: string;
  checkOutHour: string;
  taxesAndCharges: number;
  telephone: string;
  email?: string;
  website?: string;
  description: string;
  policiesAndRules: string;
  frameImage: string;
  interiorImage: string;
  features: Features;
  activities: Feature[];
  facilities: Feature[];
  services: Feature[];
  languages: Feature[];
  roomModels: RoomModel[];
  miniatures: Image[];
  imagesCount: number;
}
export interface RoomBuilderVariables {
  hotelId?: number;
  beds: Array<{ type: string; quantity: number }>;
  services: string[];
  amenities: string[];
  name: string;
  description: string;
  smocking: boolean;
  freeCancellation: boolean;
  category: string;
  mts2: number;
  mainImage: File;
  maximumGuests: number;
  maximumNights?: number;
  minimumNights: number;
  lowestPrice: number;
  taxesAndCharges?: number;
}
export interface SessionPayload {
  loading: boolean;
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: 'ADMIN' | 'USER';
  };
}
export interface BookingRequest {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  specifications: string;
  createdAt: string;
  nights: number;
  client: {
    id: number;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    landlineNumber: string;
    email: string;
  };
  guestsDistribution: Array<{ id: number; children: number; adults: number }>;
  roomModel: {
    id: number;
    name: string;
    lowestPrice: number;
    taxesAndCharges: number;
  };
  availableRooms: Array<{
    id: number;
    number: number;
  }>;
}
export type FileUploadEvent = {
  target: {
    files: File[];
    name: string;
  };
};

export interface HotelGuest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  landlineNumber: string;
  bookings: {
    id: number;
    roomModel: {
      name: string;
    };
    reservedRooms: {
      number: number;
    }[];
  }[];
}
export interface Booking {
  id: number;
  totalCost: number;
  paymentMethod: string;
  specifications: number;
  clientId: number;
  client: HotelGuest;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  roomModel: RoomModel;
  reservedRooms: {
    number: number;
  }[];
  guestsDistribution: {
    id: number;
    adults: number;
    children: number;
  }[];
}
export interface CancellationDetails {
  id: number;
  createdAt: string;
  cancellationFee: number;
  message: string;
  bookingId: number;
}
export interface Album {
  id: number;
  createdAt: string;
  hotelId: number;
  roomModelId: number | null;
  name: string;
  images: {
    id: number;
    src: string;
  };
}
export interface BookingEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: number;
  color: string;
  status: string;
  allDay?: boolean;
  selectable?: boolean;
}
export interface BookingResourceMap {
  resourceId: number;
  resourceTitle: string;
}
export type WithLayoutPage<P = null> = NextPage<P> & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

export type Modify<T, R> = Omit<T, keyof R> & R;
