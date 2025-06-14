
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRound, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface UserMenuProps {
  shouldUseDarkText: boolean;
}

export default function UserMenu({ shouldUseDarkText }: UserMenuProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  if (!user) {
    return (
      <Link to="/auth">
        <Button 
          variant="outline"
          className={cn(
            "transition-all duration-300 ease-in-out hover:scale-105 border focus:outline-none focus-visible:outline-none",
            shouldUseDarkText
              ? "text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-700" 
              : "text-white border-white/30 hover:bg-white/10 hover:text-white"
          )}
        >
          Sign In
        </Button>
      </Link>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost"
          className={cn(
            "transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus-visible:outline-none",
            shouldUseDarkText
              ? "text-gray-700 hover:bg-gray-100 hover:text-gray-700" 
              : "text-white hover:bg-white/10 hover:text-white"
          )}
        >
          <UserRound className="h-5 w-5 mr-1" />
          <span className="hidden md:inline">Dashboard</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/dashboard')}>
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
