import React from "react";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function EditBookDialog({ id }: { id: string }) {
	// const form = useForm({
	// 	resolver: zodResolver(),
	// 	defaultValues: {},
	// });

	return (
		<Button
			onClick={() => {
				console.log(id);
			}}
			size={"icon"}
			variant={"outline"}
		>
			<Pencil className="size-5" />
		</Button>
	);
}
