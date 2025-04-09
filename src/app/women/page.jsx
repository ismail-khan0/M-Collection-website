import HeroSection from '@/Components/Men/HeroSection';
import CategoryGrid from '@/Components/Men/CategoryGrid';
import Carousel from '@/Components/Men/Carousel';
import ShopByCategory from '@/Components/Men/ShopByCategory';
import image1 from '../../../public/Image/Pic1.webp';
import image2 from '../../../public/Image/Pic2.webp';

const WomEN_API = "https://fakestoreapi.com/products";

const  WomenPage = () => (
  <div className="bg-gray-100 font-sans mx-4">
    <main>
    <HeroSection image1={image1} image2={image2} />
      <CategoryGrid apiUrl={WomEN_API} start='14' end='20' />
      <Carousel apiUrl={WomEN_API} sectionTitle="Men" />
      <ShopByCategory apiUrl={WomEN_API} />
    </main>
  </div>
);

export default WomenPage;
