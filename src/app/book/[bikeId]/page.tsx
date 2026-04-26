"use client";

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon, ShieldCheck, Info, User, Phone, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';

const RENTAL_DAYS = 7;

const BIKES = [
  {
    id: 'classic-350',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    price: 1200,
  },
  {
    id: 'hayabusa',
    brand: 'Suzuki',
    model: 'Hayabusa',
    price: 8500,
  },
  {
    id: 'himalayan',
    brand: 'Royal Enfield',
    model: 'Himalayan',
    price: 1800,
  }
];

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const bikeId = params.bikeId as string;
  const bike = BIKES.find(b => b.id === bikeId);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), RENTAL_DAYS - 1),
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email! }));
    }
  }, [user]);

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
    return bike ? RENTAL_DAYS * bike.price : 0;
  }, [bike]);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date?.from || !date?.to || !bike) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const rentalDetails = {
      bikeId: bike.id,
      brand: bike.brand,
      model: bike.model,
      pricePerDay: bike.price,
      startDate: format(date.from, 'yyyy-MM-dd'),
      endDate: format(date.to, 'yyyy-MM-dd'),
      totalPrice,
      days: RENTAL_DAYS,
      customer: formData
    };

    sessionStorage.setItem('pendingRental', JSON.stringify(rentalDetails));
    router.push('/checkout');
  };

  if (!bike) {
    return <div className="container mx-auto py-20 text-center">Equipment not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 uppercase tracking-widest text-xs font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Fleet
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-8">
          <section>
            <h1 className="text-4xl font-bold tracking-tighter mb-2 uppercase">{bike.brand} {bike.model}</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.3em]">Configure Your 7-Day Rental Block</p>
          </section>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm tracking-widest uppercase flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" /> 1. Select Start Date
              </CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-widest">
                Choose the day your rental begins. Duration is fixed at 7 days.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Calendar
                mode="range"
                selected={date}
                onSelect={handleSelect}
                numberOfMonths={1}
                disabled={{ before: new Date() }}
                className="rounded-md border border-border bg-background"
              />
              <div className="mt-4 w-full p-4 bg-secondary/30 rounded-sm border border-border text-center">
                <p className="text-xs uppercase tracking-widest font-bold">
                  {date?.from && date?.to ? (
                    <>Rental Period: {format(date.from, 'PPP')} — {format(date.to, 'PPP')}</>
                  ) : (
                    "Select a start date"
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm tracking-widest uppercase flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> 2. Booking Details
              </CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-widest">
                Enter operative identification for the rental documentation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="booking-form" onSubmit={handleProceedToPayment} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      required 
                      className="pl-10 bg-background border-border uppercase text-xs" 
                      placeholder="JOHN DOE" 
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        required 
                        type="tel" 
                        className="pl-10 bg-background border-border text-xs" 
                        placeholder="+91 00000 00000" 
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Email Identifier</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        required 
                        type="email" 
                        disabled={!!user}
                        className="pl-10 bg-background border-border uppercase text-xs disabled:opacity-50" 
                        placeholder="USER@DOMAIN.COM" 
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 sticky top-24">
          <Card className="bg-card border-border shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl tracking-tight uppercase">Rental Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs uppercase tracking-widest">
                  <span className="text-muted-foreground">Daily Rate</span>
                  <span className="font-bold">₹{bike.price}</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-widest">
                  <span className="text-muted-foreground">Block Duration</span>
                  <span className="font-bold">{RENTAL_DAYS} Days</span>
                </div>
              </div>

              <div className="h-px bg-border w-full" />

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold">Total Due</p>
                  <p className="text-3xl font-bold tracking-tighter text-white glow-primary">₹{totalPrice.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Security Deposit</p>
                  <p className="text-xs font-bold text-accent uppercase">Refundable</p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-sm border border-border">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Comprehensive Insurance Included</span>
                </div>
              </div>
            </CardContent>
            <CardContent className="pt-0">
              <Button 
                type="submit" 
                form="booking-form"
                disabled={!date?.from}
                className="w-full bg-primary hover:bg-primary/90 text-white glow-primary uppercase tracking-[0.2em] font-bold py-8 text-sm"
              >
                Proceed to Checkout
              </Button>
              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest mt-4 flex items-center justify-center gap-1">
                <Info className="w-3 h-3" /> Encrypted Booking Protocol
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
