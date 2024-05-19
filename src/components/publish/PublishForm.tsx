"use client";

import type { getDraftBookQuery } from "@/lib/graphql/queries";
import { cn } from "@/lib/utils";
import type { ResultOf } from "gql.tada";
import { useEffect, useState } from "react";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";

type DraftBook = ResultOf<typeof getDraftBookQuery>;

type Draft = {
	type: "draft";
	draftBook: DraftBook;
};

type New = {
	type: "new";
};

type Props = Draft | New;

export type CurrentStep = 1 | 2 | 3;

const steps: Array<{
	label: string;
	order: CurrentStep;
}> = [
	{
		label: "Step Label One",
		order: 1,
	},
	{
		label: "Step Label Two",
		order: 2,
	},
	{
		label: "Step Label Three",
		order: 3,
	},
];

export const PublishForm = (props: Props) => {
	const [currentStep, setCurrentStep] = useState<CurrentStep>(1);
	const [bookId, setBookId] = useState<string>("");

	useEffect(() => {
		if (props.type === "draft") {
			setCurrentStep(getCurrentStep(props.draftBook));
			setBookId(props.draftBook.getBook?._id as string);
		}
	}, [props]);

	return (
		<div className="">
			{/* <StepsNavigator selectedStep={currentStep} /> */}
			<div className="max-w-7xl mx-auto">
				{currentStep === 1 && (
					<Step1
						onDone={(bookId: string) => {
							setCurrentStep(2);
							setBookId(bookId);
						}}
					/>
				)}
				{currentStep === 2 && (
					<Step2
						onDone={() => {
							setCurrentStep(3);
						}}
						data={{ bookId }}
					/>
				)}
				{currentStep === 3 && <Step3 onDone={() => {}} />}
			</div>
		</div>
	);
};

const getCurrentStep = (info: DraftBook): CurrentStep => {
	// using each form schema prcoess a zod parsing
	// if the parsing sucess skip to the next step and so on
	// until a parse field so this step is the current one so return its number

	// we may need to return an object that include both current step & steps default values
	// return 1 for now
	return 2;
};

const StepsNavigator = ({ selectedStep }: { selectedStep: CurrentStep }) => {
	// note: you can use shadcn tabs
	return (
		<div>
			{steps.map((el) => (
				<div
					key={el.label}
					className={cn(
						"p-4 bg-muted",
						el.order === selectedStep && "bg-green-500",
					)}
				>
					{el.label}
				</div>
			))}
		</div>
	);
};
