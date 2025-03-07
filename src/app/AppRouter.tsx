import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { ProtectedHome as Home } from "@/pages/home";
import { SignIn } from "@/pages/sign-in";
import { RootLayout } from "@/shared/ui/layouts/RootLayout";
import { SignUp } from "@/pages/sign-up";

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <RootLayout />,
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
