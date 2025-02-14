import {
  ApolloClient,
  ApolloLink,
  DefaultOptions,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { MaybePromise } from 'lib';
import { useCallback, useMemo } from 'react';
import { CONFIG } from '~/util/config';
import { useAuthFlowLink } from './apiAuthFlowLink';
import { getPersistedCache } from './cache';

export type ClientCreator = () => MaybePromise<
  ApolloClient<NormalizedCacheObject>
>;

// https://www.apollographql.com/docs/react/data/queries/#supported-fetch-policies
const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  },
};

export const API_CLIENT_NAME = 'api';
export const useCreateApiClient = (): ClientCreator => {
  const authFlowLink = useAuthFlowLink();

  const cache: Promise<InMemoryCache> = useMemo(
    () => getPersistedCache(API_CLIENT_NAME),
    [],
  );

  return useCallback(
    async () =>
      new ApolloClient({
        name: API_CLIENT_NAME,
        cache: await cache,
        link: ApolloLink.from([
          new RetryLink(),
          authFlowLink,
          new HttpLink({
            uri: `${CONFIG.apiUrl}/graphql`,
            credentials: 'include',
          }),
        ]),
        defaultOptions,
      }),
    [authFlowLink, cache],
  );
};

export const SUBGRAPH_CLIENT_NAME = 'subgraph';
export const createSubgraphClient: ClientCreator = async () =>
  new ApolloClient({
    name: SUBGRAPH_CLIENT_NAME,
    cache: await getPersistedCache(SUBGRAPH_CLIENT_NAME),
    link: ApolloLink.from([
      new RetryLink(),
      new HttpLink({ uri: CONFIG.subgraphGqlUrl }),
    ]),
    defaultOptions,
  });

export const UNISWAP_CLIENT_NAME = 'uniswap';
export const createUniswapClient: ClientCreator = async () =>
  new ApolloClient({
    name: UNISWAP_CLIENT_NAME,
    cache: await getPersistedCache(UNISWAP_CLIENT_NAME),
    link: ApolloLink.from([
      new RetryLink(),
      new HttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-subgraph',
      }),
    ]),
    defaultOptions,
  });
