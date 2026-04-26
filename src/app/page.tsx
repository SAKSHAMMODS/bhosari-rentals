import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BikeCard } from '@/components/BikeCard';
import { Button } from '@/components/ui/button';
import { ArrowDown, Package, ShieldCheck, Zap } from 'lucide-react';

const BIKES = [
  {
    id: 'classic-350',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    type: 'Cruiser',
    price: 1200,
    description: "Royal Enfield Classic 350 - Timeless design meets modern engineering. Ideal for city cruising and relaxed long-distance riding.",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-9741197854-fd9d5.firebasestorage.app/o/download.webp?alt=media&token=7b4ca477-2d86-442d-a097-0f03a70b5124",
    imageHint: "Classic Motorcycle"
  },
  {
    id: 'hayabusa',
    brand: 'Suzuki',
    model: 'Hayabusa',
    type: 'Superbike',
    price: 8500,
    description: "Suzuki Hayabusa - The ultimate sportbike. Legendary aerodynamic performance and unmatched power for rapid transport.",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-9741197854-fd9d5.firebasestorage.app/o/download.jpg?alt=media&token=ac917ed7-b87c-4b5c-9884-a031a35199d1",
    imageHint: "Suzuki Hayabusa"
  },
  {
    id: 'himalayan',
    brand: 'Royal Enfield',
    model: 'Himalayan',
    type: 'Adventure',
    price: 1800,
    description: "Royal Enfield Himalayan - Built for all roads, and no roads. Specialized for rugged terrain and adventure-focused exploration.",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-9741197854-fd9d5.firebasestorage.app/o/download%20(1).jpg?alt=media&token=866cc6c8-7b20-4216-b920-73cdb591852e",
    imageHint: "Adventure Motorcycle"
  }
];

export default function Home() {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10" />
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-none">
          7-DAY RENTAL <br /> <span className="text-primary">SPECIALISTS</span>
        </h1>
        <p className="max-w-2xl mx-auto text-muted-foreground text-lg mb-10 leading-relaxed uppercase tracking-widest text-sm">
          Fixed 7-day rental blocks for premium motorcycle experiences. 
          Standardized fleet. Professional service only.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white glow-primary uppercase tracking-[0.2em] font-bold px-10 h-14">
            View Fleet
          </Button>
          <Button size="lg" variant="outline" className="border-border uppercase tracking-[0.2em] font-bold px-10 h-14">
            Our Mission
          </Button>
        </div>
        <div className="mt-20 flex justify-center animate-bounce text-muted-foreground">
          <ArrowDown className="w-6 h-6" />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-border bg-card/30 backdrop-blur-sm py-10 mb-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <Zap className="text-accent w-6 h-6" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold">Standard 7-Day Term</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <ShieldCheck className="text-accent w-6 h-6" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold">All-India Coverage</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Package className="text-accent w-6 h-6" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold">Maintenance Included</span>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section id="fleet" className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">ACTIVE FLEET</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">Duration: Fixed 7-Day Rental Blocks Only</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {BIKES.map((bike) => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>
      </section>
    </div>
  );
}
