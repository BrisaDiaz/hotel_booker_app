export type Address = {
  holeAddress: string;
  country?: string;
  postalCode?: string;
  administrativeArea?: string;
  city?: string;
  street?: string;
};
export type Option = {
  id: number;
  name: string;
};
export type Features = {
  accesible: string;
  freeCancelation: string;
  familyFriendly: string;
  petFriendly: string;
  smokerFriendly: string;
  ecoFriendly: string;
};
export type WithQuantityItem = {
  type: string;
  quantity: number;
};
export interface RoomModel {
  id: number;
  hotelId: number;
  category: string;
  name: string;
  mts2: number;
  mainImage: string;
  lowestPrice: number;
  maximunGuests?: number;
  maximunStays?: number;
  minimunStays?: number;
  description?: string;
  freeCancelation?: Boolean;
  amenties?: Option[];
  services?: Option[];
  beds?: WithQuantityItem[];
  public: boolean;
}

export interface Hotel {
  id?: number;
  name: string;
  brand?: string;
  category?: string;
  lowestPrice: number;
  taxesAndCharges?: number;
  telephone?: string;
  email?: string;
  website?: string;
  description?: string;
  policiesAndRules?: string;
  frameImage: string;
  interiorImage?: string;
  features?: Features;
  activities?: Option[];
  facilities?: Option[];
  services?: Option[];
  languages?: Option[];
  roomsModels?: RoomModel[];
  public: boolean;
}
