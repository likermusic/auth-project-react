import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { Home } from "@/pages/home";
import { ProtectedSignIn as SignIn } from "@/pages/sign-in";
import { AppLayout } from "@/app/ApptLayout";
import { ProtectedSignUp as SignUp } from "@/pages/sign-up";
import { AppLoader } from "./AppLoader";

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
  // {
  //   path: ROUTES.BOARDS,
  //   element: <BoardsPage />,
  // },
  // {
  //   path: ROUTES.USERS,
  //   element: <UsersPage />,
  // },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
