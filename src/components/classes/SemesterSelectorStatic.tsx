import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/drake_libs/ui/badge";
import { Card } from "@/components/drake_libs/ui/card";
import { Label } from "@/components/drake_libs/ui/label";
import { cn } from "@/lib/utils";
import { ClassSemester } from "@/hooks/classes/useGetClassSemesters";
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const SemesterSelectorStatic: React.FC<{
  className?: string;
  loaded: boolean;
  errorLoaded: boolean;
  semesters: ClassSemester[];
  selectedSemesterId: number;
  setEditedSemesterId: (semId: number) => void;
}> = ({ className, loaded, semesters, selectedSemesterId, errorLoaded, setEditedSemesterId }) => {
  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn("overflow-hidden", className)}
        >
          <Card className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <Label className="text-lg font-semibold text-gray-900">
                Available Semesters
              </Label>
            </div>

            {/* Loading State */}
            {!loaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-8"
              >
                <div className="text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
                  <p className="text-sm text-gray-600">
                    Finding available semesters...
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {loaded && errorLoaded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">
                  Failed to load semesters. Please try again.
                </p>
              </motion.div>
            )}

            {/* No Semesters Available */}
            {loaded && semesters.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center justify-center py-8 space-y-3"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-semibold text-gray-900">
                    No semesters available
                  </p>
                  <p className="text-sm text-gray-600">
                    No semesters match the selected date range
                  </p>
                </div>
              </motion.div>
            )}

            {/* Semesters List */}
            {loaded && semesters.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                <p className="text-sm text-gray-600 mb-4">
                  Select a semester for this class (based on your date range):
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {semesters.map((semester, index) => {
                    const isSelected =
                      selectedSemesterId === semester.semester_id;

                    return (
                      <motion.div
                        key={semester.semester_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <button
                          onClick={() =>
                            setEditedSemesterId(semester.semester_id)
                          }
                          type="button"
                          className={cn(
                            "w-full text-left p-4 rounded-lg border-2 transition-all duration-200",
                            isSelected
                              ? "border-purple-500 bg-purple-100 shadow-md"
                              : "border-purple-200 bg-white hover:border-purple-300 hover:bg-purple-50"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  {semester.semester_name}
                                </h4>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">Start:</span>{" "}
                                  {formatDate(semester.start_date)}
                                </p>
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">End:</span>{" "}
                                  {formatDate(semester.end_date)}
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <Badge className="bg-purple-600 text-white">
                                Active
                              </Badge>
                            )}
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
