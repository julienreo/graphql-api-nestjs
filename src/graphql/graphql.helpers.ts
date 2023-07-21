import { GraphQLError, GraphQLFormattedError } from 'graphql';

/**
 * Format a GraphQL default error
 *
 * @param error
 */
export const formatGraphQLError = (error: GraphQLError) => {
  const graphQLFormattedError: GraphQLFormattedError = {
    message: error.message,
  };
  return graphQLFormattedError;
};
