import { makeSchema } from 'nexus';
import path from 'path';

import * as types from './types';
export const schema = makeSchema({
  types,
  shouldGenerateArtifacts: process.env.NODE_ENV === 'development',
  outputs: {
    // I tend to use `.gen` to denote "auto-generated" files, but this is not a requirement.
    schema: path.join(process.cwd(), 'graphql/schema.gen.graphql'),
    typegen: path.join(process.cwd(), 'graphql/nexusTypes.gen.ts'),
  },
});
