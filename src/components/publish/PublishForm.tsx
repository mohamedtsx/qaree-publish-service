"use client";

import type { getDraftBookQuery } from "@/lib/graphql/queries";
import { cn } from "@/lib/utils";
import type { ResultOf } from "gql.tada";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { type BookDetailsSchema, Step1 } from "./Step1";
import { type BookContentSchema, Step2 } from "./Step2";
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
	const isDraft = props.type === "draft";

	const [currentStep, setCurrentStep] = useState<CurrentStep>(
		isDraft ? getIncompleteStep(props.draftBook) : 1,
	);
	const [completedSteps, setCompletedSteps] = useState(
		isDraft ? getIncompleteStep(props.draftBook) - 1 : 0,
	);

	const [bookId, setBookId] = useState<string>("");

	useEffect(() => {
		if (isDraft) {
			setBookId(props.draftBook.getBook?._id as string);
		}
	}, [isDraft, props]);

	return (
		<div>
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
						data={{
							defaultValues: isDraft
								? getDefaultValue(props.draftBook, 1)
								: undefined,
						}}
					/>
				)}
				{currentStep === 2 && (
					<Step2
						onDone={() => {
							if (completedSteps + 1 >= currentStep) {
								setCompletedSteps(currentStep);
							}
							setCurrentStep(3);
						}}
						data={{
							bookId,
							defaultValues: isDraft
								? getDefaultValue(props.draftBook, 2)
								: undefined,
							cover: isDraft
								? (props.draftBook.getBook?.cover?.path as string)
								: undefined,
						}}
					/>
				)}
				{currentStep === 3 && (
					<Step3
						onDone={() => {
							setCompletedSteps(3);
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

function getDefaultValue(info: DraftBook, step: 1): BookDetailsSchema;
function getDefaultValue(info: DraftBook, step: 2): BookContentSchema;

function getDefaultValue(info: DraftBook, step: CurrentStep) {
	const { getBook } = info;
	if (step === 1) {
		const values: BookDetailsSchema = {
			categories: getBook?.categories?.map((el) => el?._id as string) ?? [],
			description: getBook?.description as string,
			edition: getBook?.edition ?? 1,
			language: getBook?.language as string,
			name: getBook?.name as string,
			publishingRights: getBook?.publishingRights ? "true" : "false",
			isbn: getBook?.isbn as string,
			previousPublishingData: getBook?.previousPublishingData ?? "",
			price: getBook?.price ?? 0,
		};

		return values;
	}

	if (step === 2) {
		const value: BookContentSchema = {
			coverUploaded: !!getBook?.cover,
			fileUploaded: !!getBook?.file,
			sample: (getBook?.sample as Array<string>) ?? [],
		};
		return value;
	}
}

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
						<div
							className={cn(
								"relative flex items-center justify-center p-2 sm:sr-only",
							)}
						>
							<div>
								{isCompleted ? <Check className="text-green-600" /> : el.order}
							</div>
							<div
								className={cn(
									"bg-green-600 absolute inset-x-0 bottom-0",
									isCurrent && "h-1",
								)}
							/>
						</div>
						<div className="relative max-sm:sr-only">
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
