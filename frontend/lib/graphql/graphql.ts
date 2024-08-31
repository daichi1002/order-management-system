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

export type DailyClosingInput = {
  closingDate: Scalars['DateTime']['input'];
  totalOrders: Scalars['Int']['input'];
  totalSales: Scalars['Float']['input'];
};

export type Menu = {
  __typename?: 'Menu';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
};

export type MenuInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelOrder: Scalars['Boolean']['output'];
  createDailyClosing: Scalars['Boolean']['output'];
  createOrder: Scalars['ID']['output'];
};


export type MutationCancelOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateDailyClosingArgs = {
  input?: InputMaybe<DailyClosingInput>;
};


export type MutationCreateOrderArgs = {
  input: OrderInput;
};

export type Order = {
  __typename?: 'Order';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
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
  name: Scalars['String']['output'];
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
  getMenus: Array<Menu>;
  getOrders: Array<Order>;
  isSalesConfirmed: Scalars['Boolean']['output'];
};


export type QueryIsSalesConfirmedArgs = {
  date: Scalars['DateTime']['input'];
};

export type CreateDailyClosingMutationVariables = Exact<{
  input: DailyClosingInput;
}>;


export type CreateDailyClosingMutation = { __typename?: 'Mutation', createDailyClosing: boolean };

export type IsSalesConfirmedQueryVariables = Exact<{
  date: Scalars['DateTime']['input'];
}>;


export type IsSalesConfirmedQuery = { __typename?: 'Query', isSalesConfirmed: boolean };

export type GetMenusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMenusQuery = { __typename?: 'Query', getMenus: Array<{ __typename?: 'Menu', id: string, name: string, price: number }> };

export type CreateOrderMutationVariables = Exact<{
  input: OrderInput;
}>;


export type CreateOrderMutation = { __typename?: 'Mutation', createOrder: string };

export type CancelOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CancelOrderMutation = { __typename?: 'Mutation', cancelOrder: boolean };

export type GetOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrdersQuery = { __typename?: 'Query', getOrders: Array<{ __typename?: 'Order', id: string, totalAmount: number, ticketNumber: number, createdAt: any, items: Array<{ __typename?: 'OrderItem', name: string, quantity: number, price: number }> }> };


export const CreateDailyClosingDocument = gql`
    mutation CreateDailyClosing($input: DailyClosingInput!) {
  createDailyClosing(input: $input)
}
    `;
export type CreateDailyClosingMutationFn = Apollo.MutationFunction<CreateDailyClosingMutation, CreateDailyClosingMutationVariables>;

/**
 * __useCreateDailyClosingMutation__
 *
 * To run a mutation, you first call `useCreateDailyClosingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDailyClosingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDailyClosingMutation, { data, loading, error }] = useCreateDailyClosingMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDailyClosingMutation(baseOptions?: Apollo.MutationHookOptions<CreateDailyClosingMutation, CreateDailyClosingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDailyClosingMutation, CreateDailyClosingMutationVariables>(CreateDailyClosingDocument, options);
      }
export type CreateDailyClosingMutationHookResult = ReturnType<typeof useCreateDailyClosingMutation>;
export type CreateDailyClosingMutationResult = Apollo.MutationResult<CreateDailyClosingMutation>;
export type CreateDailyClosingMutationOptions = Apollo.BaseMutationOptions<CreateDailyClosingMutation, CreateDailyClosingMutationVariables>;
export const IsSalesConfirmedDocument = gql`
    query IsSalesConfirmed($date: DateTime!) {
  isSalesConfirmed(date: $date)
}
    `;

/**
 * __useIsSalesConfirmedQuery__
 *
 * To run a query within a React component, call `useIsSalesConfirmedQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsSalesConfirmedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsSalesConfirmedQuery({
 *   variables: {
 *      date: // value for 'date'
 *   },
 * });
 */
export function useIsSalesConfirmedQuery(baseOptions: Apollo.QueryHookOptions<IsSalesConfirmedQuery, IsSalesConfirmedQueryVariables> & ({ variables: IsSalesConfirmedQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsSalesConfirmedQuery, IsSalesConfirmedQueryVariables>(IsSalesConfirmedDocument, options);
      }
export function useIsSalesConfirmedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsSalesConfirmedQuery, IsSalesConfirmedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsSalesConfirmedQuery, IsSalesConfirmedQueryVariables>(IsSalesConfirmedDocument, options);
        }
export function useIsSalesConfirmedSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<IsSalesConfirmedQuery, IsSalesConfirmedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<IsSalesConfirmedQuery, IsSalesConfirmedQueryVariables>(IsSalesConfirmedDocument, options);
        }
export type IsSalesConfirmedQueryHookResult = ReturnType<typeof useIsSalesConfirmedQuery>;
export type IsSalesConfirmedLazyQueryHookResult = ReturnType<typeof useIsSalesConfirmedLazyQuery>;
export type IsSalesConfirmedSuspenseQueryHookResult = ReturnType<typeof useIsSalesConfirmedSuspenseQuery>;
export type IsSalesConfirmedQueryResult = Apollo.QueryResult<IsSalesConfirmedQuery, IsSalesConfirmedQueryVariables>;
export const GetMenusDocument = gql`
    query GetMenus {
  getMenus {
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
export const CancelOrderDocument = gql`
    mutation CancelOrder($id: ID!) {
  cancelOrder(id: $id)
}
    `;
export type CancelOrderMutationFn = Apollo.MutationFunction<CancelOrderMutation, CancelOrderMutationVariables>;

/**
 * __useCancelOrderMutation__
 *
 * To run a mutation, you first call `useCancelOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelOrderMutation, { data, loading, error }] = useCancelOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCancelOrderMutation(baseOptions?: Apollo.MutationHookOptions<CancelOrderMutation, CancelOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelOrderMutation, CancelOrderMutationVariables>(CancelOrderDocument, options);
      }
export type CancelOrderMutationHookResult = ReturnType<typeof useCancelOrderMutation>;
export type CancelOrderMutationResult = Apollo.MutationResult<CancelOrderMutation>;
export type CancelOrderMutationOptions = Apollo.BaseMutationOptions<CancelOrderMutation, CancelOrderMutationVariables>;
export const GetOrdersDocument = gql`
    query GetOrders {
  getOrders {
    id
    items {
      name
      quantity
      price
    }
    totalAmount
    ticketNumber
    createdAt
  }
}
    `;

/**
 * __useGetOrdersQuery__
 *
 * To run a query within a React component, call `useGetOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrdersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetOrdersQuery(baseOptions?: Apollo.QueryHookOptions<GetOrdersQuery, GetOrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrdersQuery, GetOrdersQueryVariables>(GetOrdersDocument, options);
      }
export function useGetOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrdersQuery, GetOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrdersQuery, GetOrdersQueryVariables>(GetOrdersDocument, options);
        }
export function useGetOrdersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetOrdersQuery, GetOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOrdersQuery, GetOrdersQueryVariables>(GetOrdersDocument, options);
        }
export type GetOrdersQueryHookResult = ReturnType<typeof useGetOrdersQuery>;
export type GetOrdersLazyQueryHookResult = ReturnType<typeof useGetOrdersLazyQuery>;
export type GetOrdersSuspenseQueryHookResult = ReturnType<typeof useGetOrdersSuspenseQuery>;
export type GetOrdersQueryResult = Apollo.QueryResult<GetOrdersQuery, GetOrdersQueryVariables>;