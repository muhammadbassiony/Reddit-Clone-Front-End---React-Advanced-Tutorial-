import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import React from "react";
import InputField from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClients";
import { useGetIntId } from "../../../utils/useGetIntId";

const EditPost = ({}) => {
  const router = useRouter();
  //   const postId =
  //     typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const postId = useGetIntId();
  const [{ data, fetching }] = usePostQuery({
    pause: postId === -1,
    variables: { postId: postId },
  });

  const [, updatePost] = useUpdatePostMutation();

  if (fetching) {
    return (
      <Layout>
        <div>...Loading </div>
      </Layout>
    );
  }

  // if (error) {
  //   return <div>{error.message}</div>;
  // }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data?.post?.title, text: data?.post?.text }}
        onSubmit={async (values) => {
          //   const { error } =
          //   if (!error) {

          //   } else {
          //     console.log(error);
          //   }
          await updatePost({
            id: postId,
            ...values,
          });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              label="Title"
              placeholder="title"
            ></InputField>
            <Box mt={4}>
              <InputField
                name="text"
                label="Body"
                placeholder="text..."
                textArea={true}
              ></InputField>
            </Box>

            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Edit Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
