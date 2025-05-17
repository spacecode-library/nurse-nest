
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
          variant="ghost"
          className={cn(
            "sign-in-button",
            shouldUseDarkText 
              ? "text-gray-700 hover:text-primary-500 hover:bg-transparent" 
              : "text-white hover:text-primary-300 hover:bg-transparent"
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
            "flex items-center",
            shouldUseDarkText ? "text-gray-700" : "text-white"
          )}
        >
          <UserRound className="h-5 w-5 mr-1" />
          <span className="hidden md:inline">Account</span>
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

// Add missing Link import
import { Link } from 'react-router-dom';
