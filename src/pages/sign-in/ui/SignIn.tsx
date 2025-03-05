import { SignInForm } from "@/features/auth";
import { AuthLayout } from "@/shared/ui/layouts/AuthLayout";

export function SignIn() {
  return <AuthLayout title="Sign In" form={<SignInForm />} />;
}
