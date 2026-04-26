
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, ShieldCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({ title: "PROFILE CREATED", description: "Operative registration successful." });
      router.push('/');
    } catch (err) {
      toast({ title: "REGISTRATION FAILED", description: "Check input parameters and try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <Card className="w-full max-w-md bg-card border-border shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-accent/20 w-12 h-12 flex items-center justify-center rounded-sm mb-4 glow-accent">
            <UserPlus className="text-accent w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tighter">OPERATIVE REGISTRATION</CardTitle>
          <CardDescription className="uppercase tracking-widest text-[10px] text-muted-foreground">
            Initialize your Velohub profile
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Email Identifier</label>
              <Input 
                type="email" 
                placeholder="USER@DOMAIN.COM" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border uppercase text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Access Passcode</label>
              <Input 
                type="password" 
                placeholder="********" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background border-border"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground uppercase tracking-[0.2em] font-bold h-12 glow-accent"
            >
              {loading ? "INITIALIZING..." : "CREATE PROFILE"}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">
              Already registered? <Link href="/login" className="text-primary hover:underline">Authorize Access</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
