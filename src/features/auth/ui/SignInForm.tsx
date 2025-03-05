import { FormLayout } from "./FormLayout";
import { useAuthUser } from "@/entities/user";

export function SignInForm() {
  const { form, authHandler } = useAuthUser("signin");

  return <FormLayout onSubmit={authHandler} form={form} />;
}
