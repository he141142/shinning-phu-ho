"use client";

import { useState, useMemo } from "react";
import { Search, UserCheck, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/drake_libs/ui/dialog";
import { Button } from "@/components/drake_libs/ui/button";
import { Input } from "@/components/drake_libs/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/drake_libs/ui/avatar";
import { useGetListTeachers } from "@/hooks/teachers";
import { Badge } from "@/components/drake_libs/ui/badge";
import { ScrollArea } from "@/components/drake_libs/ui/scroll-area";

interface Teacher {
  teacher_id: number;
  first_name: string;
  last_name: string;
  email: string;
  total_students?: number;
}

interface TeacherSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (teacher: Teacher) => void;
  currentTeacherId?: number;
}

export function TeacherSelectionModal({
  open,
  onClose,
  onSelect,
  currentTeacherId,
}: TeacherSelectionModalProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const { data, isLoading } = useGetListTeachers({
    page: 1,
    limit: 100,
  });

  const teachers = data?.ListTeachers?.data || [];

  const filteredTeachers = useMemo(() => {
    if (!searchText) return teachers;

    const lowerSearch = searchText.toLowerCase();
    return teachers.filter((teacher) => {
      const fullName = `${teacher.first_name} ${teacher.last_name}`.toLowerCase();
      const email = teacher.email?.toLowerCase() || "";
      return fullName.includes(lowerSearch) || email.includes(lowerSearch);
    });
  }, [teachers, searchText]);

  const handleSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleConfirm = () => {
    if (selectedTeacher) {
      onSelect(selectedTeacher);
      onClose();
      setSearchText("");
      setSelectedTeacher(null);
    }
  };

  const handleClose = () => {
    onClose();
    setSearchText("");
    setSelectedTeacher(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Select Teacher
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Search and select a teacher to assign to this class
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 border-2 focus:border-blue-500"
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Teachers List */}
          <ScrollArea className="h-[400px] rounded-lg border border-gray-200 p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Search className="h-12 w-12 mb-2 text-gray-300" />
                <p className="text-sm">No teachers found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTeachers.map((teacher) => {
                  const isSelected = selectedTeacher?.teacher_id === teacher.teacher_id;
                  const isCurrent = currentTeacherId === teacher.teacher_id;

                  return (
                    <div
                      key={teacher.teacher_id}
                      onClick={() => handleSelect(teacher)}
                      className={`
                        flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Avatar className="w-12 h-12 border-2 border-white shadow">
                        <AvatarImage
                          src={`/placeholder.svg?height=48&width=48`}
                          alt={`${teacher.first_name} ${teacher.last_name}`}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold">
                          {teacher.first_name?.[0]}
                          {teacher.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 truncate">
                            {teacher.first_name} {teacher.last_name}
                          </p>
                          {isCurrent && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{teacher.email}</p>
                        {teacher.total_students !== undefined && (
                          <p className="text-xs text-gray-400 mt-1">
                            {teacher.total_students} students
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                          <UserCheck className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedTeacher}
            className="min-w-[140px] bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Select Teacher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
