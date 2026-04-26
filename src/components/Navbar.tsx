"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bike } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';

export function Navbar() {
  const auth = useAuth();
  const { user } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-sm glow-primary transition-transform group-hover:scale-105">
            <Bike className="w-5 h-5 text-white" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tighter">VELOHUB</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Catalog</Link>
          <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
          <Link href="/about" className="hover:text-primary transition-colors">Our Hub</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Support</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-xs text-muted-foreground uppercase tracking-wider">{user.email}</span>
              <Button variant="outline" size="sm" onClick={() => signOut(auth)} className="border-border uppercase tracking-widest text-xs h-8">
                Log Out
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="uppercase tracking-widest text-xs h-8">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 glow-primary uppercase tracking-widest text-xs h-8">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
