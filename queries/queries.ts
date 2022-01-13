import { gql } from '@apollo/client';
export const GET_ALL_SERVICES = gql`
  query servicesList {
    servicesList {
      id
      name
      hotelsCount
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
      hotelsCount
    }
  }
`;

export const GET_ALL_ACTIVITIES = gql`
  query activitiesList {
    activitiesList {
      id
      name
      hotelsCount
    }
  }
`;
export const GET_ALL_LANGUAGES = gql`
  query languagesList {
    languagesList {
      id
      name
      hotelsCount
    }
  }
`;
export const GET_ALL_BEDS = gql`
  query bedTypesList {
    bedTypesList {
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
      hotelsCount
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
  query hotelSearch(
    $search: String
    $sort: String
    $take: Int
    $skip: Int
    $categories: [String]
    $facilities: [String]
    $activities: [String]
    $services: [String]
    $languages: [String]
    $features: [String]
  ) {
    hotelSearch(
      search: $search
      sort: $sort
      take: $take
      skip: $skip
      services: $services
      categories: $categories
      facilities: $facilities
      activities: $activities
      features: $features
      languages: $languages
    ) {
      hotels {
        id
        name
        lowestPrice
        taxesAndCharges
        frameImage
        interiorImage
        description
        address {
          id
          holeAddress
        }
      }
      totalResults
      pageCount
    }
  }
`;

export const GET_HOTEL_BY_ID = gql`
  query hotelById($hotelId: ID!) {
    hotelById(hotelId: $hotelId) {
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
        country
        postalCode
        city
        administrativeArea
        street
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
      imagesCount
      miniatures{
      id
    src
      }
      roomModels {
        id
        name
        mts2
        lowestPrice
        taxesAndCharges
        cancelationFee
        mainImage
        beds {
          id
          type
          quantity
        }
      }
    }
  }
`;
export const GET_ROOM_MODEL_BY_ID = gql`
  query roomModelById($roomModelId: ID!) {
    roomModel: roomModelById(roomModelId: $roomModelId) {
      id
      hotelId
      hotel {
        name
        checkInHour
        checkOutHour
      }
      category
      name
      mts2
      mainImage
          imagesCount
      miniatures{
      id
    src
      }
      lowestPrice
      taxesAndCharges
      cancelationFee
      maximunGuests
      maximunStay
      minimunStay
      description
      freeCancelation
      smooking
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
export const GET_ADMIN_HOTELS = gql`
  query adminHotels($userId: ID!) {
    adminHotels(userId: $userId) {
      hotels {
        id
        name
        frameImage
        lowestPrice
        taxesAndCharges
        address {
          holeAddress
        }
      }
      hotelsCount
    }
  }
`;
export const GET_DASHBOARD_HOTEL_DATA = gql`
  query hotelData($userId: ID!, $hotelId: ID!) {
    hotelData(userId: $userId, hotelId: $hotelId) {
      roomModels {
        id
        name
        mainImage
        lowestPrice
        cancelationFee
        taxesAndCharges
        maximunGuests
        beds {
          id
          type
          quantity
        }
        rooms {
          id
          roomModelId
          number
        }
      }
      roomModelsCount
      requestsCount
      guestsCount
      bookingsCount
    }
  }
`;
export const GET_HOTEL_BOOKING_REQUESTS = gql`
  query hotelRequests(
    $userId: ID!
    $hotelId: ID!
    $take: Int
    $skip: Int
    $search: searchFilter
  ) {
    results: hotelRequests(
      userId: $userId
      hotelId: $hotelId
      take: $take
      skip: $skip
      search: $search
    ) {
      requests {
        id
        checkInDate
        checkOutDate
        specifications
        createdAt
        nights
        availableRooms {
          id
          number
        }
        client {
          id
          firstName
          lastName
          mobileNumber
          landlineNumber
          email
        }
        guestsDistribution {
          children
          adults
        }
        roomModel {
          id
          name
          lowestPrice
          taxesAndCharges
          cancelationFee
        }
      }
      totalResults
      pageCount
    }
  }
`;

export const GET_HOTEL_GUESTS = gql`
  query hotelGuests(
    $hotelId: ID!
    $userId: ID!
    $skip: Int
    $take: Int
    $search: searchFilter
  ) {
    results: hotelGuests(
      hotelId: $hotelId
      userId: $userId
      skip: $skip
      take: $take
      search: $search
    ) {
      guests {
        id
        firstName
        lastName
        mobileNumber
        landlineNumber
        email
        bookings {
          roomModel {
            name
          }
          reservedRooms {
            number
          }
        }
      }
      totalResults
    }
  }
`;
export const GET_USER_SESSION = gql`
  query authentication {
    authentication {
      id
      firstName
      lastName
      email
      role
    }
  }
`;
export const MAKE_ROOM_CONSULT = gql`
  query checkRoomAvailability(
    $roomModelId: ID!
    $checkInDate: String!
    $checkOutDate: String!
    $rooms: [roomSpecifications!]!
  ) {
    responce: checkRoomAvailability(
      roomModelId: $roomModelId
      checkInDate: $checkInDate
      checkOutDate: $checkOutDate
      rooms: $rooms
    ) {
      isAvailable
      message
    }
  }
`;

export const GET_HOTEL_BOOKINGS = gql`
  query hotelBookings(
    $hotelId: ID!
    $userId: ID!
    $status: String
    $from: String
    $until: String
  ) {
    bookings: hotelBookings(
      hotelId: $hotelId
      userId: $userId
      status: $status
      from: $from
      until: $until
    ) {
      id
      status
      checkInDate
      checkOutDate
      roomModel {
        id
      }
      reservedRooms {
        number
      }
    }
  }
`;
export const GET_HOTEL_ROOM_MODELS_LIST = gql`
  query hotelById($hotelId: ID!) {
    hotel: hotelById(hotelId: $hotelId) {
      id
      roomModels {
        id
        name
      }
    }
  }
`;

export const GET_BOOKING_BY_ID = gql`
  query bookingById($bookingId: ID!, $userId: ID!) {
    booking: bookingById(bookingId: $bookingId, userId: $userId) {
      id
      clientId
      specifications
      totalCost
      paymentMethod
      checkInDate
      checkOutDate
      status
      guestsDistribution {
        id
        adults
        children
      }
      roomModel {
        name
        cancelationFee
      }
      reservedRooms {
        number
      }
    }
  }
`;
export const GET_ROOM_MODEL_AVAILABLE_ROOMS = gql`
  query getRoomModelAvailableRooms(
    $roomModelId: ID!
    $checkInDate: String!
    $checkOutDate: String!
    $rooms: [roomSpecifications!]!
  ) {
    rooms: getRoomModelAvailableRooms(
      roomModelId: $roomModelId
      checkInDate: $checkInDate
      checkOutDate: $checkOutDate
      rooms: $rooms
    ) {
      id
      number
    }
  }
`;
export const GET_BOOKING_CANCELATION_DETAILS = gql`
  query getBookingCancelationDetails($bookingId: ID!) {
    cancelationDetails: getBookingCancelationDetails(bookingId: $bookingId) {
      bookingId
      createdAt
      message
      cancelationFee
    }
  }
`;
export const GET_HOTEL_ALBUMS = gql`
  query hotelAlbums($hotelId: ID!) {
    albums: hotelAlbums(hotelId: $hotelId) {
   id
   name
   roomModelId
    }
  }
`;
export const GET_ALBUM_IMAGES = gql`
  query albumImages($albumId: ID!) {
    images: albumImages(albumId: $albumId) {
   id
  src
    }
  }
`;
export const GET_HOTEL_IMAGES = gql`
  query hotelImages($hotelId: ID!) {
    images: hotelImages(hotelId: $hotelId) {
   id
  src
    }
  }
`;
export const GET_ROOM_MODEL_IMAGES = gql`
  query roomModelImages($roomModelId: ID!) {
    images: roomModelImages(roomModelId: $roomModelId) {
   id
  src
    }
  }
`;