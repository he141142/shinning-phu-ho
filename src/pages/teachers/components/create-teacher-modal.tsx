"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  LockIcon,
  BuildingIcon,
} from "lucide-react";
import { Button } from "@/components/drake_libs/ui/button";
import { Input } from "@/components/drake_libs/ui/input";
import { Textarea } from "@/components/drake_libs/ui/textarea";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/drake_libs/ui/select";
import { SelectContent } from "@radix-ui/react-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/drake_libs/ui/dialog";
import { Label } from "@/components/drake_libs/ui/label";
import { ModalType, UseModal } from "@/components/hooks/useModal";
import { useRegisterTeacherAccount } from "@/hooks/teachers/useRegisterTeacherAccount";
import { useToast } from "@/components/hooks/use-toast";
import {
  RenderFailedToast,
  RenderSuccessToast,
} from "@/components/drake_libs/customs/custom-toast";

type RegisterTeacherAccountPayload = {
  username: string;
  password: string;
  email: string;
  mobile: string;
  first_name: string;
  last_name: string;
  address: string;
  center_id: number;
  gender: string;
};

export default function RegisterTeacherForm({
  io,
  cm,
  openModal,
}: {
  io: boolean;
  cm: () => void;
  openModal: (modalType: string) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterTeacherAccountPayload>();

  const { mutate: registerTeacherAccount, isPending } =
    useRegisterTeacherAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const onSubmit = async (data: RegisterTeacherAccountPayload) => {
    setIsSubmitting(true);
    // Here you would typically send the data to your API
    console.log(data);
    registerTeacherAccount(
      {
        input: {
          center_id: 1,
          address: data.address,
          first_name: data.first_name,
          email: data.email,
          gender: data.gender,
          last_name: data.last_name,
          mobile: data.mobile,
          password: data.password,
          username: data.username,
        },
      },
      {
        onSuccess: () => {
          toast.toast({ ...RenderSuccessToast("teacher account added") });
        },
        onError: (error) => {
          toast.toast({ ...RenderFailedToast(error.message || "teacher account failed") });
        },
      }
    );
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    cm();
  };

  return (
    <Dialog open={io} onOpenChange={cm}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold">
            Add New Teacher
          </DialogTitle>
          <DialogDescription className="text-base">
            Fill in the information below to register a new teacher account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Account Credentials Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <LockIcon className="w-5 h-5" />
              Account Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Username *
                </Label>
                <Input
                  id="username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  placeholder="Enter username"
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && (
                  <p className="text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <LockIcon className="w-4 h-4" />
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  placeholder="Enter password"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                  placeholder="Enter first name"
                  className={errors.first_name ? "border-red-500" : ""}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-600">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  {...register("last_name", {
                    required: "Last name is required",
                  })}
                  placeholder="Enter last name"
                  className={errors.last_name ? "border-red-500" : ""}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-600">
                    {errors.last_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        className={errors.gender ? "border-red-500" : ""}
                      >
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
                {errors.gender && (
                  <p className="text-sm text-red-600">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MailIcon className="w-5 h-5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <MailIcon className="w-4 h-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="teacher@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4" />
                  Mobile *
                </Label>
                <Input
                  id="mobile"
                  {...register("mobile", {
                    required: "Mobile number is required",
                    // pattern: {
                    //   value: /^[0-9]{10,}$/,
                    //   message: "Invalid phone number",
                    // },
                  })}
                  placeholder="Enter mobile number"
                  className={errors.mobile ? "border-red-500" : ""}
                />
                {errors.mobile && (
                  <p className="text-sm text-red-600">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  Address *
                </Label>
                <Textarea
                  id="address"
                  {...register("address", { required: "Address is required" })}
                  placeholder="Enter full address"
                  rows={3}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Center Assignment Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BuildingIcon className="w-5 h-5" />
              Center Assignment
            </h3>
            <div className="space-y-2">
              <Label htmlFor="center_id">Assigned Center *</Label>
              <Controller
                name="center_id"
                control={control}
                rules={{ required: "Center is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger
                      className={errors.center_id ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select a center" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Centers</SelectLabel>
                        <SelectItem value="1">
                          Center 1 - Main Campus
                        </SelectItem>
                        <SelectItem value="2">
                          Center 2 - North Branch
                        </SelectItem>
                        <SelectItem value="3">
                          Center 3 - South Branch
                        </SelectItem>
                        <SelectItem value="4">
                          Center 4 - East Branch
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.center_id && (
                <p className="text-sm text-red-600">
                  {errors.center_id.message}
                </p>
              )}
            </div>
          </div>
        </form>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={cm}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              "Create Teacher"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
