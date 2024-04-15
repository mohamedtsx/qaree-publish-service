import React from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

export function DeleteBookDialog({ id }: { id: string }) {
	return (
		<Button
			onClick={() => {
				console.log(id);
			}}
			size={"icon"}
			variant={"outline"}
		>
			<Trash2 className="size-5" />
		</Button>
	);
}
