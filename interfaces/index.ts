import { NextPage } from 'next';
export type Address = {
  holeAddress: string;
  country?: string;
  postalCode?: string;
  administrativeArea?: string;
  city?: string;
  street?: string;
};
export type Item = {
  id: number;
  name: string;
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
export type WithQuantityItem = {
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
  taxesAndCharges: number;
  maximunGuests: number;
  maximunStay?: number;
  minimunStay?: number;
  description?: string;
  freeCancelation?: Boolean;
  smooking?: boolean;
  amenities?: Item[];
  services?: Item[];
  beds?: WithQuantityItem[];
}

export interface Hotel {
  id?: number;
  name: string;
  brand?: string;
  category?: string;
  lowestPrice: number;
  address: Address;
  checkInHour: string;
  checkOutHour: string;
  taxesAndCharges?: number;
  telephone?: string;
  email?: string;
  website?: string;
  description?: string;
  policiesAndRules?: string;
  frameImage: string;
  interiorImage?: string;
  features?: Features;
  activities?: Item[];
  facilities?: Item[];
  services?: Item[];
  languages?: Item[];
  roomModels?: RoomModel[];
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
  mainImage: string;
  maximunGuests: number;
  maximunNights?: number;
  minimunNights: number;
  lowestPrice: number;
  taxesAndCharges?: number;
}
export interface SessionPayload {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
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
    taxesAndPrices: number;
  };
  availableRooms: Array<{
    id: number;
    number: number;
  }>;
}
export type WithLayoutPage<P = {}> = NextPage<P> & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};
