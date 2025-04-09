import HeroSection from '@/Components/GiftHeroSection';
import FeaturedGifts from '@/Components/FeaturedGifts';
import GiftTips from '@/Components/GiftTips';

export default function GiftPage() {
  return (
    <div className="p-6 space-y-10">
      <HeroSection />
      <FeaturedGifts />
      <GiftTips />
    </div>
  );
}
