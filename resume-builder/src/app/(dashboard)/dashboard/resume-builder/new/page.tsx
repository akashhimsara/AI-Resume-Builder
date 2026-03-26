import { PageContainer } from "@/components/layout/page-container";

export default function NewResumePage() {
  return (
    <PageContainer
      title="Create Resume"
      description="This is where your resume creation form or template picker will be implemented."
    >
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
        <p className="text-sm text-slate-700">Resume creation UI will go here.</p>
      </div>
    </PageContainer>
  );
}
