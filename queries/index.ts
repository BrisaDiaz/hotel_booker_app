import { gql } from '@apollo/client';

export const SIGN_IN = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      user
      token
    }
  }
`;
export const SIGN_UP = gql`
  mutation signUp(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    signUp(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      user
    }
  }
`;
export const CREATE_HOTEL = gql`
  mutation createHotel(
    $name: String!
    $brand: String!
    $category: String!
    $telephone: String!
    $email: String!
    $lowestPrice: Float!
    $checkInHour: String!
    $checkOutHour: String!
    $policiesAndRules: String!
    $description: String!
    $frameImage: String!
    $interiorImage: String!
    $activities: [String]
    $facilities: [String]!
    $services: [String]!
    $languages: [String]!
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
    ) {
      id
    }
  }
`;
export const ADD_HOTEL_FEATURES = gql`
  mutation addHotelFeatures(
    $hotelId: ID!
    $accesible: Boolean!
    $cancelationFree: Boolean!
    $familyFriendly: Boolean!
    $petFriendly: Boolean!
    $smokerFriendly: Boolean!
    $ecoFriendly: Boolean!
  ) {
    addHotelFeatures(
      hotelId: $hotelId
      accesible: $accesible
      cancelationFree: $cancelationFree
      familyFriendly: $familyFriendly
      petFriendly: $petFriendly
      smokerFriendly: $smokerFriendly
      ecoFriendly: $ecoFriendly
    )
  }
`;
export const ADD_HOTEL_ADDRESS = gql`
  mutation addHotelAddress(
    $hotelId: ID!
    $holeAddress: String!
    $country: String!
    $postalCode: String!
    $administrativeArea: String!
    $city: String!
    $street: String!
  ) {
    addHotelAddress(
      hotelId: $hotelId
      holeAddress: $holeAddress
      country: $country
      postalCode: $postalCode
      administrativeArea: $administrativeArea
      city: $city
      street: $street
    )
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
export const GET_ALL_AMENETIES = gql`
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

export const MAKE_ROOM_CONSULT = gql`
mutation checkRoomAvailability($roomModelId:ID!,$checkInDate:String!,$checkOutDate:String!,$rooms:[RoomSpecification!]!){
  checkRoomAvailability(
    roomModelId:$roomModelId
checkInDate:$checkInDate
checkOutDate:$checkOutDate
rooms:$rooms
  ){
  isAvailable
  message
  }

}
 extend type RoomSpecification {
  $childrens:!Number
  $adults:!Number
}
// `;
