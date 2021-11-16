// import React from "react";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClients";
import NextLink from "next/link";
import { Link } from "@chakra-ui/layout";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });

  return (
    <>
      <Layout>
        <NextLink href="/create-post">
          <Link>Create Post</Link>
        </NextLink>
        <br />
        <hr />
        {!data ? (
          <div>Loading ...</div>
        ) : (
          data?.posts.map((p) => <div key={p.id}>{p.title}</div>)
        )}
      </Layout>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
