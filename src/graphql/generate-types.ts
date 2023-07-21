import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();

/**
 * Generate TypeScript definitions from GraphQL SDL schema definitions
 */
definitionsFactory.generate({
  typePaths: ['./**/*.graphql'],
  path: join(process.cwd(), 'src/graphql/graphql-types.ts'),
  outputAs: 'class',
  watch: true,
  skipResolverArgs: true,
});
