import { SignInForm } from "@/features/auth";
import { withCheckAuth } from "@/features/auth/ui/withCheckAuth";
import { AuthLayout } from "@/shared/ui/layouts/AuthLayout";

function SignIn() {
  return <AuthLayout title="Signin" form={<SignInForm />} />;
}

const ProtectedSignIn = withCheckAuth(SignIn);
export { ProtectedSignIn };
