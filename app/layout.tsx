import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DeploymentVersionWatcher } from "@/components/DeploymentVersionWatcher";
import { getDeploymentVersion } from "@/lib/deployment-version";
import { SITE_URL } from "@/lib/site";
import "./globals.css";
import "./mobile.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Kim's Nails | Luxury nail care celebrating Black beauty",
  description: "Thoughtful, artful nail care in Stonecrest, Georgia, celebrating Black and African American beauty.",
  openGraph: { title: "Kim's Nails | Luxury nail care celebrating Black beauty", description: "Thoughtful, artful nail care in Stonecrest, Georgia, celebrating Black and African American beauty.", type: "website", locale: "en_US", url: SITE_URL },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const deploymentVersion = getDeploymentVersion();

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col"><DeploymentVersionWatcher currentVersion={deploymentVersion} />{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "NailSalon", name: "Kim's Nails", url: SITE_URL, description: "Thoughtful, artful nail care celebrating Black and African American beauty." }) }} /></body>
    </html>
  );
}
