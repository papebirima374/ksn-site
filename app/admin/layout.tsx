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
      {children}
      <NotificationToast />
    </AuthProvider>
  );
}
