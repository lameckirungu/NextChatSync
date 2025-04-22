import { Bell } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { user } = useAuth();

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-slate-200">
      <button
        type="button"
        className="md:hidden px-4 border-r border-slate-200 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        onClick={toggleSidebar}
      >
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex-1 px-4 flex justify-between md:px-6">
        <div className="flex-1 flex items-center">
          <h1 className="text-xl font-semibold text-slate-800 md:hidden">Admissio</h1>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          <button className="p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <Bell className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
