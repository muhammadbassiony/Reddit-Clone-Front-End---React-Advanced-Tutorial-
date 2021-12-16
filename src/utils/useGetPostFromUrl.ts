import { useRouter } from "next/dist/client/router";
import { usePostQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetPostFromUrl = () => {
  const postId = useGetIntId();

  return usePostQuery({
    skip: postId === -1,
    variables: { postId: postId },
  });
};
