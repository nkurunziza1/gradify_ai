import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./Routes";
import PublicRoute from "./guard/PublicRoute";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./guard/protecteRoutes";
import { AuthProvider } from "./context/authContexts";
import { RouteChild, RouteConfig } from "./types/routes/ route";

interface UpdatedRouteConfig extends Omit<RouteConfig, "allowedRoles"> {
  protected: boolean;
  path: string;
  element: React.FC;
  children?: UpdatedRouteChild[];
}

interface UpdatedRouteChild extends Omit<RouteChild, "allowedRoles"> {
  protected: boolean;
  path: string;
  element: React.FC;
}

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <main className="overflow-x-hidden">
          <Routes>
            {routes.map((route: RouteConfig, index: number) => (
              <Route
                key={index}
                path={route.path}
                element={
                  route.protected ? (
                    <ProtectedRoute path={route.path}>
                      <route.element />
                    </ProtectedRoute>
                  ) : (
                    <PublicRoute>
                      <route.element />
                    </PublicRoute>
                  )
                }
              >
                {route.children &&
                  route.children.map(
                    (childRoute: RouteChild, childIndex: number) => (
                      <Route
                        key={childIndex}
                        path={childRoute.path}
                        element={
                          childRoute.protected ? (
                            <ProtectedRoute path={childRoute.path}>
                              <childRoute.element />
                            </ProtectedRoute>
                          ) : (
                            <PublicRoute>
                              <childRoute.element />
                            </PublicRoute>
                          )
                        }
                      />
                    )
                  )}
              </Route>
            ))}
          </Routes>
          <Toaster />
        </main>
      </AuthProvider>
    </Router>
  );
};

export default App;
