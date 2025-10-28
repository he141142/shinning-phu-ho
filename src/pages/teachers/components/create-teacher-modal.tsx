"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/drake_libs/ui/button"
import { Input } from "@/components/drake_libs/ui/input"
import { Textarea } from "@/components/drake_libs/ui/textarea"
import { Select, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/drake_libs/ui/select"
import { SelectContent } from "@radix-ui/react-select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/drake_libs/ui/dialog"
import { ConfirmModal } from "@/pages/class_detail/components/confirm-modal"
import { ModalType, UseModal } from "@/components/hooks/useModal"

type RegisterTeacherAccountPayload = {
    username: string
    password: string
    email: string
    mobile: string
    first_name: string
    last_name: string
    address: string
    center_id: number
    gender: string
}

export default function RegisterTeacherForm(
    {
        io,
        cm,
        openModal
    }: {
        io: boolean,
        cm: () => void,
        openModal: (modalType: string) => void
    }
) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<RegisterTeacherAccountPayload>();

    const [isSubmitting, setIsSubmitting] = useState(false);


    const onSubmit = async (data: RegisterTeacherAccountPayload) => {
        setIsSubmitting(true)
        // Here you would typically send the data to your API
        console.log(data)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsSubmitting(false)
    }


    const handleOpenModal = () => {
        openModal(ModalType.ConfirmEdit);
      };
    
    return (
        <Dialog open={io} onOpenChange={cm}>
            <DialogTrigger asChild>
            </DialogTrigger>
            <DialogContent className="mx-auto px-4 py-8">
                <DialogHeader>
                    <DialogTitle>Create Teacher Account</DialogTitle>
                    <DialogDescription>
                        Create Teacher Account
                    </DialogDescription>
                </DialogHeader>
                <div className="container mx-auto px-4 py-8">
                    
                    
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Button variant="ghost" className="mb-6"
                            onClick={cm}

                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <h1 className="text-3xl font-bold mb-6">Register Teacher Account</h1>
                    </motion.div>

                    <motion.form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <Input id="username" {...register("username", { rqeuired: "Username is required" })} className="mt-1" />
                                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password", { required: "Password is required" })}
                                    className="mt-1"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <Input id="email" type="email" {...register("email", { required: "Email is required" })} className="mt-1" />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                                    Mobile
                                </label>
                                <Input id="mobile" {...register("mobile", { required: "Mobile number is required" })} className="mt-1" />
                                {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <Input
                                    id="first_name"
                                    {...register("first_name", { required: "First name is required" })}
                                    className="mt-1"
                                />
                                {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <Input id="last_name" {...register("last_name", { required: "Last name is required" })} className="mt-1" />
                                {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>}
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <Textarea id="address" {...register("address", { required: "Address is required" })} className="mt-1" />
                                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Center
                                </label>
                                <Select >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a fruit" />
                                    </SelectTrigger>
                                    <SelectContent id="center">
                                        <SelectGroup>
                                            <SelectLabel>Fruits</SelectLabel>
                                            <SelectItem value="apple">Apple</SelectItem>
                                            <SelectItem value="banana">Banana</SelectItem>
                                            <SelectItem value="blueberry">Blueberry</SelectItem>
                                            <SelectItem value="grapes">Grapes</SelectItem>
                                            <SelectItem value="pineapple">Pineapple</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                    Gender
                                </label>
                                <Controller
                                    name="gender"
                                    control={control}
                                    rules={{ required: "Gender is required" }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
                            </div>
                        </div>


                    </motion.form>
                </div>
                <DialogFooter>
                    <div className="flex justify-end space-x-4">
                        <Button variant="outline"
                            onClick={cm}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} onClick={handleOpenModal}>
                            {/* {isSubmitting ? "Saving..." : "Save"} */}
                            Save
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

