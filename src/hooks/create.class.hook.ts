import { GradeInfo } from "@/models/class/class";
import { useState } from "react";

export const UseCreateClassHook = () => {
  const [Grades, setGrades] = useState<GradeInfo[]>([]);
  const [className, setClassName] = useState<string>("");
  let GradeBySelectItem: Map<string, GradeInfo> = new Map<string, GradeInfo>();

  let classNameDispl = className;

  const reRenderMap = () => {
    for (let grade of Grades) {
      GradeBySelectItem.set(grade.Id.toString(), grade);
    }
    console.log(GradeBySelectItem);
  };

  reRenderMap();

  return {
    GradeBySelectItem,
    classNameDispl,
    setGrades,
    setClassName
  };
};
