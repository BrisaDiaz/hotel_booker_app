import { objectType, extendType, queryField, list } from 'nexus';

export const TestArray = objectType({
  name: 'TestArray',
  definition(t) {
    t.id('id');
    t.string('message');
  },
});

export const Mutation = extendType({
  type: 'Query',
  definition(t) {
    t.field('getMessages', {
      type: list('TestArray'),

      resolve() {
        return [
          { id: 1, message: 'message number 1' },
          { id: 2, message: 'message number 2' },
        ];
      },
    });
  },
});
export const usersQueryField = queryField('getMoreMessages', {
  type: list('TestArray'),
  resolve() {
    return [
      { id: 3, message: 'message number 3' },
      { id: 4, message: 'message number 4' },
    ];
  },
});
