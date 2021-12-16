import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import {
  PostsQuery,
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClients";
import NextLink from "next/link";
import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/layout";
import React, { useState } from "react";
import { Button } from "@chakra-ui/button";

import { UpdootSection } from "../components/UpdootSection";
import { EditDeletepostButtons } from "../components/EditDeletePostButtons";

const Index = () => {
  const { data: meData } = useMeQuery();
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null as null | string,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return (
      <Flex align={"center"} bg="tomato" direction={"column"} color={"white"}>
        <Box w="100%" color="white" p={4} fontSize={40}>
          Error
        </Box>
        <Box>{error?.message}</Box>
      </Flex>
    );
  }

  return (
    <>
      <Layout>
        {!data && loading ? (
          <div>Loading ...</div>
        ) : (
          <Stack spacing={8}>
            {data!.posts.posts.map((p) =>
              !p ? null : (
                <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                  <UpdootSection post={p} />
                  <Box flex={1}>
                    <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                      <Link>
                        <Heading fontSize="xl" mr={2}>
                          {p.title}
                        </Heading>
                      </Link>
                    </NextLink>
                    <Text color="teal">posted by {p.creator.username}</Text>
                    <Flex align="center" mt={2}>
                      <Text flex={1}>{p.textSnippet}</Text>

                      <Box ml="auto">
                        <EditDeletepostButtons
                          id={p.id}
                          creatorId={p.creatorId}
                        />
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              )
            )}
          </Stack>
        )}

        {data && data.posts.hasMore ? (
          <Flex>
            <Button
              isLoading={loading}
              colorScheme="teal"
              size="md"
              m={"auto"}
              my={8}
              onClick={() => {
                fetchMore({
                  variables: {
                    limit: variables?.limit,
                    cursor:
                      data.posts.posts[data.posts.posts.length - 1].createdAt,
                  },
                  // updateQuery: (
                  //   previousValue,
                  //   { fetchMoreResult }
                  // ): PostsQuery => {
                  //   if (!fetchMoreResult) {
                  //     return previousValue as PostsQuery;
                  //   }

                  //   return {
                  //     __typename: "Query",
                  //     posts: {
                  //       __typename: "PaginatedPosts",
                  //       hasMore: fetchMoreResult.posts.hasMore,
                  //       posts: [
                  //         ...previousValue.posts.posts,
                  //         ...fetchMoreResult.posts.posts,
                  //       ],
                  //     },
                  //   };
                  // },
                });
              }}
            >
              Load more
            </Button>
          </Flex>
        ) : null}
      </Layout>
    </>
  );
};

export default Index;
// export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
