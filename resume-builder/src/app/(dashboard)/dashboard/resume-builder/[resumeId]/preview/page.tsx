import { PageContainer } from "@/components/layout/page-container";

type PreviewResumePageProps = {
  params: Promise<{ resumeId: string }>;
};

export default async function PreviewResumePage({ params }: PreviewResumePageProps) {
  const { resumeId } = await params;

  return (
    <PageContainer
      title="Resume Preview"
      description={`Preview for resume ${resumeId}. This page can render the selected template and print export actions.`}
    >
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
        <p className="text-sm text-slate-700">Resume preview UI will go here.</p>
      </div>
    </PageContainer>
  );
}
