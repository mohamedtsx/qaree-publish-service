"use client";

import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { SelectItems } from "@/lib/graphql/types";
import { useId } from "react";

interface SharedProps<T extends FieldValues> {
	form?: UseFormReturn<T>;
	name: FieldPath<T>;
}

interface FormElementProps<T extends FieldValues, Name extends FieldPath<T>>
	extends SharedProps<T> {
	items: SelectItems;
	label: string;
}

export function FormRadioGroup<
	T extends FieldValues,
	Name extends FieldPath<T>,
>({ items, name, label, form: _ }: FormElementProps<T, Name>) {
	const form = useFormContext<T>();

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className="space-y-3">
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<RadioGroup
							onValueChange={field.onChange}
							defaultValue={field.value}
							className="flex flex-col space-y-1"
						>
							{items.map((el) => (
								<FormItem
									key={el.value}
									className="flex items-center space-x-3 space-y-0"
								>
									<FormControl>
										<RadioGroupItem value={el.value} />
									</FormControl>
									<FormLabel className="font-normal py-1 !text-primary">
										{el.label}
									</FormLabel>
								</FormItem>
							))}
						</RadioGroup>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export default FormRadioGroup;
