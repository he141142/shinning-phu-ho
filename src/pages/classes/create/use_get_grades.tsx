import {
  RenderItems,
  SelectItemMetadata,
} from "@/components/custom/custom.dropdown";
import { useGetAllGrades } from "@/hooks";
import { GradeInfo } from "@/models/class/class";
import { GetGradesInfo } from "@/models/mocks/get_list_classes";
import React, { use } from "react";

export const useGetGrades = ({
  setGrades,
}: {
  setGrades: React.Dispatch<React.SetStateAction<GradeInfo[]>>;
}) => {
  const {
    data: grades,
  } = useGetAllGrades();

  const renderFn: RenderItems = () => {
    return new Promise<SelectItemMetadata[]>((resolve) => {
      if (!grades) {
        resolve([]);
        return;
      }
      setGrades(grades.ListAllGrades.map((g) => {
        return {
            Id: g.grade_id,
            Name: g.grade_name,
            Description: "",
        }
      }));
      let items = grades.ListAllGrades.map((g) => {
        return {
          Display: g.grade_name,
          Key: g.grade_id.toString(),
          Name: g.grade_id.toString(),
        } as SelectItemMetadata;
      });

      resolve(items);
    });
  };

  return renderFn;
};
