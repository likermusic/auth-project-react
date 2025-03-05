import { SignUpForm } from "@/features/auth";
import { AuthLayout } from "@/shared/ui/layouts/AuthLayout";

export function SignUp() {
  return <AuthLayout title="Sign Up" form={<SignUpForm />} />;
}
