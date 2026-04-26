
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { addDays, differenceInDays, format, isSameDay } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, ShieldCheck, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BikeProps {
  id: string;
  brand: string;
  model: string;
  type: string;
  price: number;
}

const RENTAL_DAYS = 7;

export function BookingModal({ bike, isOpen, onClose }: { bike: BikeProps; isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), RENTAL_DAYS - 1),
  });

  // Automatically adjust the end date to ensure exactly 7 days when "from" is selected
  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from) {
      const fixedRange = {
        from: range.from,
        to: addDays(range.from, RENTAL_DAYS - 1),
      };
      setDate(fixedRange);
    } else {
      setDate(undefined);
    }
  };

  const totalPrice = useMemo(() => {
    return RENTAL_DAYS * bike.price;
  }, [bike.price]);

  const handleBookNow = () => {
    if (!date?.from || !date?.to) return;
    
    const rentalDetails = {
      bikeId: bike.id,
      brand: bike.brand,
      model: bike.model,
      pricePerDay: bike.price,
      startDate: format(date.from, 'yyyy-MM-dd'),
      endDate: format(date.to, 'yyyy-MM-dd'),
      totalPrice,
      days: RENTAL_DAYS
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
          <div className="flex items-center gap-2 mb-2 text-accent">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Select Deployment Start</span>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-1">
            <Info className="w-3 h-3" /> Fixed 7-day duration applies
          </p>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={1}
            className="rounded-md border border-border bg-background"
          />
        </div>

        <div className="space-y-4 bg-secondary/30 p-4 rounded-sm border border-border">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Daily Rate</span>
            <span className="text-sm font-bold text-accent">₹{bike.price}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Rental Block</span>
            <span className="text-sm font-bold">{RENTAL_DAYS} Days</span>
          </div>
          <div className="h-px bg-border w-full" />
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold">Total Hub Cost</span>
            <span className="text-xl font-bold glow-primary">₹{totalPrice}</span>
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-col gap-2">
          <Button 
            onClick={handleBookNow}
            disabled={!date?.from}
            className="w-full bg-primary hover:bg-primary/90 text-white glow-primary uppercase tracking-[0.2em] font-bold py-6"
          >
            Confirm Reservation
          </Button>
          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest mt-2 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Secure Hub Authorization
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
