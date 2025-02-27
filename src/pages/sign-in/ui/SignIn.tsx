import { SignInForm } from "@/features/auth";
import { AuthLayout } from "@/features/auth/ui/AuthLayout";

export function SignIn() {
  return <AuthLayout title="Sign In" form={<SignInForm />} />;
}
