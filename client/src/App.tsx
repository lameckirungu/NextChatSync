import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/hooks/use-auth";

// Public Pages
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import NotFound from "@/pages/not-found";

// Student Pages
import Dashboard from "@/pages/dashboard/index";
import Application from "@/pages/dashboard/application";
import Profile from "@/pages/dashboard/profile";

// Admin Pages
import AdminDashboard from "@/pages/admin/index";
import AdminApplications from "@/pages/admin/applications";
import AdminApplicationDetail from "@/pages/admin/applications/[id]";
import AdminUsers from "@/pages/admin/users";

// Auth Route component that redirects to login if not authenticated
function AuthRoute({ component: Component, adminOnly = false, ...rest }: any) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const [, navigate] = useLocation();

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (adminOnly && !isAdmin) {
    navigate("/dashboard");
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      
      {/* Student Routes */}
      <Route path="/dashboard">
        <AuthRoute component={Dashboard} />
      </Route>
      <Route path="/dashboard/application">
        <AuthRoute component={Application} />
      </Route>
      <Route path="/dashboard/profile">
        <AuthRoute component={Profile} />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin">
        <AuthRoute component={AdminDashboard} adminOnly={true} />
      </Route>
      <Route path="/admin/applications">
        <AuthRoute component={AdminApplications} adminOnly={true} />
      </Route>
      <Route path="/admin/applications/:id">
        <AuthRoute component={AdminApplicationDetail} adminOnly={true} />
      </Route>
      <Route path="/admin/users">
        <AuthRoute component={AdminUsers} adminOnly={true} />
      </Route>
      
      {/* Redirect root to dashboard if authenticated, otherwise to login */}
      <Route path="/">
        {() => {
          const { isAuthenticated, isAdmin } = useAuth();
          if (isAuthenticated) {
            window.location.href = isAdmin ? "/admin" : "/dashboard";
          } else {
            window.location.href = "/login";
          }
          return null;
        }}
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppShell>
          <Router />
        </AppShell>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
