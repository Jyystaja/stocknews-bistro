import { Link } from "react-router-dom";
import { GraduationCap, Plus, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavItems = () => {
  const { isAdmin, signOut } = useAuth();
  
  return (
    <>
      <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
        News
      </Link>
      <Link to="/stocks" className="text-sm font-medium transition-colors hover:text-primary">
        Stock Prices
      </Link>
      <div className="flex items-center space-x-2 ml-auto">
        {isAdmin && (
          <Link to="/create-article">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-5 w-5" />
            </Button>
          </Link>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <GraduationCap className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem>Market Basics</DropdownMenuItem>
            <DropdownMenuItem>Technical Analysis</DropdownMenuItem>
            <DropdownMenuItem>Trading Strategies</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

const MobileNav = () => {
  const { isAdmin, signOut } = useAuth();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-auto">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[240px] sm:w-[280px]">
        <nav className="flex flex-col h-full">
          <div className="flex flex-col space-y-4 mt-8 flex-grow">
            <NavItems />
          </div>
          {isAdmin && (
            <div className="pb-6">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="mr-8 flex items-center space-x-2">
          <span className="text-xl font-bold">StockNews</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {isMobile ? (
              <div className="flex w-full justify-between items-center">
                <div className="flex-1" />
                <MobileNav />
              </div>
            ) : (
              <nav className="flex items-center space-x-6">
                <NavItems />
              </nav>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;