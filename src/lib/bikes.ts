
import placeholderData from '@/app/lib/placeholder-images.json';

export interface Bike {
  id: string;
  brand: string;
  model: string;
  type: string;
  price: number;
  description: string;
  imageUrl: string;
  imageHint: string;
}

const images = placeholderData.placeholderImages;

export const BIKES: Bike[] = [
  {
    id: 'classic-350',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    type: 'Cruiser',
    price: 150,
    description: images.find(img => img.id === 'classic-350')?.description || "",
    imageUrl: images.find(img => img.id === 'classic-350')?.imageUrl || "",
    imageHint: images.find(img => img.id === 'classic-350')?.imageHint || ""
  },
  {
    id: 'hayabusa',
    brand: 'Suzuki',
    model: 'Hayabusa',
    type: 'Superbike',
    price: 200,
    description: images.find(img => img.id === 'hayabusa')?.description || "",
    imageUrl: images.find(img => img.id === 'hayabusa')?.imageUrl || "",
    imageHint: images.find(img => img.id === 'hayabusa')?.imageHint || ""
  },
  {
    id: 'himalayan',
    brand: 'Royal Enfield',
    model: 'Himalayan',
    type: 'Adventure',
    price: 180,
    description: images.find(img => img.id === 'himalayan')?.description || "",
    imageUrl: images.find(img => img.id === 'himalayan')?.imageUrl || "",
    imageHint: images.find(img => img.id === 'himalayan')?.imageHint || ""
  }
];
