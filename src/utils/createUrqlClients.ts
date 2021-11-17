import { dedupExchange, fetchExchange } from "@urql/core";
import {
  cacheExchange,
  NullArray,
  query,
  Resolver,
  Variables,
} from "@urql/exchange-graphcache";
import { NextUrqlClientConfig } from "next-urql";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { filter, pipe, tap } from "wonka";
import { Exchange, stringifyVariables } from "urql";
import Router, { useRouter } from "next/dist/client/router";

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        // console.log("ERROR HANDLER :: ", error);
        if (error) {
          if (error.message.includes("Not Authenticated")) {
            Router.replace("/login");
          }
        }
      })
    );
  };

export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    // console.log("E: ", entityKey, "\tP: ", fieldName);
    const allFields = cache.inspectFields(entityKey);
    // console.log("allfields : ", allFields);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    // console.log("fieldInfos : ", fieldInfos, "\nsize : ", size);
    if (size === 0) {
      return undefined;
    }

    // console.log("fieldArgs: ", fieldArgs);

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isItInTheCache;

    // console.log(
    //   "FIELDKEY :: ",
    //   fieldKey,
    //   "  -- isItInTheCache : ",
    //   isItInTheCache
    // );

    const results: string[] = [];
    let hasMore: boolean = true;

    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore") as boolean;
      if (!_hasMore) {
        hasMore = _hasMore;
      }

      results.push(...data);
      // console.log(
      //   "FIELDKEY : ",
      //   fi.fieldKey,
      //   "\n DATA :: ",
      //   data,
      // );
    });

    // console.log("results:; ", results);

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
};

export const createUrqlClient: NextUrqlClientConfig = (ssrExchange: any) => ({
  url: "http://localhost:3000/graphql",
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPosts: () => null,
      },
      resolvers: {
        Query: { posts: cursorPagination() },
      },
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
  fetchOptions: {
    credentials: "include",
  },
});
