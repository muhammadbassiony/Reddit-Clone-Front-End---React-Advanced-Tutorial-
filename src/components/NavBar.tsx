import { Box, Flex, Heading, Spacer } from "@chakra-ui/layout";
import { Button, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Button colorScheme="red" variant="link" mr={3}>
            Create Post
          </Button>
        </NextLink>
        <NextLink href="/login">
          <Link color="white" mr={3}>
            Log In
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white" mr={3}>
            Register
          </Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <NextLink href="/create-post">
          <Link color="white" mr={2}>
            <b>Create Post</b>
          </Link>
        </NextLink>
        <Box color="yellow.100" mr={3}>
          <b>{data.me.username}</b>
        </Box>
        <Button
          variant="link"
          color="white"
          mr={3}
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
        >
          Log Out
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      zIndex={1}
      position="sticky"
      top={0}
      bg="twitter.600"
      p={4}
      align="center"
    >
      <Flex maxW={800} m="auto" align="center" flex={1}>
        <NextLink href="/">
          <Link>
            <Heading color="white">LiReddit</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
