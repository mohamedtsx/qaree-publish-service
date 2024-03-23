"use client";

import { useState } from "react";

const steps = [
	{ id: "Step 1", name: "Book detailes" },
	{ id: "Step 2", name: "Upload files" },
	{ id: "Step 3", name: "Publish" },
];
function PublishBookForm() {
	const [currentStep, setCurrentStep] = useState(0);

	return <div>PublishBookForm</div>;
}

export default PublishBookForm;
