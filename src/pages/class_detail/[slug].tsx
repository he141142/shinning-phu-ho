
import { ClassDetailComponent } from '@/components/drake_libs/class-detail'
import { LoadingPage } from '@/components/drake_libs/component/loading-page';
import { useRouter } from 'next/router'
 
export default function Page() {
  const router = useRouter();
    // Prevent rendering logic until `slug` is available
    if (!router.query.slug) {
      return <LoadingPage />
    }
  
  return <ClassDetailComponent slug={router.query.slug as string} />
}