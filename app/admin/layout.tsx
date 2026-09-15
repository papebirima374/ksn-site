import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import NotificationToast from "@/components/layout/NotificationToast";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {/* Le theme est pose sur <html> AVANT la peinture.
       *
       *  Il etait applique dans un effet React, c'est-a-dire apres le premier
       *  rendu : l'espace s'affichait en clair, puis basculait en sombre. Un
       *  eclair blanc a chaque changement de page, pour ceux qui travaillent
       *  en sombre — et la nuit, il eblouit.
       *
       *  Ce script est volontairement minuscule et synchrone : le navigateur
       *  l'execute avant de peindre quoi que ce soit. Le try/catch couvre le
       *  mode navigation privee, ou localStorage peut lever. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(localStorage.getItem('admin-theme')==='dark')" +
            "document.documentElement.classList.add('dark')}catch(e){}",
        }}
      />
      {children}
      <NotificationToast />
    </AuthProvider>
  );
}
