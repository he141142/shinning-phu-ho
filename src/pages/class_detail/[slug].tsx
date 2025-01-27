
import { ClassDetailComponent } from '@/components/drake_libs/class-detail'
import { useRouter } from 'next/router'
 
export default function Page() {
  const router = useRouter();
  
  return <ClassDetailComponent slug={router.query.slug as string} />
}