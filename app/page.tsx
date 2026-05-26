import Background from "@/components/layout/Background";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import AppKSN from "@/components/sections/AppKSN";
import Commissions from "@/components/sections/Commissions";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import LeDahira from "@/components/sections/LeDahira";
import Media from "@/components/sections/Media";
import Presidence from "@/components/sections/Presidence";
import ReseauxSociaux from "@/components/sections/ReseauxSociaux";
import Spiritualite from "@/components/sections/Spiritualite";
import Stats from "@/components/sections/Stats";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#082F22]">
      <Background />

      <Navbar />

      <Hero />
      <Stats />
      <Presidence />
      <LeDahira />
      <Commissions />
      <Media />
      <AppKSN />
      <ReseauxSociaux />
      <Contact />
      <Spiritualite />

      <Footer />

      <WhatsAppFloat />
    </main>
  );
}
