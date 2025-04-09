
import HeroSection from '@/Components/Men/HeroSection';
import CategoryGrid from '@/Components/Men/CategoryGrid';
import Carousel from '@/Components/Men/Carousel';
import ShopByCategory from '@/Components/Men/ShopByCategory';
import image1 from '../../public/Image/Pic1.webp';
import image2 from '../../public/Image/Pic2.webp';

const MEN_API = "https://fakestoreapi.com/products";

const HomePage = () => (
  <div className="bg-gray-100 font-sans mx-4">
    <main>
    <HeroSection image1={image1} image2={image2} />
      <CategoryGrid apiUrl={MEN_API} start='0' end='12' />
      <Carousel apiUrl={MEN_API} sectionTitle="Home" />
      <ShopByCategory apiUrl={MEN_API} />
    </main>
  </div>
);

export default HomePage;
