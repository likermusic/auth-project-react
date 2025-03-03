import { AuthLayout } from "@/features/auth/ui/AuthLayout";
import { SignUpForm } from "@/features/auth/ui/SignUpForm";

export function SignUp() {
  return <AuthLayout title="Sign Up" form={<SignUpForm />} />;
}
