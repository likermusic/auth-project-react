import { FormLayout } from "./FormLayout";
import { useSignUpUser } from "../model/useSignUpUser";
import { ROUTES } from "@/shared/constants/routes";

export function SignUpForm() {
  const { signUpHandler, form } = useSignUpUser();

  return (
    <FormLayout
      onSubmit={signUpHandler}
      form={form}
      link={{ to: ROUTES.SIGNIN, title: "Sign in" }}
      buttonTitle="Sign up"
    />
  );
}
