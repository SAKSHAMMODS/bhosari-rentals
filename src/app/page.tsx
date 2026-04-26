
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BikeCard } from '@/components/BikeCard';
import { Button } from '@/components/ui/button';
import { ArrowDown, Package, ShieldCheck, Zap } from 'lucide-react';

const BIKES = [
  {
    id: '1',
    brand: 'Specialized',
    model: 'S-Works Tarmac SL8',
    type: 'Road',
    price: 85,
    description: 'The world\'s fastest race bike. Precision-engineered for performance.',
    imageUrl: PlaceHolderImages[0].imageUrl,
    imageHint: PlaceHolderImages[0].imageHint
  },
  {
    id: '2',
    brand: 'Santa Cruz',
    model: 'V10 Downhill',
    type: 'Mountain',
    price: 120,
    description: 'Gravity-defying suspension for the most technical terrain on earth.',
    imageUrl: PlaceHolderImages[1].imageUrl,
    imageHint: PlaceHolderImages[1].imageHint
  },
  {
    id: '3',
    brand: 'VanMoof',
    model: 'S5 Electric',
    type: 'Electric',
    price: 55,
    description: 'The ultimate urban stealth machine. Smart, fast, and connected.',
    imageUrl: PlaceHolderImages[2].imageUrl,
    imageHint: PlaceHolderImages[2].imageHint
  },
  {
    id: '4',
    brand: 'Canyon',
    model: 'Speedmax CFR',
    type: 'Triathlon',
    price: 150,
    description: 'Maximum aerodynamic efficiency. Built for absolute speed.',
    imageUrl: PlaceHolderImages[3].imageUrl,
    imageHint: PlaceHolderImages[3].imageHint
  },
  {
    id: '5',
    brand: 'Trek',
    model: 'Checkpoint SLR 9',
    type: 'Gravel',
    price: 70,
    description: 'The fastest gravel bike Trek has ever made. All-road dominance.',
    imageUrl: PlaceHolderImages[4].imageUrl,
    imageHint: PlaceHolderImages[4].imageHint
  },
  {
    id: '6',
    brand: 'Linus',
    model: 'Roadster Sport',
    type: 'City',
    price: 40,
    description: 'Classical elegance meets modern reliability. Perfect for urban cruising.',
    imageUrl: PlaceHolderImages[5].imageUrl,
    imageHint: PlaceHolderImages[5].imageHint
  }
];

export default function Home() {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10" />
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-none">
          ENGINEERED <br /> <span className="text-primary">FOR THE ROAD</span>
        </h1>
        <p className="max-w-2xl mx-auto text-muted-foreground text-lg mb-10 leading-relaxed uppercase tracking-widest text-sm">
          High-performance rental logistics for the modern explorer.
          Industrial-grade reliability. Professional support.
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
            <span className="text-xs uppercase tracking-[0.2em] font-bold">Instant Activation</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <ShieldCheck className="text-accent w-6 h-6" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold">Comprehensive Insurance</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Package className="text-accent w-6 h-6" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold">White-Glove Delivery</span>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">AVAILABLE FLEET</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">Active Inventory Status: Real-time</p>
          </div>
          <div className="flex gap-2">
            {['All', 'Road', 'Mountain', 'Electric'].map((cat) => (
              <Button key={cat} variant="outline" size="sm" className="text-[10px] uppercase tracking-widest border-border hover:border-primary transition-colors h-8">
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {BIKES.map((bike) => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 mt-32">
        <div className="bg-primary/5 border border-primary/20 rounded-sm p-12 text-center relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -z-10" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tighter uppercase">READY FOR DEPLOYMENT?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto uppercase tracking-widest text-xs">
            Join 5,000+ athletes and commuters who trust Velohub for their cycling logistics.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white glow-primary uppercase tracking-[0.2em] font-bold px-12 h-14">
            Sign Up Now
          </Button>
        </div>
      </section>
    </div>
  );
}
