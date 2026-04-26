
"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bike, Gauge, Activity, ArrowRight } from 'lucide-react';
import { BookingModal } from '@/components/BookingModal';
import { useState } from 'react';

interface BikeProps {
  id: string;
  brand: string;
  model: string;
  type: string;
  price: number;
  description: string;
  imageUrl: string;
  imageHint: string;
}

export function BikeCard({ bike }: { bike: BikeProps }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300">
      <div className="relative h-64 w-full overflow-hidden bg-secondary">
        <Image
          src={bike.imageUrl}
          alt={bike.model}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint={bike.imageHint}
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-background/80 backdrop-blur-sm border-border text-accent uppercase tracking-tighter">
            ${bike.price} <span className="text-[10px] text-muted-foreground ml-1">/DAY</span>
          </Badge>
        </div>
      </div>
      
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold">{bike.brand}</p>
            <CardTitle className="text-xl tracking-tight group-hover:text-primary transition-colors">{bike.model}</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-secondary/50 text-[10px] uppercase tracking-widest h-5">
            {bike.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
          {bike.description}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
            <Gauge className="w-3 h-3" /> Professional Grade
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
            <Activity className="w-3 h-3" /> Fully Serviced
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-secondary hover:bg-primary hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-xs font-bold border-border"
        >
          Inspect & Book
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>

      <BookingModal 
        bike={bike} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </Card>
  );
}
