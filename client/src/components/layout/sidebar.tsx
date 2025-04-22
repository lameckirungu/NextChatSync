import { useLocation, Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { 
  Home, 
  FileText, 
  User, 
  HelpCircle, 
  LogOut, 
  Users, 
  Settings,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, isAdmin, logout } = useAuth();
  const [location] = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const isLinkActive = (href: string) => {
    return location === href;
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out transform md:translate-x-0 md:static md:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center h-16 px-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-primary-500">Admissio</h1>
          {open && (
            <button
              className="ml-auto p-2 md:hidden"
              onClick={onClose}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col flex-grow overflow-y-auto">
          {isAdmin ? (
            <div className="px-4 mt-5">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Admin Portal
              </h2>
              <nav className="mt-5 flex-1 space-y-1">
                <Link href="/admin">
                  <a className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isLinkActive("/admin")
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-600 hover:bg-slate-100"
                  )}>
                    <Home className="mr-3 h-5 w-5" />
                    Dashboard
                  </a>
                </Link>
                <Link href="/admin/applications">
                  <a className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isLinkActive("/admin/applications")
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-600 hover:bg-slate-100"
                  )}>
                    <FileText className="mr-3 h-5 w-5" />
                    Applications
                  </a>
                </Link>
                <Link href="/admin/users">
                  <a className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isLinkActive("/admin/users")
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-600 hover:bg-slate-100"
                  )}>
                    <Users className="mr-3 h-5 w-5" />
                    Users
                  </a>
                </Link>
                <Link href="/admin/settings">
                  <a className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isLinkActive("/admin/settings")
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-600 hover:bg-slate-100"
                  )}>
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                  </a>
                </Link>
              </nav>
            </div>
          ) : (
            <div className="px-4 mt-5">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Student Portal
              </h2>
              <nav className="mt-5 flex-1 space-y-1">
                <Link href="/dashboard">
                  <a className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isLinkActive("/dashboard")
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-600 hover:bg-slate-100"
                  )}>
                    <Home className="mr-3 h-5 w-5" />
                    Dashboard
                  </a>
                </Link>
                <Link href="/dashboard/application">
                  <a className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isLinkActive("/dashboard/application")
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-600 hover:bg-slate-100"
                  )}>
                    <FileText className="mr-3 h-5 w-5" />
                    My Application
                  </a>
                </Link>
                <Link href="/dashboard/profile">
                  <a className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isLinkActive("/dashboard/profile")
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-600 hover:bg-slate-100"
                  )}>
                    <User className="mr-3 h-5 w-5" />
                    Profile
                  </a>
                </Link>
                <Link href="/dashboard/help">
                  <a className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isLinkActive("/dashboard/help")
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-600 hover:bg-slate-100"
                  )}>
                    <HelpCircle className="mr-3 h-5 w-5" />
                    Help
                  </a>
                </Link>
              </nav>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex-shrink-0 flex border-t border-slate-200 p-4">
          <div className="flex items-center">
            <div>
              <div className="rounded-full h-8 w-8 flex items-center justify-center bg-primary-100 text-primary-700">
                {user?.email.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-700">{user?.email}</p>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center"
              >
                <LogOut className="mr-1 h-3 w-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
