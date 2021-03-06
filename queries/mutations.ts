import { gql } from '@apollo/client';

export const SIGN_IN = gql`
  mutation signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      token
      user {
        id
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
    $token: String!
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
    $freeCancellation: Boolean!
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
      token: $token
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
      freeCancellation: $freeCancellation
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
    $token: String!
    $hotelId: Int!
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
    $freeCancellation: Boolean
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
      token: $token
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
      freeCancellation: $freeCancellation
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
        freeCancellation
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
    $token: String!
    $hotelId: Int!
    $lowestPrice: Float!
    $cancellationFee: Float
    $taxesAndCharges: Float!
    $name: String!
    $mts2: Int!
    $beds: [bedsSpecifications]!
    $smocking: Boolean!
    $freeCancellation: Boolean!
    $category: String!
    $description: String!
    $minimumStay: Int!
    $maximumStay: Int
    $maximumGuests: Int!
    $mainImage: String!
    $services: [String]!
    $amenities: [String]!
  ) {
    creatHotelRoomModel(
      token: $token
      hotelId: $hotelId
      lowestPrice: $lowestPrice
      taxesAndCharges: $taxesAndCharges
      cancellationFee: $cancellationFee
      smocking: $smocking
      freeCancellation: $freeCancellation

      name: $name
      mts2: $mts2
      beds: $beds
      category: $category
      description: $description
      minimumStay: $minimumStay
      maximumStay: $maximumStay
      maximumGuests: $maximumGuests
      mainImage: $mainImage
      services: $services
      amenities: $amenities
    ) {
      id
    }
  }
`;
export const UPDATE_ROOM_MODEL = gql`
  mutation updateRoomModel(
    $token: String!
    $hotelId: Int!
    $roomModelId: Int!
    $lowestPrice: Float
    $cancellationFee: Float
    $taxesAndCharges: Float
    $name: String
    $mts2: Int
    $beds: [bedsSpecifications]
    $smocking: Boolean
    $freeCancellation: Boolean
    $category: String
    $description: String
    $minimumStay: Int
    $maximumStay: Int
    $maximumGuests: Int
    $mainImage: String
    $services: [String]
    $amenities: [String]
  ) {
    roomModel: updateRoomModel(
      token: $token
      hotelId: $hotelId
      roomModelId: $roomModelId
      lowestPrice: $lowestPrice
      cancellationFee: $cancellationFee
      smocking: $smocking
      freeCancellation: $freeCancellation
      taxesAndCharges: $taxesAndCharges
      name: $name
      mts2: $mts2
      beds: $beds
      category: $category
      description: $description
      minimumStay: $minimumStay
      maximumStay: $maximumStay
      maximumGuests: $maximumGuests
      mainImage: $mainImage
      services: $services
      amenities: $amenities
    ) {
      id
      hotelId
      category
      name
      mts2
      mainImage
      lowestPrice
      taxesAndCharges
      cancellationFee
      maximumGuests
      maximumStay
      minimumStay
      description
      freeCancellation
      smocking
      rooms {
        id
        roomModelId
        number
      }
      amenities {
        id
        name
      }
      services {
        id
        name
      }
      beds {
        id
        type
        quantity
      }
    }
  }
`;
export const ADD_ROOMS_TO_MODEL = gql`
  mutation addRoomToModel(
    $token: String!
    $hotelId: Int!
    $roomModelId: Int!
    $roomNumbers: [Int!]!
  ) {
    addRoomToModel(
      token: $token
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
  mutation deleteRoomsOfModel(
    $token: String!
    $hotelId: Int!
    $roomModelId: Int!
    $roomsIds: [Int!]!
  ) {
    deleteRoomsOfModel(
      token: $token
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
    $roomModelId: Int!
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
    response: makeBookingRequest(
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
    $token: String!
    $bookingRequestId: Int!
    $totalCost: Float!
    $paymentMethod: String!
    $roomsIds: [Int!]!
  ) {
    booking: confirmBookingRequest(
      token: $token
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
  mutation declineBookingRequest($token: String!, $bookingRequestId: Int!) {
    bookingRequest: declineBookingRequest(
      token: $token
      bookingRequestId: $bookingRequestId
    ) {
      id
    }
  }
`;
export const MAKE_BOOKING = gql`
  mutation makeBooking(
    $token: String!
    $roomModelId: Int!
    $firstName: String!
    $lastName: String!
    $email: String!
    $mobileNumber: String!
    $landlineNumber: String!
    $guestsDistribution: [roomSpecifications!]!
    $checkInDate: String!
    $checkOutDate: String!
    $specifications: String
    $totalCost: Float!
    $paymentMethod: String!
    $roomsIds: [Int!]!
  ) {
    booking: makeBooking(
      token: $token
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
      totalCost: $totalCost
      paymentMethod: $paymentMethod
      roomsIds: $roomsIds
    ) {
      id
    }
  }
`;
export const CANCEL_BOOKING = gql`
  mutation cancelBooking(
    $token: String!
    $bookingId: Int!
    $message: String!
    $cancellationFee: Float!
  ) {
    cancellationDetails: cancelBooking(
      token: $token
      bookingId: $bookingId
      message: $message
      cancellationFee: $cancellationFee
    ) {
      bookingId
      createdAt
      message
      cancellationFee
    }
  }
`;
export const CREATE_ALBUM = gql`
  mutation createAlbum(
    $token: String!
    $hotelId: Int!
    $roomModelId: Int
    $name: String!
    $images: [String]
  ) {
    album: createAlbum(
      token: $token
      hotelId: $hotelId
      roomModelId: $roomModelId
      name: $name

      images: $images
    ) {
      id
      name
    }
  }
`;
export const EDIT_ALBUM = gql`
  mutation updateAlbum($token: String!, $albumId: Int!, $images: [String]) {
    album: updateAlbum(token: $token, albumId: $albumId, images: $images) {
      id
      name
      images {
        id
        src
      }
    }
  }
`;
export const RENAME_ALBUM = gql`
  mutation updateAlbum($token: String!, $albumId: Int!, $name: String) {
    album: updateAlbum(token: $token, albumId: $albumId, name: $name) {
      id
      name
    }
  }
`;
export const DELETE_ALBUM = gql`
  mutation deleteAlbum($token: String!, $albumId: Int!) {
    album: deleteAlbum(token: $token, albumId: $albumId) {
      id
      name
    }
  }
`;
