import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Menu = {
  __typename?: 'Menu';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
};

export type MenuInput = {
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createOrder: Scalars['Int']['output'];
};


export type MutationCreateOrderArgs = {
  input: OrderInput;
};

export type Order = {
  __typename?: 'Order';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  items: Array<OrderItem>;
  ticketNumber: Scalars['Int']['output'];
  totalAmount: Scalars['Float']['output'];
};

export type OrderInput = {
  createdAt: Scalars['DateTime']['input'];
  items: Array<OrderItemInput>;
  ticketNumber: Scalars['Int']['input'];
  totalAmount: Scalars['Float']['input'];
};

export type OrderItem = {
  __typename?: 'OrderItem';
  menu: Menu;
  price: Scalars['Float']['output'];
  quantity: Scalars['Int']['output'];
};

export type OrderItemInput = {
  menu: MenuInput;
  price: Scalars['Float']['input'];
  quantity: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  menus: Array<Menu>;
};

export type GetMenusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMenusQuery = { __typename?: 'Query', menus: Array<{ __typename?: 'Menu', id: number, name: string, price: number }> };

export type CreateOrderMutationVariables = Exact<{
  input: OrderInput;
}>;


export type CreateOrderMutation = { __typename?: 'Mutation', createOrder: number };


export const GetMenusDocument = gql`
    query GetMenus {
  menus {
    id
    name
    price
  }
}
    `;

/**
 * __useGetMenusQuery__
 *
 * To run a query within a React component, call `useGetMenusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMenusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMenusQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMenusQuery(baseOptions?: Apollo.QueryHookOptions<GetMenusQuery, GetMenusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMenusQuery, GetMenusQueryVariables>(GetMenusDocument, options);
      }
export function useGetMenusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMenusQuery, GetMenusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMenusQuery, GetMenusQueryVariables>(GetMenusDocument, options);
        }
export function useGetMenusSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMenusQuery, GetMenusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMenusQuery, GetMenusQueryVariables>(GetMenusDocument, options);
        }
export type GetMenusQueryHookResult = ReturnType<typeof useGetMenusQuery>;
export type GetMenusLazyQueryHookResult = ReturnType<typeof useGetMenusLazyQuery>;
export type GetMenusSuspenseQueryHookResult = ReturnType<typeof useGetMenusSuspenseQuery>;
export type GetMenusQueryResult = Apollo.QueryResult<GetMenusQuery, GetMenusQueryVariables>;
export const CreateOrderDocument = gql`
    mutation CreateOrder($input: OrderInput!) {
  createOrder(input: $input)
}
    `;
export type CreateOrderMutationFn = Apollo.MutationFunction<CreateOrderMutation, CreateOrderMutationVariables>;

/**
 * __useCreateOrderMutation__
 *
 * To run a mutation, you first call `useCreateOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrderMutation, { data, loading, error }] = useCreateOrderMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOrderMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrderMutation, CreateOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrderMutation, CreateOrderMutationVariables>(CreateOrderDocument, options);
      }
export type CreateOrderMutationHookResult = ReturnType<typeof useCreateOrderMutation>;
export type CreateOrderMutationResult = Apollo.MutationResult<CreateOrderMutation>;
export type CreateOrderMutationOptions = Apollo.BaseMutationOptions<CreateOrderMutation, CreateOrderMutationVariables>;