
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const router = useRouter();

  const validatePasscode = (code: string) => {
    if (!code) return "Passcode field is empty.";
    if (!/^\d+$/.test(code)) return "The passcode must contain ONLY numeric digits (0-9). Symbols and letters are not permitted.";
    if (code.length !== 5) return `The passcode must be exactly 5 digits long. You currently have ${code.length} digits.`;
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validatePasscode(password);
    if (error) {
      setValidationMessage(error);
      setShowValidationPopup(true);
      return;
    }

    setLoading(true);
    try {
      // Note: Firebase usually requires 6 chars. If the project allows 5, this works.
      // If not, we handle the Firebase weak-password error.
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "ACCESS GRANTED", description: "Identity verified." });
      router.push('/');
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        toast({ title: "ACCESS DENIED", description: "Invalid credentials provided.", variant: "destructive" });
      } else {
        setValidationMessage(err.message || "An unexpected security error occurred.");
        setShowValidationPopup(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <Card className="w-full max-w-md bg-card border-border shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/20 w-12 h-12 flex items-center justify-center rounded-sm mb-4 glow-primary">
            <ShieldCheck className="text-primary w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tighter">SECURE LOGIN</CardTitle>
          <CardDescription className="uppercase tracking-widest text-[10px] text-muted-foreground">
            Enter authorized credentials to proceed
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
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
              <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">5-Digit Access Passcode</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="00000" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={5}
                  inputMode="numeric"
                  required
                  className="bg-background border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  title={showPassword ? "Hide Passcode" : "Show Passcode"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white uppercase tracking-[0.2em] font-bold h-12 glow-primary"
            >
              {loading ? "VERIFYING..." : "AUTHORIZE ACCESS"}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">
              New operative? <Link href="/signup" className="text-primary hover:underline">Register Profile</Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      <AlertDialog open={showValidationPopup} onOpenChange={setShowValidationPopup}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              VALIDATION ERROR
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground uppercase tracking-wider text-xs leading-relaxed">
              {validationMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-primary text-white font-bold uppercase tracking-widest text-xs">
              Acknowledge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
