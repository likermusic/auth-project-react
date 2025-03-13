import { SignUpForm } from "@/features/auth";
import { withCheckAuth } from "@/features/auth/ui/withCheckAuth";
import { AuthLayout } from "@/shared/ui/layouts/AuthLayout";

function SignUp() {
  return <AuthLayout title="Signup" form={<SignUpForm />} />;
}

const ProtectedSignUp = withCheckAuth(SignUp);
export { ProtectedSignUp };
