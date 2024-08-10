"use client";
import { FeedbackList } from "@/components/drake_libs/component/message-list";
import { StudentFeedBackList } from "@/components/drake_libs/component/student-feed-back-list";
import { FeedbackItem } from "@/models/feedback-item";
import { fetchFeedbackStatus, ListStudentObjects } from "@/models/mocks/get_list_student_object";
import { StudentObject } from "@/models/student";
import { useEffect, useState } from "react";

export default function StudentFeedbackLists() {
    const [students, setStudents] = useState<StudentObject[]>([]);
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
    const [isFeedbackLoading, setIsFeedbackLoading] = useState<boolean>(false);

    const AddFeedBack = (feedback: FeedbackItem) => {
        setFeedbacks([...feedbacks, feedback]);
    }

    useEffect(() => {
        setStudents(ListStudentObjects());
    }, []);

    useEffect(() => {
        setFeedbacks(fetchFeedbackStatus());
        console.log("okkk");
        
    }, []);


    return (
        <div className="flex flex-col">
            <div className="basis-1">
                <FeedbackList FeedbackItems={feedbacks}/>
            </div>
            <div>
                <StudentFeedBackList students={students} addFeedback={AddFeedBack} />
            </div>
        </div>
    )
}
