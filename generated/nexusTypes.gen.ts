/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */







declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  bedsSpecifications: { // input type
    quantity?: number | null; // Int
    type?: string | null; // String
  }
  roomSpecifications: { // input type
    adults?: number | null; // Int
    children?: number | null; // Int
  }
}

export interface NexusGenEnums {
  BookingRequestStatus: "DECLINED" | "PENDING"
  BookingStatus: "ACTIVE" | "CANCELED" | "FINISH"
  PaymentMethod: "BILL_TO_ACCOUNT" | "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "TRAVELER_CHECK"
  Role: "ADMIN" | "USER"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenObjects {
  Activity: { // root type
    id?: string | null; // ID
    name?: string | null; // String
  }
  Address: { // root type
    administrativeArea?: string | null; // String
    city?: string | null; // String
    country?: string | null; // String
    holeAddress?: string | null; // String
    hotelId: string; // ID!
    id: string; // ID!
    postalCode?: string | null; // String
    street?: string | null; // String
  }
  AdminHotels: { // root type
    hotels?: Array<NexusGenRootTypes['Hotel'] | null> | null; // [Hotel]
    hotelsCount?: number | null; // Int
  }
  Administrator: { // root type
    id?: string | null; // ID
    userId?: number | null; // Int
  }
  Amenity: { // root type
    id?: string | null; // ID
    name?: string | null; // String
  }
  AuthPayload: { // root type
    token?: string | null; // String
    user?: NexusGenRootTypes['User'] | null; // User
  }
  BedType: { // root type
    id?: string | null; // ID
    name?: string | null; // String
  }
  Booking: { // root type
    adults?: number | null; // Int
    checkInDate?: number | null; // Int
    checkOutDate?: number | null; // Int
    children?: number | null; // Int
    clientId?: number | null; // Int
    guestsDistribution?: NexusGenRootTypes['GuestsDistribution'] | null; // GuestsDistribution
    hotelId?: number | null; // Int
    id?: string | null; // ID
    paymentMethod?: NexusGenEnums['PaymentMethod'] | null; // PaymentMethod
    roomId?: number | null; // Int
    roomModelId?: number | null; // Int
    rooms?: number | null; // Int
    specifications?: string | null; // String
    status?: NexusGenEnums['BookingStatus'] | null; // BookingStatus
    totalCost?: number | null; // Float
  }
  BookingRequest: { // root type
    adults?: number | null; // Int
    checkInDate?: number | null; // Int
    checkOutDate?: number | null; // Int
    children?: number | null; // Int
    email?: string | null; // String
    guestsDistribution?: NexusGenRootTypes['GuestsDistribution'] | null; // GuestsDistribution
    hotelId?: number | null; // Int
    id?: string | null; // ID
    roomModelId?: number | null; // Int
    specifications?: string | null; // String
    status?: NexusGenEnums['BookingRequestStatus'] | null; // BookingRequestStatus
    telephone?: number | null; // Int
    userId?: number | null; // Int
  }
  Client: { // root type
    bookings?: Array<NexusGenRootTypes['Booking'] | null> | null; // [Booking]
    cellularNumber?: string | null; // String
    email?: string | null; // String
    firstName?: string | null; // String
    homePhoneNumber?: string | null; // String
    id?: string | null; // ID
    lastName?: string | null; // String
  }
  Facility: { // root type
    id: string; // ID!
    name: string; // String!
  }
  Features: { // root type
    accessible?: boolean | null; // Boolean
    ecoFriendly?: boolean | null; // Boolean
    familyFriendly?: boolean | null; // Boolean
    freeCancelation?: boolean | null; // Boolean
    petFriendly?: boolean | null; // Boolean
    smokerFriendly?: boolean | null; // Boolean
  }
  GuestsDistribution: { // root type
    adults?: number | null; // Int
    children?: number | null; // Int
    id?: string | null; // ID
  }
  Hotel: { // root type
    activities?: Array<NexusGenRootTypes['Activity'] | null> | null; // [Activity]
    administratorId?: number | null; // Int
    brand?: string | null; // String
    category?: string | null; // String
    checkInHour?: string | null; // String
    checkOutHour?: string | null; // String
    description?: string | null; // String
    email?: string | null; // String
    facilities?: Array<NexusGenRootTypes['Facility'] | null> | null; // [Facility]
    frameImage?: string | null; // String
    id: string; // ID!
    interiorImage?: string | null; // String
    languages?: Array<NexusGenRootTypes['Language'] | null> | null; // [Language]
    lowestPrice?: number | null; // Float
    name?: string | null; // String
    policiesAndRules?: string | null; // String
    public?: boolean | null; // Boolean
    services?: Array<NexusGenRootTypes['Service'] | null> | null; // [Service]
    taxesAndCharges?: number | null; // Float
    telephone?: string | null; // String
    website?: string | null; // String
  }
  HotelCategory: { // root type
    id?: string | null; // ID
    name?: string | null; // String
  }
  HotelData: { // root type
    bookings?: Array<NexusGenRootTypes['Booking'] | null> | null; // [Booking]
    bookingsCount?: number | null; // Int
    guests?: Array<NexusGenRootTypes['Client'] | null> | null; // [Client]
    guestsCount?: number | null; // Int
    hotel?: NexusGenRootTypes['Hotel'] | null; // Hotel
    requests?: Array<NexusGenRootTypes['BookingRequest'] | null> | null; // [BookingRequest]
    requestsCount?: number | null; // Int
    roomModels?: Array<NexusGenRootTypes['RoomModel'] | null> | null; // [RoomModel]
    roomModelsCount?: number | null; // Int
  }
  HotelSearch: { // root type
    hotels?: Array<NexusGenRootTypes['Hotel'] | null> | null; // [Hotel]
    pageCount?: number | null; // Int
    totalResults?: number | null; // Int
  }
  Image: { // root type
    hotelId?: number | null; // Int
    id?: string | null; // ID
    roomId?: number | null; // Int
    src?: string | null; // String
    title?: string | null; // String
  }
  Language: { // root type
    id?: string | null; // ID
    name?: string | null; // String
  }
  Mutation: {};
  Mutetion: {};
  PlainResponse: { // root type
    message?: string | null; // String
  }
  Query: {};
  Room: { // root type
    bookings?: Array<NexusGenRootTypes['Booking'] | null> | null; // [Booking]
    id?: string | null; // ID
    number?: number | null; // Int
    roomModelId?: number | null; // Int
  }
  RoomBed: { // root type
    id?: string | null; // ID
    quantity?: number | null; // Int
    roomModelId?: number | null; // Int
    type?: string | null; // String
  }
  RoomCategory: { // root type
    id?: string | null; // ID
    name?: string | null; // String
  }
  RoomConsultResponse: { // root type
    isAvailable?: boolean | null; // Boolean
    message?: string | null; // String
  }
  RoomModel: { // root type
    amenities?: Array<NexusGenRootTypes['Amenity'] | null> | null; // [Amenity]
    canselationFree?: boolean | null; // Boolean
    category?: string | null; // String
    description?: string | null; // String
    freeCancelation?: boolean | null; // Boolean
    hotelId?: number | null; // Int
    id?: string | null; // ID
    lowestPrice?: number | null; // Float
    mainImage?: string | null; // String
    maximunGuests?: number | null; // Int
    maximunStay?: number | null; // Int
    minimunStay?: number | null; // Int
    mts2?: number | null; // Int
    name?: string | null; // String
    services?: Array<NexusGenRootTypes['Service'] | null> | null; // [Service]
    smooking?: boolean | null; // Boolean
    taxesAndCharges?: number | null; // Float
  }
  RoomModelData: { // root type
    bookings?: Array<NexusGenRootTypes['Booking'] | null> | null; // [Booking]
    bookingsCount?: number | null; // Int
    guests?: Array<NexusGenRootTypes['Client'] | null> | null; // [Client]
    guestsCount?: number | null; // Int
    rooms?: NexusGenRootTypes['Room'] | null; // Room
    roomsCount?: number | null; // Int
  }
  Service: { // root type
    id?: string | null; // ID
    name?: string | null; // String
  }
  User: { // root type
    email?: string | null; // String
    firstName?: string | null; // String
    id?: string | null; // ID
    lastName?: string | null; // String
    password?: string | null; // String
    role?: NexusGenEnums['Role'] | null; // Role
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Activity: { // field return type
    id: string | null; // ID
    name: string | null; // String
  }
  Address: { // field return type
    administrativeArea: string | null; // String
    city: string | null; // String
    country: string | null; // String
    holeAddress: string | null; // String
    hotelId: string; // ID!
    id: string; // ID!
    postalCode: string | null; // String
    street: string | null; // String
  }
  AdminHotels: { // field return type
    hotels: Array<NexusGenRootTypes['Hotel'] | null> | null; // [Hotel]
    hotelsCount: number | null; // Int
  }
  Administrator: { // field return type
    hotels: Array<NexusGenRootTypes['Hotel'] | null> | null; // [Hotel]
    id: string | null; // ID
    user: NexusGenRootTypes['User'] | null; // User
    userId: number | null; // Int
  }
  Amenity: { // field return type
    id: string | null; // ID
    name: string | null; // String
  }
  AuthPayload: { // field return type
    token: string | null; // String
    user: NexusGenRootTypes['User'] | null; // User
  }
  BedType: { // field return type
    id: string | null; // ID
    name: string | null; // String
  }
  Booking: { // field return type
    adults: number | null; // Int
    checkInDate: number | null; // Int
    checkOutDate: number | null; // Int
    children: number | null; // Int
    client: NexusGenRootTypes['Client'] | null; // Client
    clientId: number | null; // Int
    guestsDistribution: NexusGenRootTypes['GuestsDistribution'] | null; // GuestsDistribution
    hotel: NexusGenRootTypes['Hotel'] | null; // Hotel
    hotelId: number | null; // Int
    id: string | null; // ID
    paymentMethod: NexusGenEnums['PaymentMethod'] | null; // PaymentMethod
    room: NexusGenRootTypes['Room'] | null; // Room
    roomId: number | null; // Int
    roomModel: NexusGenRootTypes['RoomModel'] | null; // RoomModel
    roomModelId: number | null; // Int
    rooms: number | null; // Int
    specifications: string | null; // String
    status: NexusGenEnums['BookingStatus'] | null; // BookingStatus
    totalCost: number | null; // Float
  }
  BookingRequest: { // field return type
    adults: number | null; // Int
    checkInDate: number | null; // Int
    checkOutDate: number | null; // Int
    children: number | null; // Int
    email: string | null; // String
    guestsDistribution: NexusGenRootTypes['GuestsDistribution'] | null; // GuestsDistribution
    hotelId: number | null; // Int
    id: string | null; // ID
    roomModel: NexusGenRootTypes['RoomModel'] | null; // RoomModel
    roomModelId: number | null; // Int
    specifications: string | null; // String
    status: NexusGenEnums['BookingRequestStatus'] | null; // BookingRequestStatus
    telephone: number | null; // Int
    user: NexusGenRootTypes['User'] | null; // User
    userId: number | null; // Int
  }
  Client: { // field return type
    bookings: Array<NexusGenRootTypes['Booking'] | null> | null; // [Booking]
    cellularNumber: string | null; // String
    email: string | null; // String
    firstName: string | null; // String
    homePhoneNumber: string | null; // String
    id: string | null; // ID
    lastName: string | null; // String
  }
  Facility: { // field return type
    id: string; // ID!
    name: string; // String!
  }
  Features: { // field return type
    accessible: boolean | null; // Boolean
    ecoFriendly: boolean | null; // Boolean
    familyFriendly: boolean | null; // Boolean
    freeCancelation: boolean | null; // Boolean
    petFriendly: boolean | null; // Boolean
    smokerFriendly: boolean | null; // Boolean
  }
  GuestsDistribution: { // field return type
    adults: number | null; // Int
    children: number | null; // Int
    id: string | null; // ID
  }
  Hotel: { // field return type
    activities: Array<NexusGenRootTypes['Activity'] | null> | null; // [Activity]
    address: NexusGenRootTypes['Address'] | null; // Address
    administratorId: number | null; // Int
    adminstrator: NexusGenRootTypes['Administrator'] | null; // Administrator
    brand: string | null; // String
    category: string | null; // String
    checkInHour: string | null; // String
    checkOutHour: string | null; // String
    description: string | null; // String
    email: string | null; // String
    facilities: Array<NexusGenRootTypes['Facility'] | null> | null; // [Facility]
    features: NexusGenRootTypes['Features'] | null; // Features
    frameImage: string | null; // String
    id: string; // ID!
    images: Array<NexusGenRootTypes['Image'] | null> | null; // [Image]
    interiorImage: string | null; // String
    languages: Array<NexusGenRootTypes['Language'] | null> | null; // [Language]
    lowestPrice: number | null; // Float
    name: string | null; // String
    policiesAndRules: string | null; // String
    public: boolean | null; // Boolean
    roomModels: Array<NexusGenRootTypes['RoomModel'] | null> | null; // [RoomModel]
    services: Array<NexusGenRootTypes['Service'] | null> | null; // [Service]
    taxesAndCharges: number | null; // Float
    telephone: string | null; // String
    website: string | null; // String
  }
  HotelCategory: { // field return type
    id: string | null; // ID
    name: string | null; // String
  }
  HotelData: { // field return type
    bookings: Array<NexusGenRootTypes['Booking'] | null> | null; // [Booking]
    bookingsCount: number | null; // Int
    guests: Array<NexusGenRootTypes['Client'] | null> | null; // [Client]
    guestsCount: number | null; // Int
    hotel: NexusGenRootTypes['Hotel'] | null; // Hotel
    requests: Array<NexusGenRootTypes['BookingRequest'] | null> | null; // [BookingRequest]
    requestsCount: number | null; // Int
    roomModels: Array<NexusGenRootTypes['RoomModel'] | null> | null; // [RoomModel]
    roomModelsCount: number | null; // Int
  }
  HotelSearch: { // field return type
    hotels: Array<NexusGenRootTypes['Hotel'] | null> | null; // [Hotel]
    pageCount: number | null; // Int
    totalResults: number | null; // Int
  }
  Image: { // field return type
    hotelId: number | null; // Int
    id: string | null; // ID
    roomId: number | null; // Int
    src: string | null; // String
    title: string | null; // String
  }
  Language: { // field return type
    id: string | null; // ID
    name: string | null; // String
  }
  Mutation: { // field return type
    addNewClient: NexusGenRootTypes['Client'] | null; // Client
    addRoomToModel: Array<NexusGenRootTypes['Room'] | null> | null; // [Room]
    creatHotelRoomModel: NexusGenRootTypes['RoomModel'] | null; // RoomModel
    createHotel: NexusGenRootTypes['Hotel'] | null; // Hotel
    deleteRoomOfModel: Array<NexusGenRootTypes['Room'] | null> | null; // [Room]
    editRoomModelVicibility: NexusGenRootTypes['RoomModel'] | null; // RoomModel
    makeBooking: NexusGenRootTypes['Booking'] | null; // Booking
    makeBookingRequest: NexusGenRootTypes['BookingRequest'] | null; // BookingRequest
    signin: NexusGenRootTypes['AuthPayload'] | null; // AuthPayload
    signout: NexusGenRootTypes['PlainResponse'] | null; // PlainResponse
    signup: NexusGenRootTypes['User'] | null; // User
    updateHotelAddress: NexusGenRootTypes['Address'] | null; // Address
    updateHotelLowestPrice: NexusGenRootTypes['Hotel'] | null; // Hotel
    updateRoomModelPrice: NexusGenRootTypes['RoomModel'] | null; // RoomModel
  }
  Mutetion: { // field return type
    updateMyAccount: NexusGenRootTypes['User'] | null; // User
  }
  PlainResponse: { // field return type
    message: string | null; // String
  }
  Query: { // field return type
    activitiesList: Array<NexusGenRootTypes['Activity'] | null> | null; // [Activity]
    adminHotels: NexusGenRootTypes['AdminHotels'] | null; // AdminHotels
    amenitiesList: Array<NexusGenRootTypes['Amenity'] | null> | null; // [Amenity]
    authentication: NexusGenRootTypes['User'] | null; // User
    bedTypesList: Array<NexusGenRootTypes['BedType'] | null> | null; // [BedType]
    bookingById: NexusGenRootTypes['Booking'] | null; // Booking
    checkRoomAvailability: NexusGenRootTypes['RoomConsultResponse'] | null; // RoomConsultResponse
    facilitiesList: Array<NexusGenRootTypes['Facility'] | null> | null; // [Facility]
    hotelById: NexusGenRootTypes['Hotel'] | null; // Hotel
    hotelCategoriesList: Array<NexusGenRootTypes['HotelCategory'] | null> | null; // [HotelCategory]
    hotelData: NexusGenRootTypes['HotelData'] | null; // HotelData
    hotelSearch: NexusGenRootTypes['HotelSearch'] | null; // HotelSearch
    languagesList: Array<NexusGenRootTypes['Language'] | null> | null; // [Language]
    roomCategoriesList: Array<NexusGenRootTypes['RoomCategory'] | null> | null; // [RoomCategory]
    roomModelById: NexusGenRootTypes['RoomModel'] | null; // RoomModel
    roomModelData: NexusGenRootTypes['RoomModelData'] | null; // RoomModelData
    servicesList: Array<NexusGenRootTypes['Service'] | null> | null; // [Service]
  }
  Room: { // field return type
    bookings: Array<NexusGenRootTypes['Booking'] | null> | null; // [Booking]
    id: string | null; // ID
    number: number | null; // Int
    roomModel: NexusGenRootTypes['RoomModel'] | null; // RoomModel
    roomModelId: number | null; // Int
  }
  RoomBed: { // field return type
    id: string | null; // ID
    quantity: number | null; // Int
    roomModelId: number | null; // Int
    type: string | null; // String
  }
  RoomCategory: { // field return type
    id: string | null; // ID
    name: string | null; // String
  }
  RoomConsultResponse: { // field return type
    isAvailable: boolean | null; // Boolean
    message: string | null; // String
  }
  RoomModel: { // field return type
    amenities: Array<NexusGenRootTypes['Amenity'] | null> | null; // [Amenity]
    beds: Array<NexusGenRootTypes['RoomBed'] | null> | null; // [RoomBed]
    canselationFree: boolean | null; // Boolean
    category: string | null; // String
    description: string | null; // String
    freeCancelation: boolean | null; // Boolean
    hotel: NexusGenRootTypes['Hotel'] | null; // Hotel
    hotelId: number | null; // Int
    id: string | null; // ID
    images: Array<NexusGenRootTypes['Image'] | null> | null; // [Image]
    lowestPrice: number | null; // Float
    mainImage: string | null; // String
    maximunGuests: number | null; // Int
    maximunStay: number | null; // Int
    minimunStay: number | null; // Int
    mts2: number | null; // Int
    name: string | null; // String
    rooms: Array<NexusGenRootTypes['Room'] | null> | null; // [Room]
    services: Array<NexusGenRootTypes['Service'] | null> | null; // [Service]
    smooking: boolean | null; // Boolean
    taxesAndCharges: number | null; // Float
  }
  RoomModelData: { // field return type
    bookings: Array<NexusGenRootTypes['Booking'] | null> | null; // [Booking]
    bookingsCount: number | null; // Int
    guests: Array<NexusGenRootTypes['Client'] | null> | null; // [Client]
    guestsCount: number | null; // Int
    rooms: NexusGenRootTypes['Room'] | null; // Room
    roomsCount: number | null; // Int
  }
  Service: { // field return type
    id: string | null; // ID
    name: string | null; // String
  }
  User: { // field return type
    email: string | null; // String
    firstName: string | null; // String
    id: string | null; // ID
    lastName: string | null; // String
    password: string | null; // String
    role: NexusGenEnums['Role'] | null; // Role
  }
}

export interface NexusGenFieldTypeNames {
  Activity: { // field return type name
    id: 'ID'
    name: 'String'
  }
  Address: { // field return type name
    administrativeArea: 'String'
    city: 'String'
    country: 'String'
    holeAddress: 'String'
    hotelId: 'ID'
    id: 'ID'
    postalCode: 'String'
    street: 'String'
  }
  AdminHotels: { // field return type name
    hotels: 'Hotel'
    hotelsCount: 'Int'
  }
  Administrator: { // field return type name
    hotels: 'Hotel'
    id: 'ID'
    user: 'User'
    userId: 'Int'
  }
  Amenity: { // field return type name
    id: 'ID'
    name: 'String'
  }
  AuthPayload: { // field return type name
    token: 'String'
    user: 'User'
  }
  BedType: { // field return type name
    id: 'ID'
    name: 'String'
  }
  Booking: { // field return type name
    adults: 'Int'
    checkInDate: 'Int'
    checkOutDate: 'Int'
    children: 'Int'
    client: 'Client'
    clientId: 'Int'
    guestsDistribution: 'GuestsDistribution'
    hotel: 'Hotel'
    hotelId: 'Int'
    id: 'ID'
    paymentMethod: 'PaymentMethod'
    room: 'Room'
    roomId: 'Int'
    roomModel: 'RoomModel'
    roomModelId: 'Int'
    rooms: 'Int'
    specifications: 'String'
    status: 'BookingStatus'
    totalCost: 'Float'
  }
  BookingRequest: { // field return type name
    adults: 'Int'
    checkInDate: 'Int'
    checkOutDate: 'Int'
    children: 'Int'
    email: 'String'
    guestsDistribution: 'GuestsDistribution'
    hotelId: 'Int'
    id: 'ID'
    roomModel: 'RoomModel'
    roomModelId: 'Int'
    specifications: 'String'
    status: 'BookingRequestStatus'
    telephone: 'Int'
    user: 'User'
    userId: 'Int'
  }
  Client: { // field return type name
    bookings: 'Booking'
    cellularNumber: 'String'
    email: 'String'
    firstName: 'String'
    homePhoneNumber: 'String'
    id: 'ID'
    lastName: 'String'
  }
  Facility: { // field return type name
    id: 'ID'
    name: 'String'
  }
  Features: { // field return type name
    accessible: 'Boolean'
    ecoFriendly: 'Boolean'
    familyFriendly: 'Boolean'
    freeCancelation: 'Boolean'
    petFriendly: 'Boolean'
    smokerFriendly: 'Boolean'
  }
  GuestsDistribution: { // field return type name
    adults: 'Int'
    children: 'Int'
    id: 'ID'
  }
  Hotel: { // field return type name
    activities: 'Activity'
    address: 'Address'
    administratorId: 'Int'
    adminstrator: 'Administrator'
    brand: 'String'
    category: 'String'
    checkInHour: 'String'
    checkOutHour: 'String'
    description: 'String'
    email: 'String'
    facilities: 'Facility'
    features: 'Features'
    frameImage: 'String'
    id: 'ID'
    images: 'Image'
    interiorImage: 'String'
    languages: 'Language'
    lowestPrice: 'Float'
    name: 'String'
    policiesAndRules: 'String'
    public: 'Boolean'
    roomModels: 'RoomModel'
    services: 'Service'
    taxesAndCharges: 'Float'
    telephone: 'String'
    website: 'String'
  }
  HotelCategory: { // field return type name
    id: 'ID'
    name: 'String'
  }
  HotelData: { // field return type name
    bookings: 'Booking'
    bookingsCount: 'Int'
    guests: 'Client'
    guestsCount: 'Int'
    hotel: 'Hotel'
    requests: 'BookingRequest'
    requestsCount: 'Int'
    roomModels: 'RoomModel'
    roomModelsCount: 'Int'
  }
  HotelSearch: { // field return type name
    hotels: 'Hotel'
    pageCount: 'Int'
    totalResults: 'Int'
  }
  Image: { // field return type name
    hotelId: 'Int'
    id: 'ID'
    roomId: 'Int'
    src: 'String'
    title: 'String'
  }
  Language: { // field return type name
    id: 'ID'
    name: 'String'
  }
  Mutation: { // field return type name
    addNewClient: 'Client'
    addRoomToModel: 'Room'
    creatHotelRoomModel: 'RoomModel'
    createHotel: 'Hotel'
    deleteRoomOfModel: 'Room'
    editRoomModelVicibility: 'RoomModel'
    makeBooking: 'Booking'
    makeBookingRequest: 'BookingRequest'
    signin: 'AuthPayload'
    signout: 'PlainResponse'
    signup: 'User'
    updateHotelAddress: 'Address'
    updateHotelLowestPrice: 'Hotel'
    updateRoomModelPrice: 'RoomModel'
  }
  Mutetion: { // field return type name
    updateMyAccount: 'User'
  }
  PlainResponse: { // field return type name
    message: 'String'
  }
  Query: { // field return type name
    activitiesList: 'Activity'
    adminHotels: 'AdminHotels'
    amenitiesList: 'Amenity'
    authentication: 'User'
    bedTypesList: 'BedType'
    bookingById: 'Booking'
    checkRoomAvailability: 'RoomConsultResponse'
    facilitiesList: 'Facility'
    hotelById: 'Hotel'
    hotelCategoriesList: 'HotelCategory'
    hotelData: 'HotelData'
    hotelSearch: 'HotelSearch'
    languagesList: 'Language'
    roomCategoriesList: 'RoomCategory'
    roomModelById: 'RoomModel'
    roomModelData: 'RoomModelData'
    servicesList: 'Service'
  }
  Room: { // field return type name
    bookings: 'Booking'
    id: 'ID'
    number: 'Int'
    roomModel: 'RoomModel'
    roomModelId: 'Int'
  }
  RoomBed: { // field return type name
    id: 'ID'
    quantity: 'Int'
    roomModelId: 'Int'
    type: 'String'
  }
  RoomCategory: { // field return type name
    id: 'ID'
    name: 'String'
  }
  RoomConsultResponse: { // field return type name
    isAvailable: 'Boolean'
    message: 'String'
  }
  RoomModel: { // field return type name
    amenities: 'Amenity'
    beds: 'RoomBed'
    canselationFree: 'Boolean'
    category: 'String'
    description: 'String'
    freeCancelation: 'Boolean'
    hotel: 'Hotel'
    hotelId: 'Int'
    id: 'ID'
    images: 'Image'
    lowestPrice: 'Float'
    mainImage: 'String'
    maximunGuests: 'Int'
    maximunStay: 'Int'
    minimunStay: 'Int'
    mts2: 'Int'
    name: 'String'
    rooms: 'Room'
    services: 'Service'
    smooking: 'Boolean'
    taxesAndCharges: 'Float'
  }
  RoomModelData: { // field return type name
    bookings: 'Booking'
    bookingsCount: 'Int'
    guests: 'Client'
    guestsCount: 'Int'
    rooms: 'Room'
    roomsCount: 'Int'
  }
  Service: { // field return type name
    id: 'ID'
    name: 'String'
  }
  User: { // field return type name
    email: 'String'
    firstName: 'String'
    id: 'ID'
    lastName: 'String'
    password: 'String'
    role: 'Role'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    addNewClient: { // args
      cellularNumber: string; // String!
      email: string; // String!
      firstName: string; // String!
      homePhoneNumber: string; // String!
      hotelId: string; // ID!
      lastName: string; // String!
      userId: string; // ID!
    }
    addRoomToModel: { // args
      hotelId: string; // ID!
      roomModelId: string; // ID!
      roomNumbers: number[]; // [Int!]!
      userId: string; // ID!
    }
    creatHotelRoomModel: { // args
      amenities: Array<string | null>; // [String]!
      beds: Array<NexusGenInputs['bedsSpecifications'] | null>; // [bedsSpecifications]!
      category: string; // String!
      description: string; // String!
      freeCancelation: boolean; // Boolean!
      hotelId: string; // ID!
      lowestPrice: number; // Float!
      mainImage: string; // String!
      maximunGuests: number; // Int!
      maximunStay?: number | null; // Int
      minimunStay: number; // Int!
      mts2: number; // Int!
      name: string; // String!
      services: Array<string | null>; // [String]!
      smooking: boolean; // Boolean!
      taxesAndCharges: number; // Float!
      userId: string; // ID!
    }
    createHotel: { // args
      accessible: boolean; // Boolean!
      activities: Array<string | null>; // [String]!
      administrativeArea: string; // String!
      brand?: string | null; // String
      category?: string | null; // String
      checkInHour: string; // String!
      checkOutHour: string; // String!
      city?: string | null; // String
      country?: string | null; // String
      description: string; // String!
      ecoFriendly: boolean; // Boolean!
      email?: string | null; // String
      facilities: Array<string | null>; // [String]!
      familyFriendly: boolean; // Boolean!
      frameImage: string; // String!
      freeCancelation: boolean; // Boolean!
      holeAddress: string; // String!
      interiorImage: string; // String!
      languages: Array<string | null>; // [String]!
      lowestPrice: number; // Float!
      name: string; // String!
      petFriendly: boolean; // Boolean!
      policiesAndRules: string; // String!
      postalCode: string; // String!
      services: Array<string | null>; // [String]!
      smokerFriendly: boolean; // Boolean!
      street?: string | null; // String
      taxesAndCharges: number; // Float!
      telephone: string; // String!
      userId: string; // ID!
      website?: string | null; // String
    }
    deleteRoomOfModel: { // args
      hotelId: string; // ID!
      roomModelId: string; // ID!
      roomsIds: number[]; // [Int!]!
      userId: string; // ID!
    }
    editRoomModelVicibility: { // args
      hotelId: number; // Int!
      public: boolean; // Boolean!
      roomModelId: string; // ID!
      userId: string; // ID!
    }
    makeBooking: { // args
      adults: number; // Int!
      checkInDate: string; // String!
      checkOutDate: string; // String!
      children: number; // Int!
      clientId: string; // ID!
      guestsDistribution?: Array<NexusGenInputs['roomSpecifications'] | null> | null; // [roomSpecifications]
      hotelId: string; // ID!
      nights: number; // Int!
      paymentMethod?: string | null; // String
      rooModelId: string; // ID!
      roomId: string; // ID!
      rooms: number; // Int!
      totalCost: number; // Float!
      userId: string; // ID!
    }
    makeBookingRequest: { // args
      adults: number; // Int!
      cellularNumber: string; // String!
      checkInDate: string; // String!
      checkOutDate: string; // String!
      children: number; // Int!
      email: string; // String!
      firstName: string; // String!
      guestsDistribution: Array<NexusGenInputs['roomSpecifications'] | null>; // [roomSpecifications]!
      homePhoneNumber: string; // String!
      lastName: string; // String!
      roomModelId: string; // ID!
      specifications: string; // String!
    }
    signin: { // args
      email: string; // String!
      password: string; // String!
    }
    signout: { // args
      date?: string | null; // String
    }
    signup: { // args
      email: string; // String!
      firstName: string; // String!
      lastName: string; // String!
      password: string; // String!
    }
    updateHotelAddress: { // args
      administrativeArea?: string | null; // String
      city?: string | null; // String
      country?: string | null; // String
      holeAddress?: string | null; // String
      hotelId: string; // ID!
      postalCode?: string | null; // String
      street?: string | null; // String
      userId: string; // ID!
    }
    updateHotelLowestPrice: { // args
      hotelId: string; // ID!
      lowestPrice: number; // Float!
      userId: string; // ID!
    }
    updateRoomModelPrice: { // args
      hotelId: string; // ID!
      lowestPrice?: number | null; // Float
      taxesAndCharges?: number | null; // Float
      userId: string; // ID!
    }
  }
  Mutetion: {
    updateMyAccount: { // args
      email?: string | null; // String
      firstName?: string | null; // String
      lastName?: string | null; // String
      password?: string | null; // String
    }
  }
  Query: {
    adminHotels: { // args
      userId: string; // ID!
    }
    bookingById: { // args
      bookingId: string; // ID!
      userId: string; // ID!
    }
    checkRoomAvailability: { // args
      checkInDate: string; // String!
      checkOutDate: string; // String!
      roomModelId: string; // ID!
      rooms: Array<NexusGenInputs['roomSpecifications'] | null>; // [roomSpecifications]!
    }
    hotelById: { // args
      hotelId: string; // ID!
    }
    hotelData: { // args
      hotelId: string; // ID!
      userId: string; // ID!
    }
    hotelSearch: { // args
      activities?: Array<string | null> | null; // [String]
      categories?: Array<string | null> | null; // [String]
      facilities?: Array<string | null> | null; // [String]
      features?: Array<string | null> | null; // [String]
      languages?: Array<string | null> | null; // [String]
      search?: string | null; // String
      services?: Array<string | null> | null; // [String]
      skip?: number | null; // Int
      sort?: string | null; // String
      take?: number | null; // Int
    }
    roomModelById: { // args
      roomModelId: string; // ID!
    }
    roomModelData: { // args
      roomModelId: string; // ID!
      userId: string; // ID!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}