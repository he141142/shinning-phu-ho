"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Eye, LogOut } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/drake_libs/ui/table"
import { Button } from "@/components/drake_libs/ui/button"
import JoinClassModal from "./JoinClassModal"
import { ClassSectionProps } from "./classsection"
import { ModalType, UseModal } from "@/components/hooks/useModal"
import { ConfirmModal } from "@/pages/class_detail/components/confirm-modal"
import { useRouter } from "next/router"
import { useGraphQLMutation } from "@/components/hooks/useMutation"
import { Card } from "@/components/drake_libs/ui/card"

interface Class {
  id: string
  name: string
  totalEnrollment: number
  status: "Open" | "Closed" | "Full"
}

const classes: Class[] = [
  { id: "CS101", name: "Introduction to Computer Science", totalEnrollment: 50, status: "Open" },
  { id: "MATH201", name: "Linear Algebra", totalEnrollment: 40, status: "Open" },
  { id: "ENG102", name: "English Composition", totalEnrollment: 30, status: "Full" },
  { id: "PHYS301", name: "Quantum Mechanics", totalEnrollment: 25, status: "Closed" },
  { id: "BIO150", name: "Cell Biology", totalEnrollment: 35, status: "Open" },
]


const dropOutHook = (onDropout: () => void, teacherID: number) => {

  const router = useRouter();
  const { error, executeMutation, loading } = useGraphQLMutation();

  const { closeModal, isOpen, openModal, modalType } = UseModal();
  const selectedClassIDRef = useRef<number | null>(null);

  //TODO: remove console.log
  const handleDropout = (class_id: number) => {
    openModal(ModalType.ConfirmDropout);
    selectedClassIDRef.current = class_id;
    console.log(selectedClassIDRef.current);
  };

  //TODO: remove console.log
  const onConfirmDropout = async () => {
    console.log("Dropout class_id: ", selectedClassIDRef.current);
    await executeMutation(
      `
      mutation{
        DropoutTeacherOutClass(
          class_id: ${selectedClassIDRef.current},
          teacher: ${teacherID}
        ){
          entity_id
          message
          status
        }
      }
      `
    );
    closeModal();
    selectedClassIDRef.current = null;
    console.log(selectedClassIDRef.current);
    onDropout();
  };

  //TODO: remove console.log
  const onCancelDropout = () => {
    closeModal();
    selectedClassIDRef.current = null;
    console.log(selectedClassIDRef.current);

  }

  let open = isOpen && modalType === ModalType.ConfirmDropout;

  return { handleDropout, onConfirmDropout, onCancelDropout, open };
}


const JoinClassHook = () => {
  const { closeModal, isOpen, openModal, modalType } = UseModal();
  let open = isOpen && modalType === ModalType.joinClass;

  return { open, closeModal, openModal };
}

export default function ClassTable(props: ClassSectionProps) {
  let status = "Open";
  const { open, onCancelDropout: closeModal, onConfirmDropout, handleDropout } = dropOutHook(props.onDropout, props.teacherID);
  const {
    open: openJoinClassModal,
    closeModal: closeModalJoinClassModal,
    openModal: openJoinClassModalModal,
  } = JoinClassHook();

  return (
    <div className="relative">
      <ConfirmModal
        isOpen={open}
        onOpenChange={closeModal}
        onConfirmSync={async () => {
          await onConfirmDropout()
        }}
        onCancel={closeModal}
        title="Confirm Edit"
        message="Are you sure you want to save changes?"
        triggerButton={<></>}
      />
      {
        props.classes.length > 0 ?
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class ID</TableHead>
                <TableHead>Class Name</TableHead>
                <TableHead>Total Enrollment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.classes.length > 0 ?
                props.classes.map((classItem, index) => (
                  <motion.tr
                    key={classItem.class_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <TableCell>{classItem.class_id}</TableCell>
                    <TableCell>{classItem.class_name}</TableCell>
                    <TableCell>{classItem.current_enrollment}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${status === "Open"
                          ? "bg-green-200 text-green-800"
                          : status === "Closed"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                          }`}
                      >
                        {status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDropout(classItem.class_id)}>
                          <LogOut className="w-4 h-4 mr-1" /> Drop Out
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                )) : <Card className="p-4 w-full">No classes found</Card>
              }
            </TableBody>
          </Table> : <Card className="p-4 w-full">No classes found</Card>
      }

      <div className="absolute top-0 right-0">
        <Button onClick={()=>{
          openJoinClassModalModal(ModalType.joinClass);
        }}>
          <PlusCircle className="w-4 h-4 mr-2" /> Join Other Class
        </Button>
      </div>
      <JoinClassModal isOpen={openJoinClassModal} onClose={closeModalJoinClassModal} teacher_id={props.teacherID} />
    </div>
  )
}

