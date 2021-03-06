import { gql } from '@apollo/client';

export const SIGN_OUT = gql`
  query signout {
    signout {
      success
      message
    }
  }
`;
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
export const GET_ALL_FEATURES = gql`
  query featuresList {
    featuresList {
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
export const GET_HOTEL_SEARCH_SUGGESTIONS = gql`
  query hotelSearchSuggestions($take: Int, $search: String!) {
    suggestions: hotelSearchSuggestions(take: $take, search: $search) {
      id
      name
      address
    }
  }
`;
export const GET_HOTEL_BY_ID = gql`
  query hotelById($hotelId: Int!) {
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
        freeCancellation
        accessible
        familyFriendly
        petFriendly
        smokerFriendly
        ecoFriendly
      }
      imagesCount
      miniatures {
        id
        src
      }
      roomModels {
        id
        name
        mts2
        lowestPrice
        taxesAndCharges
        cancellationFee
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
  query roomModelById($roomModelId: Int!) {
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
      miniatures {
        id
        src
      }
      lowestPrice
      taxesAndCharges
      cancellationFee
      maximumGuests
      maximumStay
      minimumStay
      description
      freeCancellation
      smocking
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
  query adminHotels($token: String!) {
    adminHotels(token: $token) {
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
  query hotelData($token: String!, $hotelId: Int!) {
    hotelData(token: $token, hotelId: $hotelId) {
      roomModels {
        id
        name
        mainImage
        lowestPrice
        cancellationFee
        taxesAndCharges
        maximumGuests
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
    $token: String!
    $hotelId: Int!
    $take: Int
    $skip: Int
    $search: searchFilter
  ) {
    results: hotelRequests(
      token: $token
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
          cancellationFee
        }
      }
      totalResults
      pageCount
    }
  }
`;

export const GET_HOTEL_GUESTS = gql`
  query hotelGuests(
    $hotelId: Int!
    $token: String!
    $skip: Int
    $take: Int
    $search: searchFilter
  ) {
    results: hotelGuests(
      hotelId: $hotelId
      token: $token
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
      user {
        id
        firstName
        lastName
        email
        role
      }
      token
    }
  }
`;
export const MAKE_ROOM_CONSULT = gql`
  query checkRoomAvailability(
    $roomModelId: Int!
    $checkInDate: String!
    $checkOutDate: String!
    $rooms: [roomSpecifications!]!
  ) {
    Response: checkRoomAvailability(
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
    $hotelId: Int!
    $token: String!
    $status: String
    $from: String
    $until: String
  ) {
    bookings: hotelBookings(
      hotelId: $hotelId
      token: $token
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
  query hotelById($hotelId: Int!) {
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
  query bookingById($bookingId: Int!, $token: String!) {
    booking: bookingById(bookingId: $bookingId, token: $token) {
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
        id
        cancellationFee
      }
      reservedRooms {
        number
      }
    }
  }
`;
export const GET_ROOM_MODEL_AVAILABLE_ROOMS = gql`
  query getRoomModelAvailableRooms(
    $roomModelId: Int!
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
export const GET_BOOKING_CANCELLATION_DETAILS = gql`
  query getBookingCancellationDetails($bookingId: Int!, $token: String!) {
    cancellationDetails: getBookingCancellationDetails(
      bookingId: $bookingId
      token: $token
    ) {
      bookingId
      createdAt
      message
      cancellationFee
    }
  }
`;
export const GET_HOTEL_ALBUMS = gql`
  query hotelAlbums($hotelId: Int!) {
    albums: hotelAlbums(hotelId: $hotelId) {
      id
      name
      roomModelId
    }
  }
`;
export const GET_ALBUM_IMAGES = gql`
  query albumImages($albumId: Int!) {
    images: albumImages(albumId: $albumId) {
      id
      src
    }
  }
`;
export const GET_HOTEL_IMAGES = gql`
  query hotelImages($hotelId: Int!) {
    images: hotelImages(hotelId: $hotelId) {
      id
      src
    }
  }
`;
export const GET_ROOM_MODEL_IMAGES = gql`
  query roomModelImages($roomModelId: Int!) {
    images: roomModelImages(roomModelId: $roomModelId) {
      id
      src
    }
  }
`;
