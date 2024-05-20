"use client";

import type { getDraftBookQuery } from "@/lib/graphql/queries";
import { cn } from "@/lib/utils";
import type { ResultOf } from "gql.tada";
import { useEffect, useState } from "react";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Button } from "../ui/button";

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
	const [currentStep, setCurrentStep] = useState<CurrentStep>(
		props.type === "draft" ? getIncompleteStep(props.draftBook) : 1,
	);
	const [completedSteps, setCompletedSteps] = useState(
		props.type === "draft" ? getIncompleteStep(props.draftBook) - 1 : 0,
	);

	const [bookId, setBookId] = useState<string>("");

	useEffect(() => {
		if (props.type === "draft") {
			setBookId(props.draftBook.getBook?._id as string);
		}
	}, [props]);

	return (
		<div className="">
			<StepsNavigator
				currentStep={currentStep}
				completedSteps={completedSteps}
				setCurrentStep={setCurrentStep}
			/>
			<div className="max-w-7xl mx-auto">
				{currentStep === 1 && (
					<Step1
						onDone={(bookId: string) => {
							if (completedSteps + 1 > currentStep) {
								setCompletedSteps(currentStep);
							}
							setCurrentStep(2);
							setBookId(bookId);
						}}
					/>
				)}
				{currentStep === 2 && (
					<Step2
						onDone={() => {
							if (completedSteps + 1 > currentStep) {
								setCompletedSteps(currentStep);
							}
							setCurrentStep(3);
						}}
						data={{ bookId }}
					/>
				)}
				{currentStep === 3 && (
					<Step3
						onDone={() => {
							if (completedSteps + 1 > currentStep) {
								setCompletedSteps(currentStep);
							}
						}}
						data={{
							bookId,
						}}
					/>
				)}
			</div>
		</div>
	);
};

const getIncompleteStep = (info: DraftBook): CurrentStep => {
	// draft book in step2 or step3
	// if cover & file & sample => step 3 else step 2
	const { getBook } = info;
	if (getBook?.cover && getBook.sample?.length && getBook.file?.path) {
		return 3;
	}

	return 2;
};

const getDefaultValue = () => {
	// 1. BookDetailsSchema
	// 2. BookContentSchema
	// 3. _
	// using each form schema prcoess a zod parsing
	// if the parsing sucess skip to the next step and so on
	// until a parse field so this step is the current one so return its number
	// we may need to return an object that include both current step & steps default values
	// return 1 for now
};

const StepsNavigator = ({
	currentStep,
	completedSteps,
	setCurrentStep,
}: {
	currentStep: CurrentStep;
	completedSteps: number;
	setCurrentStep: (step: CurrentStep) => void;
}) => {
	// step completed if order <= completedSteps
	// onclick set current to order if completed

	return (
		<div className="max-w-7xl mx-auto flex justify-between gap-5 px-4 mb-6">
			{steps.map((el) => {
				const isCompleted = el.order <= completedSteps;
				const isCurrent = el.order === currentStep;
				const isInProgress = el.order <= completedSteps + 1 && !isCompleted;
				const isNotStarted = el.order > completedSteps + 1;

				return (
					<button
						type="button"
						key={el.label}
						className={cn("bg-muted w-full", isCurrent && "")}
						disabled={!isInProgress && !isCompleted}
						onClick={() => {
							setCurrentStep(el.order);
						}}
					>
						<div className="relative">
							<div className="p-4">
								<div>{el.label}</div>
								{isCompleted && <div>completed</div>}
								{isInProgress && <div>in progress</div>}
								{isNotStarted && <div>not started</div>}
							</div>

							<span
								className={cn(
									"absolute inset-x-0 bottom-0 bg-green-600",
									isCurrent && "h-1",
								)}
							/>
						</div>
					</button>
				);
			})}
		</div>
	);
};
