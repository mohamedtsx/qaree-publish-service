import { type ComponentProps, useId } from "react";

import type {
	ControllerRenderProps,
	FieldPath,
	FieldValues,
	UseFormReturn,
} from "react-hook-form";

import { useFormContext, useFormState } from "react-hook-form";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

import { Button } from "./ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

interface SharedProps<T extends FieldValues> {
	form?: UseFormReturn<T>;
	name: FieldPath<T>;
}

interface FormElementProps<T extends FieldValues, Name extends FieldPath<T>>
	extends SharedProps<T> {
	render: (filed: ControllerRenderProps<T, Name>) => React.JSX.Element;
}

export function FormElement<T extends FieldValues, Name extends FieldPath<T>>({
	form: __unused_form,
	name,
	render,
}: FormElementProps<T, Name>) {
	const form = useFormContext<T>();
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{/* @ts-expect-error Why? */}
					<FormControl>{render(field)}</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

interface FormElementInputProps<T extends FieldValues>
	extends SharedProps<T>,
		Omit<
			ComponentProps<typeof Input>,
			"form" | "name" | "id" | keyof ControllerRenderProps<T, FieldPath<T>>
		> {
	label?: string;
}

export function FormInput<T extends FieldValues>({
	name,
	form,
	...props
}: FormElementInputProps<T>) {
	const id = useId();

	return (
		<FormElement
			form={form}
			name={name}
			render={({ value, ...field }) => (
				<div className="flex flex-col gap-2">
					<FormLabel>{props.label}</FormLabel>
					<Input {...props} id={id} value={value ?? ""} {...field} />
				</div>
			)}
		/>
	);
}

export function FormInputOTP<T extends FieldValues>({
	name,
	form,
}: FormElementInputProps<T>) {
	const id = useId();

	return (
		<FormElement
			form={form}
			name={name}
			render={({ value, ...field }) => (
				<InputOTP
					maxLength={6}
					pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
					render={({ slots }) => (
						<InputOTPGroup>
							{slots.map((slot, index) => (
								<InputOTPSlot key={index} {...slot} />
							))}{" "}
						</InputOTPGroup>
					)}
					id={id}
					{...field}
				/>
			)}
		/>
	);
}

type Item = { id: number; name: string };

interface FormElementSelectProps<T extends FieldValues>
	extends SharedProps<T>,
		Omit<
			ComponentProps<typeof Select>,
			"form" | "name" | "id" | keyof ControllerRenderProps<T, FieldPath<T>>
		> {
	label: string;
	items: Item[];
	onChange?: (value: number) => void | Promise<void>;
}

export function FormSelect<T extends FieldValues>({
	name,
	form,
	label,
	items,
	onChange: customOnChange,
	...props
}: FormElementSelectProps<T>) {
	return (
		<FormElement
			form={form}
			name={name}
			render={({ value, onChange, ref, ...field }) => (
				<Select
					{...props}
					value={`${value}`}
					onValueChange={async (val) => {
						onChange(Number(val));
						field.onBlur();
						await customOnChange?.(val ? Number(val) : value);
					}}
					{...field}
				>
					<div className="group">
						<SelectTrigger ref={ref}>
							<SelectValue
								value={items?.find((el) => el.id === value)?.name || null}
								placeholder={label}
							/>
						</SelectTrigger>
						<SelectContent>
							{items?.map((item) => (
								<SelectItem
									key={item.id + item.name}
									value={`${item.id}`}
									className="capitalize"
									disabled={item.id === -1}
								>
									{item?.name}
								</SelectItem>
							))}
						</SelectContent>
					</div>
				</Select>
			)}
		/>
	);
}

export const SubmitButton = <T extends FieldValues>({
	children,
}: {
	children: React.ReactNode;
	icons?: React.ReactNode;
}) => {
	const formState = useFormState<T>();
	return (
		<Button
			type="submit"
			className="w-full"
			isLoading={
				formState.isSubmitting || formState.isLoading || formState.isValidating
			}
		>
			{children}
		</Button>
	);
};
