import room from './room';
const hotel = {
  id: 5,
  name: 'Four Seasons Hotel Buenos Aires',
  category: 'recidential hotel',
  address: {
    holeAddress:
      'Posadas 1086/88, Buenos Aires, C1011 ABB, Capital Federal, Argentina',
    country: 'Argentina',
    city: 'Buenos Aires',
    postalCode: 'C1011',
    administrativeArea: 'CABA',
    street1: 'Posadas 1086/88',
  },
  lowestPrice: 546.9,
  telephone: '+54 11 4321-1200',
  email: 'catering.bue@fourseasons.com',
  checkInHour: '15:00',
  checkOutHour: '12:00',
  policiesAndRules:
    'A surcharge may apply for each additional person, depending on the accommodation policy.Upon arrival, they may ask you for an official photo ID and a credit card to cover unforeseen expenses.Special requests are not guaranteed and are subject to availability upon arrival and may incur an additional charge.The name on the credit card used upon arrival to pay additional charges must match the primary name on the room reservation.This accommodation accepts Visa, Mastercard, American Express, Diners Club, debit cards and cash.The security features of this accommodation include the following: fire extinguisher, smoke detector and security system.Cultural norms and guest policies may vary by country and property, which dictates the policies shown here.Only registered hotel guests are allowed access to the rooms.Some facilities may have limited access. Guests are invited to contact the accommodation using the information on the booking confirmation.This accommodation does not accept pets or guide dogs.',
  frameImage:
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/22113570.jpg?k=50944ce5e79a439a84781c80e40564ad174a0eb0955bcc5b5033469b4f44bfa7&o=&hp=1',
  interiorImage:
    'https://m.fourseasons.com/alt/img-opt/~70.1530.86,0211-408,3788-2829,5489-1591,6212/publish/content/dam/fourseasons/images/web/BUE/BUE_138_original.jpg',
  description:
    'Four Seasons Hotel Buenos Aires offers 165 air-conditioned accommodations with DVD players and minibars. All accommodations have different decorations. Beds are dressed in Egyptian cotton sheets and high quality linens. It should be noted that this accommodation allows its clients to choose the type of pillow. A 37-inch LCD television with premium digital channels is provided. Bathrooms include separate bathtubs and showers with deep soaking tubs, bathrobes, slippers and designer toiletries.',
  services: new Array(10).fill(0).map((el, index) => ({
    id: index + 1,
    name: 'room service',
  })),
  facilities: new Array(5).fill(0).map((el, index) => ({
    id: index + 1,
    name: 'restaurant',
  })),
  languages: new Array(3).fill(0).map((el, index) => ({
    id: index + 1,
    name: 'english',
  })),
  activities: new Array(6).fill(0).map((el, index) => ({
    id: index + 1,
    name: 'fishing',
  })),
  features: {
    cancelationFree: true,
    accessible: true,
    familyFriendly: true,
    petFriendly: false,
    smokerFriendly: false,
    ecoFriendly: false,
  },
  rooms: new Array(6).fill(0).map((el, index) => {
    room.id = index + 1;
    return room;
  }),
  public: true,
};

export default hotel;
