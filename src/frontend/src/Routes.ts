import Layout from "./layouts/Layout";
import PortalLayout from "./layouts/PortalLayout";
import { RouteConfig } from "./types/routes/ route";
import Home from "./pages/home";
import DistributedStudentsList from "./pages/admin/DistributedStudentsList";
import LocateStudents from "./pages/admin/LocateStudents";

const routes: RouteConfig[] = [
  {
    path: "/",
    element: Layout,
    protected: false,
    children: [
      {
        path: "",
        element: Home,
        protected: false,
      },
    ],
  },
  {
    path: "/portal",
    element: PortalLayout,
    protected: true,
    children: [
      {
        path: "distributed",
        element: LocateStudents,
        protected: true,
      },
      {
        path: "locate",
        element: DistributedStudentsList,
        protected: true,
      },
    ],
  },
];

export default routes;
