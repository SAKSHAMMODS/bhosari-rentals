
"use client";

import { Button } from '@/components/ui/button';
import { CreditCard, Wallet } from 'lucide-react';

export function PayPalPlaceholder({ amount, onComplete }: { amount: number; onComplete: () => void }) {
  return (
    <div className="space-y-4 w-full">
      <Button 
        onClick={onComplete}
        className="w-full h-12 bg-[#FFC439] hover:bg-[#F2BA36] text-[#111111] font-bold flex items-center justify-center gap-2"
      >
        <span className="italic text-xl font-extrabold tracking-tighter lowercase">PayPal</span>
      </Button>
      <div className="flex gap-4">
        <Button 
          variant="outline"
          onClick={onComplete}
          className="flex-1 h-12 border-border flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-bold"
        >
          <CreditCard className="w-4 h-4" /> Card
        </Button>
        <Button 
          variant="outline"
          onClick={onComplete}
          className="flex-1 h-12 border-border flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-bold"
        >
          <Wallet className="w-4 h-4" /> Crypto
        </Button>
      </div>
      <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest pt-2">
        Simulation Mode: Transactions are non-binding.
      </p>
    </div>
  );
}
