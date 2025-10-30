"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PlusCircle, Eye, LogOut, BookOpen } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/drake_libs/ui/table"
import { Button } from "@/components/drake_libs/ui/button"
import { Card } from "@/components/drake_libs/ui/card"
import JoinClassModal from "./JoinClassModal"
import { ClassSectionProps } from "./classsection"
import { ModalType, UseModal } from "@/components/hooks/useModal"
import { ConfirmModal } from "@/pages/class_detail/components/confirm-modal"
import { useRouter } from "next/router"
import { useGraphQLMutation } from "@/components/hooks/useMutation"
import { Badge } from "@/components/drake_libs/ui/badge"

const dropOutHook = (onDropout: () => void, teacherID: number) => {
  const router = useRouter();
  const { error, executeMutation, loading } = useGraphQLMutation();

  const { closeModal, isOpen, openModal, modalType } = UseModal();
  const selectedClassIDRef = useRef<number | null>(null);

  const handleDropout = (class_id: number) => {
    openModal(ModalType.ConfirmDropout);
    selectedClassIDRef.current = class_id;
  };

  const onConfirmDropout = async () => {
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
    onDropout();
  };

  const onCancelDropout = () => {
    closeModal();
    selectedClassIDRef.current = null;
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
  const router = useRouter();

  const handleViewClass = (classId: number) => {
    router.push(`/class_detail/${classId}`);
  };

  return (
    <div className="relative">
      <ConfirmModal
        isOpen={open}
        onOpenChange={closeModal}
        onConfirmSync={async () => {
          await onConfirmDropout()
        }}
        onCancel={closeModal}
        title="Confirm Dropout"
        message="Are you sure you want to remove this teacher from the class? This action cannot be undone."
        triggerButton={<></>}
      />

      {props.classes.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Header with Join Button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Class Assignments</h3>
                <p className="text-sm text-gray-600">
                  {props.classes.length} {props.classes.length === 1 ? "class" : "classes"} assigned
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                openJoinClassModalModal(ModalType.joinClass);
              }}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Join Class
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-700">Class ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Class Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Enrollment</TableHead>
                  <TableHead className="font-semibold text-gray-700">Semester</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {props.classes.map((classItem, index) => (
                    <motion.tr
                      key={classItem.class_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900">
                        {classItem.class_id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{classItem.class_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-gray-700">{classItem.current_enrollment} students</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-700">
                          {classItem.semester?.semester_name || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            status === "Open"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : status === "Closed"
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          }`}
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
                            onClick={() => handleViewClass(classItem.class_id)}
                          >
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                            onClick={() => handleDropout(classItem.class_id)}
                          >
                            <LogOut className="w-4 h-4 mr-1" /> Drop Out
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Classes Assigned</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This teacher hasn't been assigned to any classes yet.
                </p>
                <Button
                  onClick={() => {
                    openJoinClassModalModal(ModalType.joinClass);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Assign to Class
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <JoinClassModal isOpen={openJoinClassModal} onClose={closeModalJoinClassModal} teacher_id={props.teacherID} />
    </div>
  )
}
