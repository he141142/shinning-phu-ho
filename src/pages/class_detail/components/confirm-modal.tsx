import { Button } from "@/components/drake_libs/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/drake_libs/ui/dialog";
import { Input } from "@/components/drake_libs/ui/input";
import { Label } from "@/components/drake_libs/ui/label";
import React from "react";
import { motion } from "framer-motion";
import { LoaderPinwheel } from "lucide-react";
import { LoadingPage } from "@/components/drake_libs/component/loading-page";


type ConfirmModalProps = {
	title?: string;
	message?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
	onOpenChange: (isOpen: boolean) => void;
	isOpen: boolean;
	triggerButton: React.ReactNode;
	onConfirmSync?: () => Promise<void>;
}
export const ConfirmModal = ({
	title,
	message,
	onConfirm,
	onCancel,
	onOpenChange,
	isOpen,
	onConfirmSync,
}: ConfirmModalProps) => {

	const [loading, setLoading] = React.useState(false);

	const onConfirmModal = async () => {
		try {
			setLoading(true);
			if (!onConfirmSync) return onConfirm ? onConfirm() : null;
			await onConfirmSync();
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				className="motion-all duration-300 ease-in-out"
			>
				<DialogContent className="sm:max-w-[425px] p-6 rounded-lg shadow-lg bg-white border border-gray-200">
					{
						loading ? <LoadingPage /> : <>
							<DialogHeader>
								<DialogTitle className="text-lg font-semibold text-gray-800">{title || "Confirm Action"}</DialogTitle>
								<DialogDescription className="text-sm text-gray-600">
									{message || "Are you sure you want to proceed?"}
								</DialogDescription>
							</DialogHeader>
							<DialogFooter className="flex justify-end gap-4">
								<Button onClick={onCancel} variant="outline" className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">Cancel</Button>
								<Button onClick={onConfirmModal} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
									Confirm
									<motion.div
										animate={{ rotate: 360 }}
										transition={{ repeat: Infinity, duration: 1 }}
										whileHover={{
											scale: 2, width: 20, height: 20,
											transform: "rotate(360deg)",
											transition: { duration: 0.3 }

										}}
									>
										<LoaderPinwheel className="w-4 h-4 ml-2" />
									</motion.div>
								</Button>
							</DialogFooter>
						</>
					}

				</DialogContent>
			</motion.div>
		</Dialog>
	);
};