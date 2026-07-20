import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { CertificationsExperience } from "@/components/certifications/CertificationsExperience";
import { getCertificates } from "@/lib/content";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "Machine learning, cloud, and backend credentials — a quiet certificate wall.",
};

export default function CertificationsPage() {
  const certificates = getCertificates();

  return (
    <AppShell>
      <CertificationsExperience certificates={certificates} />
    </AppShell>
  );
}
