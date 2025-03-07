import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { Home } from "@/pages/home";
import { SignIn } from "@/pages/sign-in";
import { ProtectedAppLayout as AppLayout } from "@/app/ApptLayout";
import { SignUp } from "@/pages/sign-up";

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <AppLayout />,
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
