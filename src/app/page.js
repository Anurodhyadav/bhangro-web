import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyBhangro from "@/components/WhyBhangro";
import FeaturedProducts from "@/components/FeaturedProducts";
import About from "@/components/About";
import SocialLocation from "@/components/SocialLocation";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhyBhangro />
        <FeaturedProducts />
        <About />
        <SocialLocation />
      </main>
      <Footer />
    </>
  );
}