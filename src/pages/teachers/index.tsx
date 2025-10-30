import OnlineStatus from "@/components/common/online";
import { Badge } from "@/components/drake_libs/ui/badge";
import { Button, buttonVariants } from "@/components/drake_libs/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/drake_libs/ui/card";
import { Input } from "@/components/drake_libs/ui/input";
import { EyeIcon, FilePenIcon, PlusIcon, TrashIcon, SearchIcon, UsersIcon, GraduationCapIcon, MapPinIcon, MailIcon } from "lucide-react";
import { useRouter } from "next/router";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import RegisterTeacherForm from "./components/create-teacher-modal";
import { UseModal, ModalType } from "@/components/hooks/useModal";
import { ConfirmModal } from "../class_detail/components/confirm-modal";
import { ErrorPage } from "@/components/drake_libs/component/loading-page";
import { PaginationNav } from "@/components/drake_libs/component/pagination";

import { getTotalPage } from "@/utils/utils";
import { PaginationProvider, UsePaginationHook } from "@/components/hooks/paginationstore/paginationstoreprovider";
import { ReactNode, useCallback, useState, useMemo } from "react";
import { useGetListTeachers } from "@/hooks/teachers";

const TeacherListContent: React.FC<any> = () => {

    const {
        page, perPage, onPageChange, onPerPageChange
    } = UsePaginationHook();

    const [searchQuery, setSearchQuery] = useState("");

    const router = useRouter();


    console.log("page", page);

    // Fetch data using React Query hook
    const { data: queryData, error, isLoading } = useGetListTeachers({
        page,
        limit: perPage,
        order_by: "name desc",
        where: {},
    });

    // Extract data from query response
    const data = useMemo(() => {
        if (!queryData) return undefined;
        return queryData;
    }, [queryData]);

        const handlerPageChange = useCallback(async (page: number): Promise<void> => {
            // await onPageChange(page);
            router.push({ pathname: router.pathname, query: { page: page } });
        },[router]);
    const { closeModal, isOpen, openModal, modalType } = UseModal();
    const isopenModal: boolean = isOpen && modalType == ModalType.RegisterTeacher;
    const openModalConfirm: boolean = isOpen && modalType == ModalType.ConfirmEdit;

    // Filter teachers based on search query
    const filteredTeachers = useMemo(() => {
        if (!data?.ListTeachers.data) return [];
        if (!searchQuery.trim()) return data.ListTeachers.data;

        const query = searchQuery.toLowerCase();
        return data.ListTeachers.data.filter(teacher =>
            `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(query) ||
            teacher.email?.toLowerCase().includes(query) ||
            teacher.center?.center_name?.toLowerCase().includes(query)
        );
    }, [data?.ListTeachers.data, searchQuery]);

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading teachers...</p>
            </div>
        </div>
    );
    if (error) return <ErrorPage message={error.message || "Failed to load teachers"} />;

    if (!data) return <div>No data</div>;



    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teacher Management</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage and view all teachers ({data?.ListTeachers.total || 0} total)
                        </p>
                    </div>
                    <Button
                        onClick={() => openModal(ModalType.RegisterTeacher)}
                        className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                        size="lg"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Teacher
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Search teachers by name, email, or center..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 py-6 text-base shadow-sm"
                    />
                </div>
            </motion.div>

            {/* Empty State */}
            {filteredTeachers.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                >
                    <UsersIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No teachers found</h3>
                    <p className="text-muted-foreground mb-6">
                        {searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first teacher"}
                    </p>
                    {!searchQuery && (
                        <Button onClick={() => openModal(ModalType.RegisterTeacher)}>
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Add Your First Teacher
                        </Button>
                    )}
                </motion.div>
            )}

            {/* Teachers Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={searchQuery}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {filteredTeachers.map((teacher, index) => (
                        <motion.div
                            key={teacher.teacher_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ y: -8 }}
                            className="h-full"
                        >
                            <Card className="h-full flex flex-col rounded-xl border-2 border-border hover:border-primary/50 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                {/* Card Header with Gradient */}
                                <CardHeader className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground pb-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl font-bold mb-1">
                                                {teacher.first_name} {teacher.last_name}
                                            </CardTitle>
                                            {teacher.email && (
                                                <div className="flex items-center gap-1 text-sm opacity-90">
                                                    <MailIcon className="w-3 h-3" />
                                                    <span className="truncate">{teacher.email}</span>
                                                </div>
                                            )}
                                        </div>
                                        <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-white/40">
                                            ID: {teacher.teacher_id}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                {/* Card Content */}
                                <CardContent className="p-6 space-y-4 flex-1">
                                    <div className="space-y-3">
                                        {teacher.center && (
                                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                                <div className="p-2 bg-primary/10 rounded-md">
                                                    <MapPinIcon className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-muted-foreground">Center</p>
                                                    <p className="font-semibold truncate">{teacher.center.center_name || teacher.center.center_id}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                                <GraduationCapIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Classes</p>
                                                    <p className="font-bold text-lg">{teacher.classes.length}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                                <UsersIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Students</p>
                                                    <p className="font-bold text-lg">{teacher.total_students}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {teacher.address && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {teacher.address}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>

                                {/* Card Footer */}
                                <CardFooter className="p-4 pt-0">
                                    <Button
                                        onClick={() => router.push(`/teachers/${teacher.teacher_id}`)}
                                        className="w-full group"
                                        variant="default"
                                    >
                                        View Details
                                        <EyeIcon className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {filteredTeachers.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8"
                >
                    <PaginationNav
                        currentPage={page}
                        totalPages={data.ListTeachers ? getTotalPage(data.ListTeachers.total, perPage) : 1}
                        handlePageChange={handlerPageChange}
                    />
                </motion.div>
            )}
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

