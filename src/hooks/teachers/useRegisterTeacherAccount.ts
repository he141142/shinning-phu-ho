import { useGraphQLMutationWithUnwrap } from "@/lib/graphql";
import { queryClient } from "@/lib/react-query";
import { CommonResponse } from "@/models/common";
import { gql } from "graphql-request";

const REGISTER_USER_ACCOUNT_MUTATION = gql`
  mutation RegisterTeacherAccount($input: RegisterTeacherAccountPayload!) {
    RegisterTeacherAccount(input: $input) {
      entity_id
      status
      message
    }
  }
`;
interface RegisterTeacherAccountPayloadInputItem {
  input: RegisterTeacherAccountPayloadInput;
}
interface RegisterTeacherAccountPayloadInput {
  username: string;
  password: string;
  email: string;
  mobile: string;
  first_name: string;
  last_name: string;
  address: string;
  center_id: number;
  gender: string;
}

export function useRegisterTeacherAccount(options?: {
  onSuccess?: (data: CommonResponse) => void;
  onError?: (error: Error) => void;
}) {
  return useGraphQLMutationWithUnwrap<
    CommonResponse,
    RegisterTeacherAccountPayloadInputItem
  >("RegisterTeacherAccount", REGISTER_USER_ACCOUNT_MUTATION, {
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["username", variables.input.username],
      });
      queryClient.invalidateQueries({ queryKey: ["mobile", variables.input.mobile] });

      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
