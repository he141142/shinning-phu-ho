"use client";
import { LoadingPage } from "@/components/drake_libs/component/loading-page";
import { ClassDetailComponent } from "./components/class-detail";
import { useRouter, useParams } from "next/navigation";

export default function Page() {
  const param = useParams();

  if (!param || !param["slug"]) {
    return <LoadingPage />;
  }

  console.log(param['slug']);
  

  // Prevent rendering logic until router is ready and slug is available
  // if (!param.slug || !router.query.slug) {
  //   return <LoadingPage />
  // }

  return (
    <ClassDetailComponent
      key={param["slug"] as string}
      slug={param["slug"] as string}
    />
  );
}
