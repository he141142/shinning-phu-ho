

import { ClassInfo, GetListClassResponse } from "@/models/class/class";
import { HOST } from "@/static/env";
import { useState, useEffect } from "react";

export function useFetchClasses() {
    const [classes, setClasses] = useState<ClassInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${HOST}/query`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: `
                            query {
                                GetListClass(input: {
                                    page: 1,
                                    limit: -1,
                                    order_by: "id desc",
                                    where: {}
                                }) {
                                    total
                                    data {
                                        class_id
                                        class_name
                                        description
                                        teacher_id
                                        start_date
                                        end_date
                                        max_students
                                        current_enrollment
                                        room_id
                                        schedule
                                        semester {
                                            semester_id
                                            semester_name
                                        }
                                    }
                                }
                            }
                        `,
                    }),
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const result = await response.json();
                if (result.errors) throw new Error(result.errors[0].message);
                 const data: GetListClassResponse = result.data;
                setClasses(data.GetListClass.data.map((d) => ({
                    Id: d.class_id,
                    Name: d.class_name,
                    Description: d.description,
                    Teacher: d.teacher_id?.toString() || "-",
                    Status: "Active",
                    Enrolled: d.current_enrollment,
                    StartDate: d.start_date || undefined,
                    EndDate: d.end_date || undefined,
                    MaxStudents: d.max_students,
                    Semester: d.semster ? {
                        id: d.semster.semester_id,
                        name: d.semster.semester_name
                    } : undefined,
                })));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    return { classes, loading, error };
}
