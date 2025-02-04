
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="mr-8 flex items-center space-x-2">
          <span className="text-xl font-bold">StockNews</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                News
              </Link>
              <Link to="/stocks" className="text-sm font-medium transition-colors hover:text-primary">
                Stock Prices
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <GraduationCap className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem>Market Basics</DropdownMenuItem>
                  <DropdownMenuItem>Technical Analysis</DropdownMenuItem>
                  <DropdownMenuItem>Trading Strategies</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
