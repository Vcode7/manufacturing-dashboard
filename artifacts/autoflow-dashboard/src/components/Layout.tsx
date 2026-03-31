import React from "react";
import { Link, useLocation } from "wouter";
import { ThemeProvider } from "@/lib/theme";
import { 
  LayoutDashboard, 
  Factory, 
  Package, 
  Truck, 
  LineChart, 
  Activity,
  Settings,
  Bell,
  Search,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/production", label: "Production", icon: Factory },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/supply-chain", label: "Supply Chain", icon: Truck },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/machines", label: "Machines", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
];

function Sidebar({ className = "" }: { className?: string }) {
  const [location] = useLocation();

  return (
    <div className={`flex h-full flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground ${className}`}>
      <div className="p-6">
        <div className="flex items-center gap-2 font-bold text-xl text-sidebar-primary">
          <Factory className="h-6 w-6" />
          <span>AutoFlow AI</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors ${
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" 
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80"
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent/50 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-xs text-sidebar-foreground/60 mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">All systems nominal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-md">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 border-sidebar-border">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        <form className="hidden md:flex">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search parts, shipments, machines..."
              className="w-full bg-muted/50 pl-9 border-none focus-visible:ring-1"
              data-testid="input-global-search"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="button-user-menu">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="@opmanager" />
                <AvatarFallback className="bg-primary/10 text-primary">OM</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Operations Manager</p>
                <p className="text-xs leading-none text-muted-foreground">
                  opmanager@autoflow.ai
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/settings" className="w-full cursor-pointer">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <div className="hidden md:block w-64 shrink-0">
          <Sidebar className="fixed w-64" />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
