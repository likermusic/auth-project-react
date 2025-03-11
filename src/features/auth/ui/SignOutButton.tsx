import { Button } from "@/shared/ui/button";
import { useSignOutUser } from "../model/useSignOutUser";

export function SignOutButton() {
  const { loading, signoutHandler } = useSignOutUser();
  return (
    <>
      <Button
        onClick={signoutHandler}
        className="cursor-pointer border border-slate"
        disabled={loading}
      >
        Выйти
      </Button>
    </>
  );
}

export default SignOutButton;
