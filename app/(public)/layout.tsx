import Background from "@/components/layout/Background";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import { I18nProvider } from "@/lib/i18n/context";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <main className="relative min-h-screen overflow-hidden bg-[#082F22]">
        <Background />
        <Navbar />
        {children}
        <Footer />
        <WhatsAppFloat />
      </main>
    </I18nProvider>
  );
}
