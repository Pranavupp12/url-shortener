import { ResultHero } from '@/components/result-page/ResultHero';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Link Ready",
  description: "Your secure short link has been generated successfully.",
};
interface PageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function ResultPage({ params }: PageProps) {
  // We await params to get the value "success" (or a code)
  const { code } = await params;

  return (
    <div className="min-h-screen bg-white">
      <ResultHero initialCode={code} />
    </div>
  );
}