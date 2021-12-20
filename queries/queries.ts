import { gql } from '@apollo/client';
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
      roomModels {
        id
        name
        mts2
        lowestPrice
        taxesAndCharges
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
    roomModelById(roomModelId: $roomModelId) {
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
      lowestPrice
      taxesAndCharges
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
      firstName
      lastName
      email
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
