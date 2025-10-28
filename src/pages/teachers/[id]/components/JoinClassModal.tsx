
"use client"

import { LoadingPage } from "@/components/drake_libs/component/loading-page"
import { RenderFailedToast, RenderSuccessToast } from "@/components/drake_libs/customs/custom-toast"
import { Button } from "@/components/drake_libs/ui/button"
import { Checkbox } from "@/components/drake_libs/ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/drake_libs/ui/dialog"
import { Input } from "@/components/drake_libs/ui/input"
import { Label } from "@/components/drake_libs/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/drake_libs/ui/select"
import { useToast } from "@/components/hooks/use-toast"
import { useGraphQLMutation } from "@/components/hooks/useMutation"
import { Class, GetListClassResponse } from "@/models/class/class"
import { APIResponse, CommonResponse } from "@/models/common"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
interface JoinClassModalProps {
  isOpen: boolean
  onClose: () => void
  teacher_id: number
}

const joinClassHook = (teacherID: number) => {
  const { error, executeMutation, loading } = useGraphQLMutation();
  const [isSucess, setIsSuccess] = useState(false);
  const router = useRouter();

  const joinClass = async (class_id: number): Promise<APIResponse<"AddTeacherToClass"> | null> => {
    const query = `
      mutation{
        AddTeacherToClass(input: {
          class_id: ${class_id},
          teacher_id: ${teacherID}
        }){
          entity_id
          message
          status
        }
      }
    `;
    let data = await executeMutation<APIResponse<"AddTeacherToClass">>(query);
    if (!data || !data.AddTeacherToClass || !data.AddTeacherToClass.message) {
      console.log(data);
      console.log("Failed to join class");
      return null;
    }

    console.log("Successfully joined class");
    setIsSuccess(true);
    
    router.reload();

    return data;
  };


  return {
    joinClass, isSucess, loading
  }
};

export default function JoinClassModal({ isOpen, onClose, teacher_id }: JoinClassModalProps) {
  const { error, executeMutation, loading } = useGraphQLMutation();
  const [classes, setClasses] = useState<GetListClassResponse | null>(null);
  const selectedClassIDRef = useRef<number | null>(null);
  const { isSucess, joinClass, loading: joinClassLoading } = joinClassHook(teacher_id);
  const { toast } = useToast();
  useEffect(() => {
    console.log("fetching classes");
    const fetchClasses = async <T,>() => {
      let query = `
        query{
          GetListClass(input:{
            page: 1
            limit: -1,
            order_by:"id desc",
            where:{
                not_having_teacher: true
            }
          }){
            total
            data{
              class_id
              class_name
              description
              teacher_id
              start_date
              end_date
              max_students
              current_enrollment
              room_id
              schedule
              room{
                room_number
              }
              semester{
                semester_id
                semester_name
                start_date
                end_date
              }
            }
          }
        } 
      `

      const resp = await executeMutation<GetListClassResponse>(query);
      if (resp) {
        setClasses(s => { return resp });
      }

    };
    fetchClasses<GetListClassResponse>().catch(console.error);
  }, []);
  const handleFilterChange = (key: string, value: string | boolean) => {
    let idx: number = classes ? classes.GetListClass.data.findLastIndex((classItem: Class) => {
      return classItem.class_id === Number(value);
    }) : -1;

    if (idx !== -1) {
      selectedClassIDRef.current = classes ? classes.GetListClass.data[idx].class_id : -1
    }

    console.log("selectedClassIDRef.current: ", selectedClassIDRef.current);
  }

  const handleJoinClass = async () => {
    if (!selectedClassIDRef.current) {
      console.log("No class selected");
      toast({ ...RenderFailedToast("No class selected") });
      return;
    }
    const resp = await joinClass(selectedClassIDRef.current as number);
    if (!resp || resp.AddTeacherToClass.status !== "200") {
      toast({ ...RenderFailedToast(resp?.AddTeacherToClass.message || "Failed to join the class.") });
      return;
    }
    toast({ ...RenderSuccessToast("Successfully joined the class.") });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Other Class</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {loading || joinClassLoading ? <>
            <LoadingPage />
          </> : <>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grade" className="text-right">
                Classes
              </Label>
              <Select onValueChange={(value) => handleFilterChange("grade", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {
                    classes?.GetListClass.data.map((classItem: Class) => {
                      return <SelectItem key={classItem.class_id} value={`${classItem.class_id}`}>{classItem.class_name}</SelectItem>
                    })
                  }
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="openOnly"
                checked={false}
                onCheckedChange={(checked) => handleFilterChange("openOnly", checked)}
              />
              <Label htmlFor="openOnly">Show only open classes</Label>
            </div>
          </>}
        </div>

        <DialogFooter className="justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => {
            handleJoinClass();
          }}>Join</Button>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  )
}

