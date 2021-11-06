import { objectType } from 'nexus';

export const Service = objectType({
  name: 'Service',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

export const Facility = objectType({
  name: 'Facility',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
  },
});
export const Features = objectType({
  name: 'Features',
  definition(t) {
    t.boolean('cancelationFree');
    t.boolean('accesible');
    t.boolean('familyFriendly');
    t.boolean('petFriendly');
    t.boolean('smokerFriendly');
    t.boolean('ecoFriendly');
  },
});
export const Image = objectType({
  name: 'Image',
  definition(t) {
    t.id('id');
    t.string('title');
    t.string('src');
    t.int('hotelId');
    t.int('roomId');
  },
});
