import { Class } from "@/models/class/class";
import { ClassEntity } from "@/models/students/GetListStudent/GetListStudent";
import ClassTable from "./classtable";


export type ClassSectionProps = {
    classes: ClassEntity[];
    onDropout: () => void;
    teacherID: number;
}

export const ClassSection: React.FC<ClassSectionProps> = ({
    classes,onDropout,
    teacherID
}) => {
    return (
        <>
            <ClassTable classes={classes} onDropout={onDropout} teacherID={teacherID}/>
        </>
    )
}