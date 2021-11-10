import { Box, Flex, Spacer } from "@chakra-ui/layout";
import { Button, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();

  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr={3}>
            Login
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
        <Box color="white" mr={3}>
          {data.me.username}
        </Box>
        <Button variant="link" color="white" mr={3}>
          Log Out
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="twitter.600" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
