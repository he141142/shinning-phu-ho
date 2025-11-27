import { StudentSkeleton } from "@/components/drake_libs/component/skeletons/student-skeleton";

export const RenderStudentSkeletons = (amount: number) => {
  const skeletons = [];
  for (let i = 0; i < amount; i++) {
    skeletons.push(<StudentSkeleton />);
  }
  return skeletons;
};
