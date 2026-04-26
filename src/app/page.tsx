
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
    description: PlaceHolderImages[0].description,
    imageUrl: PlaceHolderImages[0].imageUrl,
    imageHint: PlaceHolderImages[0].imageHint
  },
  {
    id: 'hayabusa',
    brand: 'Suzuki',
    model: 'Hayabusa',
    type: 'Superbike',
    price: 8500,
    description: PlaceHolderImages[1].description,
    imageUrl: PlaceHolderImages[1].imageUrl,
    imageHint: PlaceHolderImages[1].imageHint
  },
  {
    id: 'himalayan',
    brand: 'Royal Enfield',
    model: 'Himalayan',
    type: 'Adventure',
    price: 1800,
    description: PlaceHolderImages[2].description,
    imageUrl: PlaceHolderImages[2].imageUrl,
    imageHint: PlaceHolderImages[2].imageHint
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
          Fixed 7-day rental blocks for premium motorcycle logistics. 
          Standardized deployment. Professional fleet only.
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

      {/* CTA Section */}
      <section className="container mx-auto px-4 mt-32">
        <div className="bg-primary/5 border border-primary/20 rounded-sm p-12 text-center relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -z-10" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tighter uppercase">READY FOR THE LONG HAUL?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto uppercase tracking-widest text-xs">
            Join the elite circle of riders who trust Velohub for weekly motorcycle logistics.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white glow-primary uppercase tracking-[0.2em] font-bold px-12 h-14">
            Register Profile
          </Button>
        </div>
      </section>
    </div>
  );
}
