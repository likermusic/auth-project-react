import { FormLayout } from "./FormLayout";
import { useSignInUser } from "../model/useSignInUser";

export function SignInForm() {
  const { signInHandler, form } = useSignInUser();

  return <FormLayout onSubmit={signInHandler} form={form} />;
}
