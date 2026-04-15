import { SubjectDetailPage } from "@/features/subjects/components/SubjectDetailPage";

export default function SubjectDetailPageRoute({ params }: { params: { id: string } }) {
  return <SubjectDetailPage subjectId={params.id} />;
}
