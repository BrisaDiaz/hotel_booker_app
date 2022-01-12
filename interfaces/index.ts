import { NextPage } from 'next';

export type Feature = {
  id: number;
  name: string;
  hotelsCount?: number;
};
export type Features = {
  __typename: string;
  accesible: boolean;
  freeCancelation: boolean;
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
export interface RoomModel {
  id: number;
  hotel: Hotel;
  hotelId: number;
  category: string;
  name: string;
  mts2: number;
  mainImage: string;
  lowestPrice: number;
  cancelationFee: number;
  taxesAndCharges: number;
  maximunGuests: number;
  maximunStay: number;
  minimunStay: number;
  description: string;
  freeCancelation: boolean;
  smooking: boolean;
  amenities: Feature[];
  services: Feature[];
  beds: WithQuantityFeature[];
  rooms: { id: string; number: number }[];
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
}
export interface RoomBuildierVariables {
  hotelId?: number;
  beds: Array<{ type: string; quantity: number }>;
  services: string[];
  amenities: string[];
  name: string;
  description: string;
  smooking: boolean;
  freeCancelation: boolean;
  category: string;
  mts2: number;
  mainImage: File;
  maximunGuests: number;
  maximunNights?: number;
  minimunNights: number;
  lowestPrice: number;
  taxesAndCharges?: number;
}
export interface SessionPayload {
  loading:boolean;
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
    id: string;
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
  client:HotelGuest;
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
export interface CancelationDetails {
  id: number;
  createdAt: string;
  cancelationFee: number;
  message: string;
  bookingId: number;
}
export interface Album {
  id: number;
  createdAt: string;
  hotelId: number;
  roomModelId: number|null;
  name:string;
  images: {
    id:number,
    src:string
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
export type WithLayoutPage<P =null> = NextPage<P> & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};
export type Modify<T, R> = Omit<T, keyof R> & R;
