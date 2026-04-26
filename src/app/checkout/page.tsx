
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
import { PayPalPlaceholder } from '@/components/PayPalPlaceholder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      setConfirmationId(`BR-${Math.random().toString(36).substring(2, 11)}`.toUpperCase());
    } catch (e) {
      router.push('/');
    }
  }, [router, isSuccess]);

  const saveBookingToFirestore = (paymentId: string) => {
    if (!details || !user || !db) return;
    const bookingId = confirmationId;
    const bookingRef = doc(db, 'users', user.uid, 'bookings', bookingId);
    setDocumentNonBlocking(bookingRef, {
      id: bookingId,
      bikeId: details.bikeId,
      userId: user.uid,
      startDate: details.startDate,
      endDate: details.endDate,
      totalPrice: (details.totalPrice || 0) + 500,
      bookingDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      status: 'confirmed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      payment_id: paymentId
    }, { merge: true });
    setIsSuccess(true);
    sessionStorage.removeItem('pendingRental');
    toast({
      title: "BOOKING CONFIRMED",
      description: "Payment captured successfully.",
    });
  };

  const handleRazorpayPayment = () => {
    if (!details || !user || !db) return;
    setIsProcessing(true);
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SiB4ZzRprgn4b8",
      amount: ((details.totalPrice || 0) + 500) * 100,
      currency: "INR",
      name: "BHOSARI RENTALS",
      description: `${details.brand} ${details.model}`,
      handler: function (response: any) {
        saveBookingToFirestore(response.razorpay_payment_id);
      },
      prefill: {
        name: details.customer.name,
        email: details.customer.email,
        contact: details.customer.phone,
      },
      theme: { color: "#147AEB" },
      modal: { ondismiss: () => setIsProcessing(false) }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', (response: any) => {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "PAYMENT FAILED",
        description: response.error.description,
      });
    });
    rzp1.open();
  };

  const handlePayPalSuccess = () => {
    saveBookingToFirestore(`PP-${Math.random().toString(36).substring(2, 11).toUpperCase()}`);
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
            Your high-performance unit is secured.
          </p>
          <div className="bg-secondary/50 p-4 md:p-6 rounded-sm border border-border mb-8 text-left space-y-4">
            <div>
              <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Confirmation ID</p>
              <p className="font-mono text-xs md:text-sm uppercase text-white truncate">{confirmationId}</p>
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
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Initializing...</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Link href={`/book/${details.bikeId}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 uppercase tracking-widest text-xs font-bold">
        <ArrowLeft className="w-4 h-4" /> Edit
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-7 space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase">SECURE CHECKOUT</h1>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">{details.brand}</p>
                  <h3 className="text-xl font-bold">{details.model}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">₹{details.pricePerDay} / day</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs uppercase tracking-widest font-bold">
                <div className="bg-secondary/50 p-4 rounded-sm border border-border">
                  <span className="text-muted-foreground block text-[8px] mb-1">Start</span>
                  {details.startDate}
                </div>
                <div className="bg-secondary/50 p-4 rounded-sm border border-border">
                  <span className="text-muted-foreground block text-[8px] mb-1">End</span>
                  {details.endDate}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-5">
          <Card className="bg-card border-border shadow-2xl">
            <CardHeader><CardTitle className="text-xl uppercase">Total</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm uppercase tracking-widest">
                <span>Base ({details.days} Days)</span>
                <span>₹{details.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm uppercase tracking-widest">
                <span>Fee</span>
                <span>₹500.00</span>
              </div>
              <div className="h-px bg-border my-4" />
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-primary">Total Amount Due</span>
                <span className="text-3xl font-bold text-white">₹{(details.totalPrice + 500).toLocaleString()}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6 pb-8">
              <Tabs defaultValue="razorpay" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-secondary/50 mb-6">
                  <TabsTrigger value="razorpay" className="uppercase text-[10px]">Razorpay</TabsTrigger>
                  <TabsTrigger value="paypal" className="uppercase text-[10px]">PayPal</TabsTrigger>
                </TabsList>
                <TabsContent value="razorpay">
                  <Button onClick={handleRazorpayPayment} disabled={isProcessing} className="w-full h-14 bg-primary uppercase tracking-widest font-bold">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <CreditCard className="w-5 h-5 mr-2" />} PAY NOW
                  </Button>
                </TabsContent>
                <TabsContent value="paypal">
                  <PayPalPlaceholder amount={details.totalPrice + 500} onComplete={handlePayPalSuccess} />
                </TabsContent>
              </Tabs>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
