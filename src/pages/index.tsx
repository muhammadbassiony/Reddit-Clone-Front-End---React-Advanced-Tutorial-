import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClients";
import NextLink from "next/link";
import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/layout";
import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { UpdootSection } from "../components/UpdootSection";

const Index = () => {
  const [variables, setvariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return (
      <Flex align={"center"}>
        <Box bg="tomato" w="100%" color="white" p={4}>
          Error
        </Box>
      </Flex>
    );
  }

  return (
    <>
      <Layout>
        {/* <Flex align="center" mb={4}>
          <Heading>LiReddit</Heading>
          <NextLink href="/create-post">
            <Link ml={"auto"} mt={5} color="blueviolet">
              <b>Create Post</b>
            </Link>
          </NextLink>
        </Flex> */}

        {!data && fetching ? (
          <div>Loading ...</div>
        ) : (
          <Stack spacing={8}>
            {data!.posts.posts.map((p) => (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <Box>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Link>
                      <Heading fontSize="xl" mr={2}>
                        {p.title}
                      </Heading>
                    </Link>
                  </NextLink>
                  <Text color="tomato">posted by {p.creator.username}</Text>
                  <Text mt={4}>{p.textSnippet}</Text>
                </Box>
              </Flex>
            ))}
          </Stack>
        )}

        {data && data.posts.hasMore ? (
          <Flex>
            <Button
              isLoading={fetching}
              colorScheme="teal"
              size="md"
              m={"auto"}
              my={8}
              onClick={() => {
                setvariables({
                  limit: variables.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
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

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
