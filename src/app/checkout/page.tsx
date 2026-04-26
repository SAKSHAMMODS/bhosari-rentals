"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface RentalDetails {
  bikeId: string;
  brand: string;
  model: string;
  pricePerDay: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  days: number;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [details, setDetails] = useState<RentalDetails | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string>("");

  useEffect(() => {
    // Only run on client
    const rawData = sessionStorage.getItem('pendingRental');
    
    if (!rawData) {
      if (!isSuccess) router.push('/');
      return;
    }

    try {
      const parsedData = JSON.parse(rawData);
      setDetails(parsedData);
      // Generate a unique ID after hydration to avoid mismatch
      setConfirmationId(`VH-${Math.random().toString(36).substring(2, 11)}`.toUpperCase());
    } catch (e) {
      console.error("Failed to parse rental details", e);
      router.push('/');
    }
  }, [router, isSuccess]);

  const handlePaymentSuccess = (paymentDetails: any) => {
    setIsSuccess(true);
    sessionStorage.removeItem('pendingRental');
    toast({
      title: "BOOKING CONFIRMED",
      description: "Electronic documentation transmitted.",
    });
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-32 flex justify-center">
        <Card className="max-w-md w-full text-center bg-card border-border p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary glow-primary" />
          <div className="flex justify-center mb-6">
            <div className="bg-primary/20 p-4 rounded-full">
              <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-primary glow-primary" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 tracking-tighter uppercase">ORDER SUCCESSFUL</h1>
          <p className="text-muted-foreground uppercase tracking-widest text-[9px] md:text-[10px] mb-8 leading-relaxed px-2">
            Your high-performance unit is secured. Electronic documents and pick-up protocols have been dispatched.
          </p>
          
          <div className="bg-secondary/50 p-4 md:p-6 rounded-sm border border-border mb-8 text-left space-y-4">
            <div>
              <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Confirmation ID</p>
              <p className="font-mono text-xs md:text-sm uppercase text-white truncate">{confirmationId || "VH-*********"}</p>
            </div>
            <div className="flex items-start gap-2 pt-2 border-t border-border">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground leading-normal">
                Transmitted to: <span className="text-white font-bold block md:inline">{details?.customer.email || 'Authorized Email'}</span>
              </p>
            </div>
          </div>

          <Link href="/">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white uppercase tracking-[0.2em] font-bold h-12 text-xs">
              Return to Fleet
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!details) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Initializing Secure Session...</p>
    </div>
  );

  const finalAmountINR = (details.totalPrice || 0) + 500;
  const finalAmountUSD = (finalAmountINR / 80).toFixed(2);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Link href={`/book/${details.bikeId}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 md:mb-8 uppercase tracking-widest text-[10px] md:text-xs font-bold">
        <ArrowLeft className="w-4 h-4" /> Edit Configuration
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-7 space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase">SECURE CHECKOUT</h1>
          
          <section className="space-y-4">
            <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-primary flex items-center gap-2">
              <Truck className="w-4 h-4" /> Equipment & Schedule
            </h2>
            <Card className="bg-card border-border">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{details.brand}</p>
                    <h3 className="text-lg md:text-xl font-bold">{details.model}</h3>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto p-3 sm:p-0 bg-secondary/30 sm:bg-transparent rounded-sm border border-border sm:border-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-accent">₹{details.pricePerDay} / day</p>
                    <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest mt-1">7-Day Rental Block</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] md:text-xs uppercase tracking-widest font-bold">
                  <div className="bg-secondary/50 p-4 rounded-sm border border-border">
                    <span className="text-muted-foreground block text-[8px] mb-1">Deployment Date</span>
                    {details.startDate}
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-sm border border-border">
                    <span className="text-muted-foreground block text-[8px] mb-1">Return Date</span>
                    {details.endDate}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-primary flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Authorized Operative
            </h2>
            <Card className="bg-card border-border">
              <CardContent className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Identification</p>
                  <p className="text-[10px] md:text-xs font-bold uppercase truncate">{details.customer.name}</p>
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Transmission</p>
                  <p className="text-[10px] md:text-xs font-bold uppercase truncate">{details.customer.email}</p>
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Comm Link</p>
                  <p className="text-[10px] md:text-xs font-bold uppercase">{details.customer.phone}</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="lg:col-span-5">
          <Card className="bg-card border-border lg:sticky lg:top-24 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl tracking-tight uppercase">Order Totals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-xs md:text-sm uppercase tracking-widest">
                <span className="text-muted-foreground">Base Rental</span>
                <span>₹{details.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm uppercase tracking-widest">
                <span className="text-muted-foreground">Service Fee</span>
                <span>₹500.00</span>
              </div>
              <div className="h-px bg-border my-4" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-primary">Total Amount Due</span>
                <span className="text-2xl md:text-3xl font-bold glow-primary text-white">
                  ₹{finalAmountINR.toLocaleString()}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6 pb-8">
              <div className="w-full">
                <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest mb-4 text-center">Authorized Gateway Only</p>
                
                <PayPalScriptProvider options={{ 
                  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "AfisfrZDGuLvnkhYyuRR5gidAmvmf_ecff1JoDMriEgdIkeJ84QJ-yD2L_UpZtjiFhZhoSNdXGCQlRGD",
                  currency: "USD" 
                }}>
                  <div className="min-h-[150px]">
                    <PayPalButtons
                      style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [{
                            amount: {
                              currency_code: "USD",
                              value: finalAmountUSD,
                            },
                            description: `VH: ${details.brand} ${details.model}`
                          }],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        if (actions.order) {
                          const paymentDetails = await actions.order.capture();
                          handlePaymentSuccess(paymentDetails);
                        }
                      }}
                      onError={(err) => {
                        console.error("PayPal Error:", err);
                        toast({
                          variant: "destructive",
                          title: "PAYMENT ERROR",
                          description: "Transaction rejected. Verify source.",
                        });
                      }}
                    />
                  </div>
                </PayPalScriptProvider>
              </div>
              <p className="text-[8px] md:text-[9px] text-center text-muted-foreground uppercase tracking-widest">
                Protocol: Secure P2P Encrypted Transfer Active
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
