"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bike, Menu } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from 'react';

export function Navbar() {
  const auth = useAuth();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link 
        href="/" 
        onClick={() => setIsOpen(false)}
        className="hover:text-primary transition-colors py-2 md:py-0"
      >
        Catalog
      </Link>
      {user && (
        <Link 
          href="/my-bikes" 
          onClick={() => setIsOpen(false)}
          className="hover:text-primary transition-colors py-2 md:py-0 text-accent font-bold"
        >
          My Bikes
        </Link>
      )}
      <a 
        href="mailto:sakshambhor@gmail.com" 
        className="hover:text-primary transition-colors py-2 md:py-0"
      >
        Support
      </a>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-sm glow-primary transition-transform group-hover:scale-105">
            <Bike className="w-5 h-5 text-white" />
          </div>
          <span className="font-headline font-bold text-lg md:text-xl tracking-tighter">VELOHUB</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-medium">
          <NavLinks />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider max-w-[100px] md:max-w-none truncate">
                  {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={() => signOut(auth)} className="border-border uppercase tracking-widest text-[10px] md:text-xs h-8">
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="uppercase tracking-widest text-[10px] md:text-xs h-8">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 glow-primary uppercase tracking-widest text-[10px] md:text-xs h-8">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-card border-border">
                <SheetHeader className="mb-8">
                  <SheetTitle className="text-left tracking-tighter uppercase font-bold text-primary">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 text-sm uppercase tracking-widest font-medium">
                  <NavLinks />
                  <div className="h-px bg-border w-full my-2" />
                  {user ? (
                    <div className="flex flex-col gap-4">
                      <p className="text-[10px] text-muted-foreground break-all">{user.email}</p>
                      <Button variant="outline" size="sm" onClick={() => { signOut(auth); setIsOpen(false); }} className="w-full border-border uppercase tracking-widest text-xs h-10">
                        Log Out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full uppercase tracking-widest text-xs h-10 text-left justify-start">
                          Log In
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        <Button variant="default" size="sm" className="w-full bg-primary hover:bg-primary/90 glow-primary uppercase tracking-widest text-xs h-10">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
