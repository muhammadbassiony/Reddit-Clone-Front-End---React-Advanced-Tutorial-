import { IconButton } from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          setLoadingState("updoot-loading");
          await vote({ value: 1, postId: post.id });
          console.log(post);
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "updoot-loading"}
        colorScheme={post.voteStatus === 1 ? "teal" : undefined}
        icon={<ArrowUpIcon />}
        w={6}
        h={6}
        aria-label="up vote"
      />
      {post.points}
      <IconButton
        onClick={async () => {
          setLoadingState("downdoot-loading");
          await vote({ value: -1, postId: post.id });
          console.log(post);
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downdoot-loading"}
        icon={<ArrowDownIcon />}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        // colorScheme="blue"
        w={6}
        h={6}
        aria-label="down vote"
      />
    </Flex>
  );
};
