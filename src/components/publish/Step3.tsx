import React from "react";
import { Button } from "../ui/button";

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
	const publish = async () => {
		console.log(data.bookId);
	};
	return (
		<div>
			<div className="h-96 bg-muted" />
			<Button>Publish</Button>
		</div>
	);
};
