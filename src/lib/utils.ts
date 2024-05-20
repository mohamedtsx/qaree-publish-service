import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatDate = (value: string) => {
	const date = new Date(Number(value)).toLocaleDateString("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	return date;
};

export const formatRate = (value: number) => {
	const formatter = new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 1,
		maximumFractionDigits: 2,
	});
	const rate = formatter.format(value);

	return `${rate} Stars`;
};

export const formatCurrency = (value: number) => {
	const formatedValue = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "EGP",
	}).format(value);

	return formatedValue;
};

export const formatEdition = (editionNumber: number) => {
	const lastDigit = editionNumber % 10;
	const suffix =
		lastDigit === 1 && editionNumber !== 11
			? "st"
			: lastDigit === 2 && editionNumber !== 12
			  ? "nd"
			  : lastDigit === 3 && editionNumber !== 13
				  ? "rd"
				  : "th";
	return `${editionNumber}${suffix}`;
};
