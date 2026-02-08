import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { APP_NAME } from "@/lib/constants";
import okouLogo from "@/assets/okou-background.png";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/services/redaction-academique", label: "Rédaction Académique" },
  { href: "/services/vap-vae", label: "VAP / VAE" },
  { href: "/voyage", label: "VOYAGE" },
  { href: "/formations", label: "Formations" },
  { href: "/portfolio", label: "Portfolio" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAnonymous, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-primary">
            <img
              src={okouLogo}
              alt="OkouSmart Hub"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 gradient-primary opacity-30" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-xl text-white">{APP_NAME}</span>
            <p className="text-[10px] text-white/70 -mt-1">Services Pro</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-amber-400 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full border-2 border-white/30 hover:border-amber-400 text-white">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">
                    {isAnonymous ? "Invité" : user?.email}
                  </p>
                  {isAnonymous && (
                    <p className="text-xs text-muted-foreground">Mode invité</p>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Mon espace
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer text-primary">
                      <Shield className="mr-2 h-4 w-4" />
                      SuperAdmin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" className="text-white hover:text-amber-400 hover:bg-white/10" asChild>
                <Link to="/auth">Connexion</Link>
              </Button>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg" asChild>
                <Link to="/auth?mode=signup">Inscription</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/20 animate-slide-down bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block py-2 text-sm font-medium text-white/80 hover:text-amber-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="block py-2 text-sm font-medium text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                ⚡ SuperAdmin
              </Link>
            )}
            {!isAuthenticated && (
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Button variant="outline" asChild>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    Connexion
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>
                    Inscription
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
