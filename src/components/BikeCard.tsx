"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

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
  return (
    <Card className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300">
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-secondary">
        <Image
          src={bike.imageUrl}
          alt={bike.model}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint={bike.imageHint}
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-background/80 backdrop-blur-sm border-border text-accent uppercase tracking-tighter text-[10px] md:text-xs">
            ₹{bike.price} <span className="text-[8px] md:text-[10px] text-muted-foreground ml-1">/DAY</span>
          </Badge>
        </div>
      </div>
      
      <CardHeader className="space-y-1 p-4 md:p-6 pb-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <p className="text-[9px] md:text-[10px] text-primary uppercase tracking-[0.2em] font-bold">{bike.brand}</p>
            <CardTitle className="text-lg md:text-xl tracking-tight group-hover:text-primary transition-colors truncate">{bike.model}</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-secondary/50 text-[8px] md:text-[10px] uppercase tracking-widest h-5 shrink-0">
            {bike.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6 pt-0">
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
          {bike.description}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider">
            <Clock className="w-3 h-3 shrink-0" /> 7-Day Block
          </div>
          <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider">
            <Activity className="w-3 h-3 shrink-0" /> Professional
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 md:p-6 pt-0">
        <Link href={`/book/${bike.id}`} className="w-full">
          <Button 
            className="w-full bg-secondary hover:bg-primary hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold border-border h-10"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
