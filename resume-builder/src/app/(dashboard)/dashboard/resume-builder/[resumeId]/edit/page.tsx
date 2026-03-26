import { PageContainer } from "@/components/layout/page-container";

type EditResumePageProps = {
  params: Promise<{ resumeId: string }>;
};

export default async function EditResumePage({ params }: EditResumePageProps) {
  const { resumeId } = await params;

  return (
    <PageContainer
      title="Edit Resume"
      description={`Editing resume ${resumeId}. Connect this page to your form editor and autosave flow.`}
    >
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
        <p className="text-sm text-slate-700">Resume editing UI will go here.</p>
      </div>
    </PageContainer>
  );
}
