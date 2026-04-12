import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import Workspace from "./pages/Workspace";
import FashionEditorial from "./pages/FashionEditorial";
import FilmVideo from "./pages/FilmVideo";
import CommercialPhotography from "./pages/CommercialPhotography";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/new-project",
    Component: NewProject,
  },
  {
    path: "/fashion-editorial",
    Component: FashionEditorial,
  },
  {
    path: "/film-video",
    Component: FilmVideo,
  },
  {
    path: "/commercial-photography",
    Component: CommercialPhotography,
  },
  {
    path: "/workspace/:projectId",
    Component: Workspace,
  },
]);