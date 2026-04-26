
"use client";

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { addDays, differenceInDays, format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, ShieldCheck, Wallet } from 'lucide-react';

interface BikeProps {
  id: string;
  brand: string;
  model: string;
  type: string;
  price: number;
}

export function BookingModal({ bike, isOpen, onClose }: { bike: BikeProps; isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });

  const totalPrice = useMemo(() => {
    if (!date?.from || !date?.to) return 0;
    const days = differenceInDays(date.to, date.from) + 1;
    return days * bike.price;
  }, [date, bike.price]);

  const handleBookNow = () => {
    if (!date?.from || !date?.to) return;
    
    // Store rental details in session storage for the checkout page
    const rentalDetails = {
      bikeId: bike.id,
      brand: bike.brand,
      model: bike.model,
      pricePerDay: bike.price,
      startDate: format(date.from, 'yyyy-MM-dd'),
      endDate: format(date.to, 'yyyy-MM-dd'),
      totalPrice,
      days: differenceInDays(date.to, date.from) + 1
    };
    
    sessionStorage.setItem('pendingRental', JSON.stringify(rentalDetails));
    router.push('/checkout');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl tracking-tight">CONFIGURE RENTAL</DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs uppercase tracking-widest">
            {bike.brand} {bike.model}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 text-accent">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Select Deployment Duration</span>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            className="rounded-md border border-border bg-background"
          />
        </div>

        <div className="space-y-4 bg-secondary/30 p-4 rounded-sm border border-border">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Rate</span>
            <span className="text-sm font-bold text-accent">${bike.price}/day</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Duration</span>
            <span className="text-sm font-bold">{date?.from && date?.to ? `${differenceInDays(date.to, date.from) + 1} days` : '--'}</span>
          </div>
          <div className="h-px bg-border w-full" />
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold">Total Operational Cost</span>
            <span className="text-xl font-bold glow-primary">${totalPrice}</span>
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-col gap-2">
          <Button 
            onClick={handleBookNow}
            disabled={!date?.from || !date?.to}
            className="w-full bg-primary hover:bg-primary/90 text-white glow-primary uppercase tracking-[0.2em] font-bold py-6"
          >
            Confirm Reservation
          </Button>
          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest mt-2 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Secure Payment via Velohub Gateway
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
