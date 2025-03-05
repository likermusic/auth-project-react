import { FormLayout } from "./FormLayout";
import { useAuthForm } from "../model/useAuthForm";
import { authApi } from "../../../entities/user/api/auth-api";

export function SignInForm() {
  const { form, authHandler } = useAuthForm(authApi.signin);

  return <FormLayout onSubmit={authHandler} form={form} />;
}
