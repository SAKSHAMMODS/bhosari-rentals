"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, Loader2, Mail, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import Script from 'next/script';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { format } from 'date-fns';

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

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const [details, setDetails] = useState<RentalDetails | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const rawData = sessionStorage.getItem('pendingRental');
    
    if (!rawData) {
      if (!isSuccess) router.push('/');
      return;
    }

    try {
      const parsedData = JSON.parse(rawData);
      setDetails(parsedData);
      setConfirmationId(`VH-${Math.random().toString(36).substring(2, 11)}`.toUpperCase());
    } catch (e) {
      console.error("Failed to parse rental details", e);
      router.push('/');
    }
  }, [router, isSuccess]);

  const handleRazorpayPayment = () => {
    if (!details || !user || !db) return;

    setIsProcessing(true);

    const serviceFee = 500;
    const finalAmountINR = (details.totalPrice || 0) + serviceFee;
    
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SiB4ZzRprgn4b8",
      amount: finalAmountINR * 100,
      currency: "INR",
      name: "Velohub Rentals",
      description: `${details.brand} ${details.model} - ${details.days} Day Rental`,
      image: "https://firebasestorage.googleapis.com/v0/b/studio-9741197854-fd9d5.firebasestorage.app/o/download.webp?alt=media&token=7b4ca477-2d86-442d-a097-0f03a70b5124",
      handler: function (response: any) {
        // Save booking to Firestore
        const bookingId = confirmationId;
        const bookingRef = doc(db, 'users', user.uid, 'bookings', bookingId);
        
        setDocumentNonBlocking(bookingRef, {
          id: bookingId,
          bikeId: details.bikeId,
          userId: user.uid,
          startDate: details.startDate,
          endDate: details.endDate,
          totalPrice: finalAmountINR,
          bookingDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          status: 'confirmed',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          razorpay_payment_id: response.razorpay_payment_id
        }, { merge: true });

        setIsSuccess(true);
        sessionStorage.removeItem('pendingRental');
        toast({
          title: "BOOKING CONFIRMED",
          description: "Payment captured. ID: " + response.razorpay_payment_id,
        });
      },
      prefill: {
        name: details.customer.name,
        email: details.customer.email,
        contact: details.customer.phone,
      },
      theme: {
        color: "#147AEB",
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response: any) {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "PAYMENT FAILED",
        description: response.error.description,
      });
    });
    rzp1.open();
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

          <Link href="/my-bikes">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white uppercase tracking-[0.2em] font-bold h-12 text-xs">
              View My Rentals
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

  const serviceFee = 500;
  const finalAmountINR = (details.totalPrice || 0) + serviceFee;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
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
                    <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{details.days} Day Rental</p>
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
                <span className="text-muted-foreground">Base Rental ({details.days} Days)</span>
                <span>₹{details.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm uppercase tracking-widest">
                <span className="text-muted-foreground">Service Fee</span>
                <span>₹{serviceFee.toLocaleString()}.00</span>
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
                
                <Button 
                  onClick={handleRazorpayPayment}
                  disabled={isProcessing}
                  className="w-full bg-primary hover:bg-primary/90 text-white uppercase tracking-[0.2em] font-bold py-8 text-[12px] md:text-sm flex items-center justify-center gap-3 glow-primary"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CreditCard className="w-5 h-5" />
                  )}
                  {isProcessing ? "PROCESSING..." : "PAY WITH RAZORPAY"}
                </Button>
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