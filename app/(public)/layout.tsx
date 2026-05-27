import Background from "@/components/layout/Background";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import CartDrawer from "@/components/boutique/CartDrawer";
import CartBadge from "@/components/boutique/CartBadge";
import { I18nProvider } from "@/lib/i18n/context";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <AuthProvider>
        <CartProvider>
          <main className="relative min-h-screen overflow-hidden bg-[#082F22]">
            <Background />
            <Navbar />
            {children}
            <Footer />
            <WhatsAppFloat />
            <CartBadge />
            <CartDrawer />
          </main>
        </CartProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
