import Image from "next/image";
import type React from "react";
import { useCallback, useId, useState } from "react";
import type {
	Control,
	FieldPath,
	FieldValues,
	UseFormReturn,
} from "react-hook-form";
import { useController, useFormContext } from "react-hook-form";
import { Loader2 } from "./Loader2";
import { uploadCoverAction } from "@/app/actions";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { UPLOAD_FULL_URL } from "@/lib/graphql";
import { useSession } from "next-auth/react";

interface Props<Form extends FieldValues, Name extends FieldPath<Form>> {
	control?: Control<Form>;
	form?: UseFormReturn<Form>;
	name: Name;
	bookId: string;
	label?: string;
	defaultValue?: string;
	className?: string;
}

export function FormUploadImage<
	Form extends FieldValues,
	Name extends FieldPath<Form>,
>({ name, label, bookId, defaultValue, className }: Props<Form, Name>) {
	const id = useId();
	const { control } = useFormContext<Form>();

	const { field } = useController<Form, Name>({
		control,
		name: name as Name,
	});

	const [selectedFile, setSelectedFile] = useState<File>();
	const [loading, setLoading] = useState(false);
	const session = useSession();

	const onSelectFile = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) return;
			setSelectedFile(file);
			setLoading(true);

			// uploading process
			const formData = new FormData();
			formData.append("cover", file);

			try {
				const res = await fetch(UPLOAD_FULL_URL.cover(bookId), {
					method: "POST",
					headers: {
						Authorization: `Bearer ${session.data?.user.access_token}`,
						accept: "application/json",
						contentType: "multipart/form-data",
					},
					body: formData,
				});

				field.onChange(true);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Something went wrong!";
				toast.error(message);
				field.onChange(false);
				setSelectedFile(undefined);
			}

			// const { success, message } = await uploadCoverAction(formData, bookId);
			// if (!success) {
			// 	toast.error(message);
			// 	setSelectedFile(undefined);
			// }
			// field.onChange(success);

			setLoading(false);
			field.onBlur();
		},
		[bookId, field, session.data?.user.access_token],
	);

	return (
		<label
			htmlFor={id}
			className={cn(
				"relative ring-0 ring-primary has-[input:focus-visible]:ring-1 block",
				className,
			)}
			title="Upload a file (max 2mg)"
		>
			<div className="flex  items-center justify-center group  cursor-pointer rounded h-full border border-primary/20 hover:border-primary/50 transition  bg-muted text-muted-foreground">
				{!selectedFile ? (
					<div>
						<ImageIcon className="size-24 opacity-80 group-hover:opacity-100 transition" />
					</div>
				) : (
					<Image
						src={defaultValue || URL.createObjectURL(selectedFile)}
						alt={label ?? ""}
						className="size-full object-contain px-2 object-center"
						fill
					/>
				)}
			</div>

			<input
				id={id}
				type="file"
				accept="image/*"
				onChange={onSelectFile}
				className="sr-only appearance-none"
				ref={field.ref}
				disabled={loading}
			/>

			{loading && (
				<div className="absolute flex items-center justify-center inset-0 backdrop-blur-sm">
					<Loader2 />
				</div>
			)}
		</label>
	);
}
