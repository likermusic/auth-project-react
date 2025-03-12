import { SignInForm } from "@/features/auth";
import { withCheckAuth } from "@/features/auth/ui/withCheckAuth";
import { AuthLayout } from "@/shared/ui/layouts/AuthLayout";

export function SignIn() {
  return <AuthLayout title="Sign In" form={<SignInForm />} />;
}

// const ProtectedSignIn = withCheckAuth(SignIn);
// export { ProtectedSignIn };
