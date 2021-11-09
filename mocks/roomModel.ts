const roomModel = {
  id: 4,
  category: 'double room',
  mainImage:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Hotel-room-renaissance-columbus-ohio.jpg/1024px-Hotel-room-renaissance-columbus-ohio.jpg',
  mts2: 25,
  lowestPrice: 584.5,
  beds: [
    { type: 'full', quantity: 1, id: 1 },
    { type: 'twin', quantity: 2, id: 2 },
  ],
  hotelId: 5,
  description:
    'There are many variations of passages of Lorem Ipsum available,combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc,combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc,combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc./combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc/combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc',
  amenities: new Array(12).fill(0).map((el, index) => ({
    name: 'sewing kit',
    id: index + 1,
  })),
  services: new Array(5).fill(0).map((el, index) => ({
    name: 'cooking service',
    id: index + 1,
  })),
  maximunGuests: 4,
  minimunStays: 3,
  maximunStays: 15,
  hotel: {
    id: 5,
    name: 'Four Seasons Hotel Buenos Aires',
  },
  public: true,
};
export default roomModel;
