"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BIKES } from '@/lib/bikes';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Loader2, Bike as BikeIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function MyBikesPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'bookings'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);

  const { data: bookings, isLoading: isBookingsLoading } = useCollection(bookingsQuery);

  if (isUserLoading || isBookingsLoading) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Accessing Rental Records...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold mb-4 uppercase">Identity Required</h1>
        <p className="text-muted-foreground mb-8 text-sm uppercase tracking-widest">Authorized operatives only. Please log in to view fleet assignments.</p>
        <Link href="/login">
          <button className="bg-primary text-white px-8 py-3 font-bold uppercase tracking-widest text-xs glow-primary">
            Authenticate
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-2">MY FLEET</h1>
        <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-[0.4em]">Active Assignments & Operational History</p>
      </header>

      {!bookings || bookings.length === 0 ? (
        <Card className="bg-card/50 border-dashed border-border py-20 text-center">
          <CardContent className="space-y-4">
            <div className="bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <BikeIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold uppercase">No Active Rentals</h2>
            <p className="text-muted-foreground text-xs uppercase tracking-widest max-w-xs mx-auto">
              Your fleet assignment is currently empty. Visit the catalog to reserve a high-performance unit.
            </p>
            <Link href="/" className="inline-block mt-6">
              <button className="bg-primary text-white px-8 py-3 font-bold uppercase tracking-widest text-xs glow-primary">
                Explore Fleet
              </button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((booking) => {
            const bike = BIKES.find(b => b.id === booking.bikeId);
            if (!bike) return null;

            return (
              <Card key={booking.id} className="bg-card border-border overflow-hidden hover:border-primary/50 transition-colors group">
                <div className="relative h-48 w-full bg-secondary">
                  <Image
                    src={bike.imageUrl}
                    alt={bike.model}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-background/80 backdrop-blur-md border-border text-accent uppercase text-[10px] tracking-widest">
                      {booking.status}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-[9px] text-primary font-bold uppercase tracking-widest">{bike.brand}</p>
                      <CardTitle className="text-xl tracking-tight uppercase">{bike.model}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="font-mono text-[9px] uppercase text-muted-foreground truncate">
                    ID: {booking.id}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-8 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[8px] text-muted-foreground uppercase tracking-widest font-bold">
                        <Calendar className="w-3 h-3" /> Start Date
                      </div>
                      <p className="text-xs font-bold uppercase">{booking.startDate}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="flex items-center gap-2 text-[8px] text-muted-foreground uppercase tracking-widest font-bold justify-end">
                        <Clock className="w-3 h-3" /> End Date
                      </div>
                      <p className="text-xs font-bold uppercase">{booking.endDate}</p>
                    </div>
                  </div>
                  
                  <div className="h-px bg-border w-full" />
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold">Total Settled</p>
                      <p className="text-lg font-bold text-white tracking-tighter">₹{booking.totalPrice?.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-accent uppercase tracking-widest font-bold">
                      <MapPin className="w-3 h-3" /> Active Protocol
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
