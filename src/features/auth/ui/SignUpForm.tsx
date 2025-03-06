import { FormLayout } from "./FormLayout";
import { useSignUpUser } from "../model/useSignUpUser";

export function SignUpForm() {
  const { signUpHandler, form } = useSignUpUser();

  return <FormLayout onSubmit={signUpHandler} form={form} />;
}
