import React from "react";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";

export function EditBookDialog({ id }: { id: string }) {
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
