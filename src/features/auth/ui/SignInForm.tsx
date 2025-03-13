import { FormLayout } from "./FormLayout";
import { useSignInUser } from "../model/useSignInUser";
import { ROUTES } from "@/shared/constants/routes";

export function SignInForm() {
  const { signInHandler, form } = useSignInUser();

  return (
    <FormLayout
      onSubmit={signInHandler}
      form={form}
      link={{ to: ROUTES.SIGNUP, title: "Sign up" }}
      buttonTitle="Sign in"
    />
  );
}
