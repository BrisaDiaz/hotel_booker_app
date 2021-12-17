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
        firstName
        lastName

        email
        role
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
    $userId: ID!
    $name: String!
    $brand: String!
    $category: String!
    $telephone: String!
    $email: String
    $website: String
    $lowestPrice: Float!
    $taxesAndCharges: Float!
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
    $freeCancelation: Boolean!
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
      userId: $userId
      name: $name
      telephone: $telephone
      email: $email
      website: $website
      brand: $brand
      category: $category
      lowestPrice: $lowestPrice
      taxesAndCharges: $taxesAndCharges
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
      freeCancelation: $freeCancelation
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
export const UPDATE_HOTEL = gql`
  mutation updateHotel(
    $userId: ID!
    $hotelId: ID!
    $name: String
    $brand: String
    $category: String
    $telephone: String
    $email: String
    $website: String
    $lowestPrice: Float
    $taxesAndCharges: Float
    $checkInHour: String
    $checkOutHour: String
    $policiesAndRules: String
    $description: String
    $frameImage: String
    $interiorImage: String
    $activities: [String]
    $facilities: [String]
    $services: [String]
    $languages: [String]
    $accessible: Boolean
    $freeCancelation: Boolean
    $familyFriendly: Boolean
    $petFriendly: Boolean
    $smokerFriendly: Boolean
    $ecoFriendly: Boolean
    $holeAddress: String
    $country: String
    $postalCode: String
    $administrativeArea: String
    $city: String
    $street: String
  ) {
    hotel: updateHotel(
      userId: $userId
      hotelId: $hotelId
      name: $name
      telephone: $telephone
      email: $email
      website: $website
      brand: $brand
      category: $category
      lowestPrice: $lowestPrice
      taxesAndCharges: $taxesAndCharges
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
      freeCancelation: $freeCancelation
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
      name
      brand
      category
      lowestPrice
      taxesAndCharges
      frameImage
      interiorImage
      description
      policiesAndRules
      checkInHour
      checkOutHour
      telephone
      email
      website
      address {
        holeAddress
      }
      services {
        id
        name
      }
      activities {
        id
        name
      }
      languages {
        id
        name
      }
      facilities {
        id
        name
      }
      features {
        freeCancelation
        accessible
        familyFriendly
        petFriendly
        smokerFriendly
        ecoFriendly
      }
    }
  }
`;

export const CREATE_ROOM_MODEL = gql`
  mutation creatHotelRoomModel(
    $userId: ID!
    $hotelId: ID!
    $lowestPrice: Float!
    $taxesAndCharges: Float!
    $name: String!
    $mts2: Int!
    $beds: [bedsSpecifications]!
    $smooking: Boolean!
    $freeCancelation: Boolean!
    $category: String!
    $description: String!
    $minimunStay: Int!
    $maximunStay: Int
    $maximunGuests: Int!
    $mainImage: String!
    $services: [String]!
    $amenities: [String]!
  ) {
    creatHotelRoomModel(
      userId: $userId
      hotelId: $hotelId
      lowestPrice: $lowestPrice
      smooking: $smooking
      freeCancelation: $freeCancelation
      taxesAndCharges: $taxesAndCharges
      name: $name
      mts2: $mts2
      beds: $beds
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
export const ADD_ROOMS_TO_MODEL = gql`
  mutation addRoomToModel(
    $userId: ID!
    $hotelId: ID!
    $roomModelId: ID!
    $roomNumbers: [Int!]!
  ) {
    addRoomToModel(
      userId: $userId
      hotelId: $hotelId
      roomModelId: $roomModelId
      roomNumbers: $roomNumbers
    ) {
      roomModelId
      id
      number
    }
  }
`;
export const DELETE_ROOMS_OF_MODEL = gql`
  mutation deleteRoomOfModel(
    $userId: ID!
    $hotelId: ID!
    $roomModelId: ID!
    $roomsIds: [Int!]!
  ) {
    deleteRoomOfModel(
      userId: $userId
      hotelId: $hotelId
      roomModelId: $roomModelId
      roomsIds: $roomsIds
    ) {
      roomModelId
      id
      number
    }
  }
`;
export const MAKE_BOOKING_REQUEST = gql`
  mutation makeBookingRequest(
    $roomModelId: ID!
    $firstName: String!
    $lastName: String!
    $email: String!
    $mobileNumber: String!
    $landlineNumber: String!
    $guestsDistribution: [roomSpecifications!]!
    $checkInDate: String!
    $checkOutDate: String!
    $specifications: String
  ) {
    responce: makeBookingRequest(
      roomModelId: $roomModelId
      firstName: $firstName
      lastName: $lastName
      email: $email
      mobileNumber: $mobileNumber
      landlineNumber: $landlineNumber
      guestsDistribution: $guestsDistribution
      checkInDate: $checkInDate
      checkOutDate: $checkOutDate
      specifications: $specifications
    ) {
      isAvailable
      message
    }
  }
`;

export const CONFIRM_BOOKING_REQUEST = gql`
  mutation confirmBookingRequest(
    $userId: ID!
    $bookingRequestId: ID!
    $totalCost: Float!
    $paymentMethod: String!
    $roomsIds: [Int!]!
  ) {
    responce: confirmBookingRequest(
      userId: $userId
      bookingRequestId: $bookingRequestId
      totalCost: $totalCost
      paymentMethod: $paymentMethod
      roomsIds: $roomsIds
    ) {
      id
    }
  }
`;

export const DECLINE_BOOKING_REQUEST = gql`
  mutation declineBookingRequest($userId: ID!, $bookingRequestId: ID!) {
    bookingRequest: declineBookingRequest(
      userId: $userId
      bookingRequestId: $bookingRequestId
    ) {
      id
    }
  }
`;
