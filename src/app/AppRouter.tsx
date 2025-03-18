import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { Home } from "@/pages/home";
import { ProtectedSignIn as SignIn } from "@/pages/sign-in";
// import { SignIn } from "@/pages/sign-in";

import { AppLayout } from "@/app/ApptLayout";
import { ProtectedSignUp as SignUp } from "@/pages/sign-up";
import { AppLoader } from "./AppLoader";
import { ResetPassword } from "@/pages/reset-password";
import { ForgotPassword } from "@/pages/forgot-password";

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <AppLoader>
        <AppLayout />
      </AppLoader>
    ),
    children: [
      {
        path: "",
        element: <Home />,
        // loader: () => redirect(ROUTES.USERS),
      },
    ],
  },
  // Вынесли Login чтобы не применялся RootLayout
  {
    path: ROUTES.SIGNIN,
    element: <SignIn />,
  },
  {
    path: ROUTES.SIGNUP,
    element: <SignUp />,
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: <ResetPassword />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
