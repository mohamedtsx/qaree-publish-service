"use client";

import {
	type PublishSchemaType,
	publishSchema,
	publishDefaultValues,
} from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { Form } from "./ui/form";
import { FormInput, FormSelect, FormTextare, SubmitButton } from "./SmartForm";
import { Button } from "./ui/button";
import { FormImage } from "./FormImage";

const steps = [
	{ id: "Step 1", name: "Book detailes" },
	{ id: "Step 2", name: "Upload files" },
	{ id: "Step 3", name: "Publish" },
];

// todo(bug) fix form submit when user click entr inside an input

function PublishBookForm() {
	const [currentStep, setCurrentStep] = useState(2);

	const form = useForm<PublishSchemaType>({
		mode: "onBlur",
		resolver: zodResolver(publishSchema),
		defaultValues: publishDefaultValues,
	});

	const onSubmit = () => {};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
				<header>
					Step {currentStep} {steps[currentStep - 1].name}
				</header>
				<div className="grid gap-4 py-4">
					{currentStep === 1 ? (
						<StepFirst
							form={form}
							onDone={() => {
								// use it for steps animation for now just keep it update the current step
								setCurrentStep(2);
								console.log(form.getValues());
							}}
						/>
					) : currentStep === 2 ? (
						<StepSecond
							form={form}
							onDone={() => {
								setCurrentStep(3);
							}}
						/>
					) : currentStep === 3 ? (
						<StepThird form={form} onDone={() => {}} />
					) : null}
				</div>
			</form>
		</Form>
	);
}

interface StepProps {
	form: UseFormReturn<PublishSchemaType>;
	bookId?: string;
	onDone: () => void;
}

function StepFirst({ form, onDone }: StepProps) {
	const goNext = async () => {
		const isValid = await form.trigger([
			"name",
			"categories",
			"language",
			"description",
			"publishingRights",
		]);

		if (isValid) {
			onDone();
		}
	};

	return (
		<>
			<FormInput form={form} name="name" placeholder="name" label="name" />
			<FormTextare form={form} name="description" label="description" />

			{/* todo fix hidden placeholder when using the filed multi time */}
			<FormSelect
				form={form}
				name="language"
				items={[{ id: "1", name: "item one" }]}
				label="select lang"
			/>

			<FormSelect
				form={form}
				name="publishingRights"
				items={[{ id: "3", name: "item one" }]}
				label="select rights"
			/>

			<FormSelect
				form={form}
				name="categories"
				items={[{ id: "1", name: "item one" }]}
				label="select categories"
			/>

			{/* <FormInput form={form} name="categories" placeholder="categories" /> */}
			<Button type="button" className="w-64 ms-auto" onClick={goNext}>
				done
			</Button>
		</>
	);
}

function StepSecond({ form, onDone }: StepProps) {
	const goNext = async () => {
		const isValid = await form.trigger(["description"]);
		if (isValid) {
			onDone();
		}
	};

	return (
		<>
			<FormInput form={form} name="description" placeholder="description" />
			<FormImage form={form} name="cover" label="cover" />
			<Button type="button" onClick={goNext} className="w-64 ml-auto">
				done
			</Button>
		</>
	);
}

function StepThird({ form, onDone }: StepProps) {
	return (
		<>
			<FormInput form={form} name="language" />
			<Button
				type="submit"
				className="w-64 ms-auto"
				disabled={
					form.formState.isSubmitting ||
					form.formState.isLoading ||
					form.formState.isValidating
				}
				isLoading={form.formState.isSubmitting || form.formState.isLoading}
			>
				Publish
			</Button>
		</>
	);
}
export default PublishBookForm;
