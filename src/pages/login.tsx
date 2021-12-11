import React from "react";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import InputField from "../components/InputField";
import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClients";
import { Flex, layout, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { Layout } from "../components/Layout";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [_, login] = useLoginMutation();

  return (
    <Layout>
      <Wrapper variant="small">
        <Formik
          initialValues={{ usernameOrEmail: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login(values);
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              if (typeof router.query.next === "string") {
                router.push(router.query.next);
              } else {
                router.push("/");
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="usernameOrEmail"
                label="Username Or Email"
                placeholder="username or email"
              ></InputField>
              <Box mt={4}>
                <InputField
                  name="password"
                  label="Password"
                  placeholder="password"
                  type="password"
                ></InputField>
              </Box>
              <Flex mt={3}>
                <NextLink href="/forgot-password">
                  <Link color="blue.500" ml={"auto"}>
                    Forgot Password
                  </Link>
                </NextLink>
              </Flex>
              <Button
                mt={4}
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                Log In
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Login);
