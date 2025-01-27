import { ClassInfo, GradeInfo } from "../class"

export const getListClasses = ():ClassInfo[] => { 
    return [
        {
            Id: 1,
            Name: "Math",
            Description: "Math class",
            Teacher: "Mr. A",
            Status: "Open",
            Enrolled: 10
        },
        {
            Id: 2,
            Name: "RockSky",
            Description: "English class",
            Teacher: "Mr. B",
            Status: "Open",
            Enrolled: 20
        },
        {
            Id: 3,
            Name: "Sunny",
            Description: "History class",
            Teacher: "Mr. C",
            Status: "Open",
            Enrolled: 30
        },
        {
            Id: 4,
            Name: "Rose",
            Description: "History class",
            Teacher: "Mr. C",
            Status: "Open",
            Enrolled: 30
        }
    ]
}


export const GetGradesInfo = async ():Promise<GradeInfo[]> => {
    return [
            {
                Id: 1,
                Name: "Grade 1",
            },
            {
                Id: 2,
                Name: "Grade 2",
            },
            {
                Id: 3,
                Name: "Grade 3",
            },
            {
                Id: 4,
                Name: "Grade 4",    
            }
    ]
}