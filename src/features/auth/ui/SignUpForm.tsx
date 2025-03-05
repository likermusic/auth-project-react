import { FormLayout } from "./FormLayout";
import { useAuthUser } from "@/entities/user";

export function SignUpForm() {
  const { form, authHandler } = useAuthUser("signup");

  return <FormLayout onSubmit={authHandler} form={form} />;
}
