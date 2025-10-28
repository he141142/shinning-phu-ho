import OnlineStatus from "@/components/common/online";
import { Badge } from "@/components/drake_libs/ui/badge";
import { Button, buttonVariants } from "@/components/drake_libs/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/drake_libs/ui/card";
import { EyeIcon, FilePenIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/router";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import RegisterTeacherForm from "./components/create-teacher-modal";
import { UseModal, ModalType } from "@/components/hooks/useModal";
import { ConfirmModal } from "../class_detail/components/confirm-modal";
import { UseFetch } from "@/components/hooks/fetch-data";
import { HOST } from "@/static/env";
import { GraphQLResponse } from "@/models/class/class";
import { ListTeachers, Teacher } from "@/models/teachers/ListTeachers";
import { Pagination } from "@/models/pagination";
import { ErrorPage } from "@/components/drake_libs/component/loading-page";
import { PaginationNav } from "@/components/drake_libs/component/pagination";
import { usePagination, useSyncPagination } from "@/components/hooks/usePagination";

import { getTotalPage } from "@/utils/utils";
import { PaginationProvider, UsePaginationHook } from "@/components/hooks/paginationstore/paginationstoreprovider";
import { PaginationProp, PaginationState } from "@/components/hooks/paginationstore/paginationsotre";
import { ReactNode, useCallback } from "react";

const TeacherListContent: React.FC<any> = () => {

    const {
        page, perPage, onPageChange, onPerPageChange
    } = UsePaginationHook();


    const router = useRouter();


    console.log("page", page);


    const { data, error, loading } = UseFetch<ListTeachers>(`${HOST}/query`, `
             query{
                ListTeachers(input:{
                    limit: ${perPage},
                    order_by:"name desc",
                    page: ${page},
                    where: {}
                }){
                    data{
                        address
                        teacher_id
                        classes{
                            class_id
                            class_name
                            current_enrollment
                        }
                        address
                        email
                        first_name
                        last_name
                        user_account{
                            username
                            user_id
                        }
                        total_students
                        center{
                            center_id
                            center_name
                        }
                    },
                    total
                }
            }
        `, page);

        const handlerPageChange = useCallback(async (page: number): Promise<void> => {
            // await onPageChange(page);
            router.push({ pathname: router.pathname, query: { page: page } });
        },[router]);
    const { closeModal, isOpen, openModal, modalType } = UseModal();
    const isopenModal: boolean = isOpen && modalType == ModalType.RegisterTeacher;
    const openModalConfirm: boolean = isOpen && modalType == ModalType.ConfirmEdit;
    if (loading) return <div>Loading...</div>;
    if (error) return <ErrorPage message={error || ""} />;

    if (!data) return <div>No data</div>;



    return (
        <div className="max-w-100 mx-auto  ">
            <RegisterTeacherForm io={isopenModal} cm={closeModal} openModal={openModal} />
            <ConfirmModal
                isOpen={openModalConfirm}
                onOpenChange={closeModal}
                onConfirm={() => {

                }}
                onCancel={closeModal}
                title="Confirm Edit"
                message="Are you sure you want to save changes?"
                triggerButton={<></>}
            />
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Teacher Management</h1>
                <Button onClick={() => {
                    openModal(ModalType.RegisterTeacher);
                }} className="flex items-center gap-2">
                    <PlusIcon className="w-4 h-4" />
                    Add Teacher
                </Button>

            </div>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {data?.ListTeachers.data.map((teacher, index) => (
                    <motion.div
                        key={teacher.teacher_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card className="rounded-lg shadow-lg bg-white hover:shadow-xl transition-all duration-300">
                            <CardHeader
                                className={cn(buttonVariants({ variant: "default", size: "default", className: "w-full" }))}
                            >
                                <CardTitle className="text-lg font-semibold">{teacher.first_name} {teacher.last_name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-3">
                                <InfoRow label="Center" value={teacher.center ? teacher.center.center_id : "N/A"} />
                                <InfoRow label="Total Classes" value={teacher.classes.length} />
                                <InfoRow label="Current Students" value={teacher.total_students} />
                            </CardContent>
                            <CardFooter className="p-4">
                                <motion.button
                                    className={cn(buttonVariants({ variant: "default", size: "default", className: "w-full" }))}
                                    onClick={() => router.push(`/teachers/${teacher.teacher_id}`)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    View Detail
                                </motion.button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
            <PaginationNav currentPage={page} totalPages={data.ListTeachers ? getTotalPage(data.ListTeachers.total, perPage) : 1} handlePageChange={handlerPageChange} />

        </div>
    )
}

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-center border-b pb-2">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="text-sm font-semibold text-gray-900">{value}</dd>
    </div>
);


export default function TeacherList() {
    return (
        <PaginationProvider page={1} perPage={6}>
            <TeacherListContent />
        </PaginationProvider>
    )
};

