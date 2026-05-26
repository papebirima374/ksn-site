import Background from "@/components/layout/Background";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#082F22]">
      <Background />
      <Navbar />
      {children}
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
