import React from "react";
import { Link, useLocation } from "wouter";
import { ThemeProvider, useTheme } from "@/lib/theme";
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
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/production", label: "Production", icon: Factory },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/supply-chain", label: "Supply Chain", icon: Truck },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/machines", label: "Machines", icon: Activity },
  { href: "/ai-analysis", label: "AI Analysis", icon: BrainCircuit },
  { href: "/settings", label: "Settings", icon: Settings },
];

function Sidebar() {
  const [location] = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed } = useTheme();

  return (
    <motion.div
      animate={{ width: sidebarCollapsed ? 60 : 220 }}
      transition={{ type: "spring", stiffness: 400, damping: 38, mass: 0.7 }}
      className="fixed top-0 left-0 h-screen flex flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground z-40 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3.5 h-12 border-b border-sidebar-border shrink-0">
        <div className="h-7 w-7 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
          <Factory className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="font-bold text-sm text-sidebar-primary whitespace-nowrap"
            >
              AutoFlow AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const navEl = (
            <Link key={item.href} href={item.href}>
              <div
                className={cn("nav-item", isActive && "active")}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <item.icon className={cn("nav-icon h-4 w-4 shrink-0", isActive ? "text-sidebar-primary" : "text-sidebar-foreground/60")} />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="text-[13px] whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );

          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.href} delayDuration={100}>
                <TooltipTrigger asChild>{navEl}</TooltipTrigger>
                <TooltipContent side="right" className="text-xs font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }
          return navEl;
        })}
      </nav>

      {/* Status */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="mx-2 mb-2 rounded-md bg-sidebar-accent/60 px-3 py-2"
          >
            <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-wider font-semibold mb-1">System</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-sidebar-foreground/80">All systems nominal</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="mx-2 mb-3 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors text-xs font-medium"
        data-testid="button-sidebar-toggle"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <>
            <ChevronLeft className="h-4 w-4" />
            <span className="text-[11px]">Collapse</span>
          </>
        )}
      </button>
    </motion.div>
  );
}

function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur-md shadow-sm">
      <div className="w-full flex-1">
        <div className="relative w-full max-w-xs hidden md:block">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-muted/40 pl-8 h-8 text-xs border-none focus-visible:ring-1"
            data-testid="input-global-search"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Dark/Light toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          data-testid="button-toggle-theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8 relative" data-testid="button-notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-destructive" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full p-0" data-testid="button-user-menu">
              <Avatar className="h-7 w-7">
                <AvatarImage src="/placeholder-avatar.jpg" alt="@opmanager" />
                <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-bold">OM</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-semibold">Operations Manager</p>
                <p className="text-xs text-muted-foreground">opmanager@autoflow.ai</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/settings" className="w-full cursor-pointer">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useTheme();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <motion.div
        animate={{ marginLeft: sidebarCollapsed ? 60 : 220 }}
        transition={{ type: "spring", stiffness: 400, damping: 38, mass: 0.7 }}
        className="flex flex-1 flex-col min-w-0"
      >
        <Navbar />
        <main className="flex-1 overflow-auto bg-muted/20">
          {children}
        </main>
      </motion.div>
    </div>
  );
}
