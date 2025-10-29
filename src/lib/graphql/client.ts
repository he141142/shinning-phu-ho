import { request, gql as gqlTag } from 'graphql-request';
import { HOST } from '@/static/env';

// GraphQL endpoint
export const GRAPHQL_ENDPOINT = `${HOST}/query`;

// Re-export gql for convenience
export { gqlTag as gql };

/**
 * Generic GraphQL query function
 * @param query - GraphQL query string (use gql tag)
 * @param variables - Query variables
 * @returns Promise with the response data
 */
export async function graphqlRequest<TData = any, TVariables = Record<string, any>>(
  query: string,
  variables?: TVariables,
): Promise<TData> {
  try {
    const data = await request<TData>(GRAPHQL_ENDPOINT, query, variables as any);
    return data;
  } catch (error: any) {
    // Handle GraphQL errors
    if (error?.response?.errors) {
      const graphqlError = error.response.errors[0];
      throw new Error(graphqlError.message || 'GraphQL request failed');
    }

    // Handle network errors
    if (error?.message) {
      throw new Error(error.message);
    }

    throw new Error('An unknown error occurred');
  }
}

/**
 * GraphQL query function (alias for better semantics)
 */
export const graphqlQuery = graphqlRequest;

/**
 * GraphQL mutation function (alias for better semantics)
 */
export const graphqlMutation = graphqlRequest;
