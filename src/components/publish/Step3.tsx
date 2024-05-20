import React, { useState } from "react";
import { Button } from "../ui/button";
import { publishBookAction } from "@/app/actions";
import { toast } from "sonner";

// review the book and hit publish
export const Step3 = ({
	onDone,
	data,
}: {
	onDone: () => void;
	data: {
		bookId: string;
		// keep it optional null for now
		preview?: null;
	};
}) => {
	const [loading, setLoading] = useState(false);
	const publish = async () => {
		setLoading(true);
		const { success, message } = await publishBookAction(data.bookId);
		if (!success) {
			setLoading(false);
			return toast.error(message);
		}
		setLoading(false);
		// show a message fore now, later better to show thanks page
		toast.success(message);
	};

	return (
		<div>
			<div className="h-96 bg-muted" />
			<div className="flex justify-end">
				<Button
					isLoading={loading}
					type="button"
					onClick={publish}
					className="w-40 mt-4"
				>
					Publish
				</Button>
			</div>
		</div>
	);
};
