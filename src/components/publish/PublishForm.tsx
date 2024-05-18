"use client";

import type { getDraftBookQuery } from "@/lib/graphql/queries";
import { cn } from "@/lib/utils";
import type { ResultOf } from "gql.tada";
import { useEffect, useState } from "react";

type DraftBook = ResultOf<typeof getDraftBookQuery>;

type Draft = {
	type: "draft";
	draftBook: DraftBook;
};

type New = {
	type: "new";
};

type Props = Draft | New;

type CurrentStep = 1 | 2 | 3;

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

	useEffect(() => {
		if (props.type === "draft") {
			setCurrentStep(getCurrentStep(props.draftBook));
		}
	}, [props]);

	return (
		<div className="">
			<StepsNavigator selectedStep={currentStep} />
		</div>
	);
};

const getCurrentStep = (info: DraftBook): CurrentStep => {
	// using each form schema prcoess a zod parsing
	// if the parsing sucess skip to the next step and so on
	// until a parse field so this step is the current one so return its number

	// return 1 for now
	return 1;
};

const StepsNavigator = ({ selectedStep }: { selectedStep: CurrentStep }) => {
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
