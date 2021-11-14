import { gql } from '@apollo/client';
export const SIGN_OUT = gql`
  mutation signout($date: String) {
    signout(date: $date) {
      message
    }
  }
`;
export const SIGN_IN = gql`
  mutation signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      user {
        firstname
        lastname
        email
      }
    }
  }
`;
export const SIGN_UP = gql`
  mutation signup(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    signup(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      firstname
      lastname
      email
    }
  }
`;
export const CREATE_HOTEL = gql`
  mutation createHotel(
    $name: String!
    $brand: String!
    $category: String!
    $telephone: String!
    $email: String
    $lowestPrice: Float!
    $checkInHour: String!
    $checkOutHour: String!
    $policiesAndRules: String!
    $description: String!
    $frameImage: String!
    $interiorImage: String!
    $activities: [String]!
    $facilities: [String]!
    $services: [String]!
    $languages: [String]!
    $accessible: Boolean!
    $cancelationFree: Boolean!
    $familyFriendly: Boolean!
    $petFriendly: Boolean!
    $smokerFriendly: Boolean!
    $ecoFriendly: Boolean!
    $holeAddress: String!
    $country: String
    $postalCode: String!
    $administrativeArea: String!
    $city: String
    $street: String!
  ) {
    createHotel(
      name: $name
      telephone: $telephone
      email: $email
      brand: $brand
      category: $category
      lowestPrice: $lowestPrice
      checkInHour: $checkInHour
      checkOutHour: $checkOutHour
      policiesAndRules: $policiesAndRules
      description: $description
      frameImage: $frameImage
      interiorImage: $interiorImage
      activities: $activities
      facilities: $facilities
      services: $services
      languages: $languages
      accessible: $accessible
      cancelationFree: $cancelationFree
      familyFriendly: $familyFriendly
      petFriendly: $petFriendly
      smokerFriendly: $smokerFriendly
      ecoFriendly: $ecoFriendly
      holeAddress: $holeAddress
      country: $country
      postalCode: $postalCode
      administrativeArea: $administrativeArea
      city: $city
      street: $street
    ) {
      id
    }
  }
`;

export const EDIT_HOTEL_ADDRESS = gql`
  mutation editHotelAddress(
    $hotelId: ID!
    $holeAddress: String
    $country: String
    $postalCode: String
    $administrativeArea: String
    $city: String
    $street: String
  ) {
    editHotelAddress(
      hotelId: $hotelId
      holeAddress: $holeAddress
      country: $country
      postalCode: $postalCode
      administrativeArea: $administrativeArea
      city: $city
      street: $street
    ) {
      id
    }
  }
`;
export const GET_ALL_SERVICES = gql`
  query servicesList {
    servicesList {
      id
      name
    }
  }
`;
export const GET_ALL_AMENITIES = gql`
  query amenitiesList {
    amenitiesList {
      id
      name
    }
  }
`;
export const GET_ALL_FACILITIES = gql`
  query facilitiesList {
    facilitiesList {
      id
      name
    }
  }
`;

export const GET_ALL_ACTIVITIES = gql`
  query activitiesList {
    activitiesList {
      id
      name
    }
  }
`;
export const GET_ALL_LANGUAGES = gql`
  query languagesList {
    languagesList {
      id
      name
    }
  }
`;
export const GET_ALL_HOTEL_CATEGORIES = gql`
  query hotelCategoriesList {
    hotelCategoriesList {
      id
      name
    }
  }
`;
export const GET_ALL_ROOM_CATEGORIES = gql`
  query roomCategoriesList {
    roomCategoriesList {
      id
      name
    }
  }
`;
export const GET_HOTELS = gql`
  query hotels(
    $search: String
    $sort: String
    $take: Int
    $skip: Int
    $categories: [String]
    $facilities: [String]
    $activities: [String]
    $services: [String]
    $languages: [String]
  ) {
    hotels(
      search: $search
      sort: $sort
      take: $take
      skip: $skip
      services: $services
      categories: $categories
      facilities: $facilities
      activities: $activities
      languages: $languages
    ) {
      id
      name
      lowestPrice
      frameImage
      description
      address {
        id
        holeAddress
      }
    }
  }
`;
export const MAKE_ROOM_CONSULT = gql`
  mutation checkRoomAvailability(
    $roomModelId: ID!
    $checkInDate: String!
    $checkOutDate: String!
    $rooms: [RoomSpecification!]!
  ) {
    checkRoomAvailability(
      roomModelId: $roomModelId
      checkInDate: $checkInDate
      checkOutDate: $checkOutDate
      rooms: $rooms
    ) {
      isAvailable
      message
    }
  }
  extend type RoomSpecification {
    children: Int!
    adults: Int!
  }
`;

export const CREATE_ROOM_MODEL = gql`
  mutation creatHotelRoomModel(
    $hotelId: Int!
    $lowestPrice: Float!
    $name: String!
    $mts2: Int!
    $category: String!
    $description: String!
    $minimunStay: Int!
    $maximunStay: Int!
    $maximunGuests: Int!
    $mainImage: String!
    $services: [String]!
    $amenities: [String]!
  ) {
    creatHotelRoomModel(
      hotelId: $hotelId
      lowestPrice: $lowestPrice
      name: $name
      mts2: $mts2
      category: $category
      description: $description
      minimunStay: $minimunStay
      maximunStay: $maximunStay
      maximunGuests: $maximunGuests
      mainImage: $mainImage
      services: $services
      amenities: $amenities
    ) {
      id
    }
  }
`;
