import { GradeInfo } from "@/models/class/class";
import { useState, useMemo } from "react";

export const UseCreateClassHook = () => {
  const [Grades, setGrades] = useState<GradeInfo[]>([]);
  const [className, setClassName] = useState<string>("");

  const GradeBySelectItem = useMemo(() => {
    const map = new Map<string, GradeInfo>();
    for (let grade of Grades) {
      map.set(grade.Id.toString(), grade);
    }
    return map;
  }, [Grades]);

  let classNameDispl = className;

  return {
    GradeBySelectItem,
    classNameDispl,
    setGrades,
    setClassName
  };
};
