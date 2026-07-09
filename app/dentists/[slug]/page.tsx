import { getDentistBySlug } from "@/features/dentist/data/mock-dentists";
import { DentistProfilePageContent } from "@/features/dentist/ui/dentist-profile-page-content";
import { PageLayout } from "@/widgets/page-layout/page-layout";

interface DentistProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DentistProfilePageProps) {
  const { slug } = await params;
  const dentist = getDentistBySlug(slug);

  if (!dentist) return { title: "Stomatoloq tapılmadı" };

  return {
    title: dentist.fullName,
    description: dentist.biography.az.slice(0, 150),
  };
}

export default async function DentistProfilePage({
  params,
}: DentistProfilePageProps) {
  const { slug } = await params;
  const dentist = getDentistBySlug(slug);

  if (!dentist) {
    return (
      <PageLayout>
        <DentistProfilePageContent slug={slug} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <DentistProfilePageContent slug={slug} />
    </PageLayout>
  );
}
