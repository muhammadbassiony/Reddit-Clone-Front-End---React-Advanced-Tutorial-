import { Box, Heading } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import React from "react";
import { EditDeletepostButtons } from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClients";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";

const Post = ({}) => {
  // const router = useRouter();
  // const postId =
  //   typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, error, fetching }] = useGetPostFromUrl();

  if (fetching) {
    return (
      <Layout>
        <div>...Loading bro </div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Heading mb={4}>{data.post.title}</Heading>
        <Box mb={4}>{data?.post?.text}</Box>
        <EditDeletepostButtons
          id={data.post.id}
          creatorId={data.post.creatorId}
        />
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
