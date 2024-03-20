import React from "react";
import { cn } from "@/lib/utils";
export const Spinner = ({ className }: { className?: string }) => {
	return (
		<div
			className={cn(
				"w-5 h-5 rounded-full border-r-2 border-t-2 border-t-white border-r-transparent animate-spin duration-500",
				className,
			)}
		/>
	);
};
