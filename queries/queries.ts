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
    $features: [String]
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
      features: $features
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
