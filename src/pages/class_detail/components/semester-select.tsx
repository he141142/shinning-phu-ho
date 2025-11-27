"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/drake_libs/ui/select";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ClassSemester } from "@/hooks/classes/useGetClassSemesters";

export const SemesterSelect: React.FC<{
  semesters: ClassSemester[];
  editedSemesterId: number | null;
  setEditedSemesterId: React.Dispatch<React.SetStateAction<number | null>>;
  isLoading: boolean;
}> = ({ editedSemesterId, semesters, setEditedSemesterId, isLoading }) => {
  return (
    <Select
      value={editedSemesterId?.toString() || ""}
      onValueChange={(value) => setEditedSemesterId(parseInt(value))}
      disabled={isLoading}
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{
          scale: isLoading ? [1, 1.02, 1] : 1,
        }}
        transition={{ duration: 1.2, repeat: isLoading ? Infinity : 0 }}
      >
        <SelectTrigger
          className={`w-full mt-1 border-2 rounded-xl flex items-center justify-between transition-all duration-300 ${
            isLoading
              ? "border-gray-300 bg-gray-50 cursor-not-allowed opacity-80"
              : "border-purple-400 hover:border-purple-500 focus:border-purple-600"
          }`}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                className="flex items-center w-full justify-center gap-2 text-gray-500"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                >
                  <Loader2 className="w-4 h-4 text-purple-500" />
                </motion.div>
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  Loading semesters...
                </motion.span>
              </motion.div>
            ) : (
              <motion.div
                key="select"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SelectValue placeholder="Select semester" />
              </motion.div>
            )}
          </AnimatePresence>
        </SelectTrigger>
      </motion.div>

      <AnimatePresence>
        {!isLoading && (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <SelectContent className="rounded-xl shadow-lg border border-gray-100">
              {semesters.map((semester) => (
                <motion.div
                  key={semester.semester_id}
                  whileHover={{ scale: 1.03, backgroundColor: "#faf5ff" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <SelectItem
                    value={semester.semester_id.toString()}
                    className="cursor-pointer py-2"
                  >
                    {semester.semester_name}
                  </SelectItem>
                </motion.div>
              ))}
            </SelectContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Select>
  );
};
