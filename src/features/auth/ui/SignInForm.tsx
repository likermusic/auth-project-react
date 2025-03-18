import { FormLayout } from "./FormLayout";
import { useSignInUser } from "../model/useSignInUser";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/button";
import { Link } from "react-router-dom";

export function SignInForm() {
  const { signInHandler, form } = useSignInUser();

  // const user = useUserStore((state) => state.user);

  return (
    <FormLayout
      onSubmit={signInHandler}
      form={form}
      link={{ to: ROUTES.SIGNUP, title: "Sign up" }}
      buttonTitle="Sign in"
      forgotPassword={
        <Button
          variant={"link"}
          className="font-normal mt-2 text-center w-full"
        >
          <Link to={`${ROUTES.FORGOT_PASSWORD}`}>Forgot password</Link>
        </Button>
      }
    />
  );
}
