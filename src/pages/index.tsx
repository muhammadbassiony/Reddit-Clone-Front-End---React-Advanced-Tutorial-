// import React from "react";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClients";
import NextLink from "next/link";
import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/layout";
import React from "react";
import { Button } from "@chakra-ui/button";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10,
    },
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
        <Flex align="center" mb={4}>
          <Heading>LiReddit</Heading>
          <NextLink href="/create-post">
            <Link ml={"auto"} mt={5} color="blueviolet">
              <b>Create Post</b>
            </Link>
          </NextLink>
        </Flex>

        {!data && fetching ? (
          <div>Loading ...</div>
        ) : (
          <Stack spacing={8}>
            {data!.posts.map((p) => (
              <Box key={p.id} p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{p.title}</Heading>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
            ))}
          </Stack>
        )}

        {data ? (
          <Flex>
            <Button
              isLoading={fetching}
              colorScheme="teal"
              size="md"
              m={"auto"}
              my={8}
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
