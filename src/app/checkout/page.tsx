"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PayPalPlaceholder } from '@/components/PayPalPlaceholder';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

interface RentalDetails {
  bikeId: string;
  brand: string;
  model: string;
  pricePerDay: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  days: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [details, setDetails] = useState<RentalDetails | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('pendingRental');
    if (!data) {
      router.push('/');
      return;
    }
    setDetails(JSON.parse(data));
    setConfirmationId(`VH-${Math.random().toString(36).substring(2, 11)}`.toUpperCase());
  }, [router]);

  const handlePaymentComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      sessionStorage.removeItem('pendingRental');
      toast({
        title: "PAYMENT AUTHORIZED",
        description: "Your equipment is being prepared for deployment.",
      });
    }, 2000);
  };

  if (!details && !isSuccess) return null;

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center">
        <Card className="max-w-md w-full text-center bg-card border-border p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/20 p-4 rounded-full">
              <CheckCircle2 className="w-12 h-12 text-primary glow-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 tracking-tighter">ORDER CONFIRMED</h1>
          <p className="text-muted-foreground uppercase tracking-widest text-xs mb-8 leading-relaxed">
            Your rental configuration has been locked. Check your email for logistics documentation and pickup instructions.
          </p>
          <div className="bg-secondary/50 p-6 rounded-sm border border-border mb-8 text-left">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Confirmation ID</p>
            <p className="font-mono text-sm uppercase">{confirmationId || "VH-*********"}</p>
          </div>
          <Link href="/">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white uppercase tracking-[0.2em] font-bold h-12">
              Return to Logistics Hub
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 uppercase tracking-widest text-xs font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Fleet
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <h1 className="text-4xl font-bold mb-8 tracking-tighter">CHECKOUT SUMMARY</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4" /> Equipment Selection
              </h2>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{details?.brand}</p>
                      <h3 className="text-xl font-bold">{details?.model}</h3>
                    </div>
                    <p className="font-bold text-accent">${details?.pricePerDay} / day</p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-4 text-xs uppercase tracking-widest">
                    <div className="bg-secondary/50 px-3 py-1.5 rounded-sm border border-border">
                      <span className="text-muted-foreground">Start:</span> {details?.startDate}
                    </div>
                    <div className="bg-secondary/50 px-3 py-1.5 rounded-sm border border-border">
                      <span className="text-muted-foreground">End:</span> {details?.endDate}
                    </div>
                    <div className="bg-secondary/50 px-3 py-1.5 rounded-sm border border-border">
                      {details?.days} Days Total
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Logistics Protections
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-sm border border-border bg-card/30">
                  <div className="w-2 h-2 rounded-full bg-accent glow-accent" />
                  <p className="text-xs uppercase tracking-widest flex-1">Damage Waiver Plus</p>
                  <p className="text-xs font-bold text-accent">INCLUDED</p>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-sm border border-border bg-card/30">
                  <div className="w-2 h-2 rounded-full bg-accent glow-accent" />
                  <p className="text-xs uppercase tracking-widest flex-1">24/7 Roadside Extraction</p>
                  <p className="text-xs font-bold text-accent">INCLUDED</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card className="bg-card border-border sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl tracking-tight uppercase">Order Totals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm uppercase tracking-widest">
                <span className="text-muted-foreground">Base Rental</span>
                <span>${details?.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm uppercase tracking-widest">
                <span className="text-muted-foreground">Logistics Fee</span>
                <span>$12.50</span>
              </div>
              <div className="flex justify-between text-sm uppercase tracking-widest">
                <span className="text-muted-foreground">Tax</span>
                <span>$0.00</span>
              </div>
              <div className="h-px bg-border my-4" />
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Total Amount Due</span>
                <span className="text-3xl font-bold glow-primary text-white">
                  ${(details ? details.totalPrice + 12.5 : 0).toFixed(2)}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6">
              <div className="w-full">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-4 text-center">Select Payment Vector</p>
                <PayPalPlaceholder 
                  amount={details ? details.totalPrice + 12.5 : 0} 
                  onComplete={handlePaymentComplete}
                />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
