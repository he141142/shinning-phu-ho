import { Button } from "@/components/drake_libs/ui/button"
import { ModalType, UseModal } from "@/components/hooks/useModal"
import { useState, type ReactNode } from "react"
import { ConfirmModal } from "./confirm-modal"

import { motion } from "framer-motion"
import { delay } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface EditableSectionProps {
  title: string
  onSave: () => void
  children: (isEditing: boolean) => ReactNode
  editModeChildren?: (isEditing: boolean) => ReactNode
}

export default function EditableSection({ title, onSave, children, editModeChildren }: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    onSave()
    setIsEditing(false);

    setIsSaving(true);
    try {
      await delay(5000); // Wait for API response
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  }
  const { closeModal, openModal, isOpen, modalType } = UseModal();
  const handleOpenModal = () => {
    console.log("handleOpenModal");
    openModal(ModalType.ConfirmEdit);
  };

  return (
    <motion.div
      className="mb-6 p-4 border rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {
        isSaving ?
          <>
            <Loader2 className="animate-spin" />
          </> :
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{title}</h2>
              {isEditing ? (
                <div>
                  <Button onClick={() => setIsEditing(false)} variant="outline" className="mr-2" disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button onClick={handleOpenModal} disabled={isSaving} className="">
                    Save
                  </Button>
                  <ConfirmModal
                    isOpen={isOpen}
                    onOpenChange={closeModal}
                    onConfirm={handleSave}
                    onCancel={closeModal}
                    title="Confirm Edit"
                    message="Are you sure you want to save changes?"
                    triggerButton={<></>}
                  />
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isEditing ? (
                editModeChildren ? editModeChildren(isEditing) : children(isEditing)
              ) : (
                <>{children(isEditing)}</>
              )}
            </motion.div>
          </>


      }
    </motion.div>
  )
}

