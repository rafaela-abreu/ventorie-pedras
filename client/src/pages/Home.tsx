import SiteHeader from "@/components/site/SiteHeader";
import Hero from "@/components/site/Hero";
import InspirationMarquee from "@/components/site/InspirationMarquee";
import About from "@/components/site/About";
import Services from "@/components/site/Services";
import Catalog from "@/components/site/Catalog";
import ColorCatalog from "@/components/site/ColorCatalog";
import Process from "@/components/site/Process";
import Contact from "@/components/site/Contact";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFab from "@/components/site/WhatsAppFab";
import MusicPlayer from "@/components/site/MusicPlayer";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main>
        <Hero />
        <InspirationMarquee />
        <About />
        <Services />
        <Catalog />
        <ColorCatalog />
        <Process />
        <Contact />
      </main>
      <SiteFooter />
      <MusicPlayer />
      <WhatsAppFab />
    </div>
  );
}
