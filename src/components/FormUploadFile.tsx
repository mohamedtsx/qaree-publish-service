import type React from "react";
import { useCallback, useId, useState } from "react";
import type {
	Control,
	FieldPath,
	FieldValues,
	UseFormReturn,
} from "react-hook-form";
import { useController, useFormContext } from "react-hook-form";
import { uploadFileAction } from "@/app/actions";
import EbupIcon from "./EbupIcon";
import { CheckCheck } from "lucide-react";
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

export function FormUploadFile<
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
			formData.append("file", file);

			const token = session.data?.user.access_token;

			try {
				await fetch(UPLOAD_FULL_URL.file(bookId), {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
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
				setSelectedFile(undefined);
				field.onChange(false);
			}

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
			title="Upload a file (max 50mg)"
		>
			<div className="flex items-center justify-center group  cursor-pointer rounded h-full border border-primary/20 hover:border-primary/50 transition  bg-muted text-muted-foreground">
				{!selectedFile && !field.value ? (
					<EbupIcon />
				) : loading ? (
					<div className="animate-spin duration-3000">
						<EbupIcon />
					</div>
				) : (
					<div className="flex flex-col items-center justify-center">
						<CheckCheck className="size-12" />
						<p className="px-2 line-clamp-2 text-center">
							{selectedFile?.name ?? "File Uploaded"}
						</p>
					</div>
				)}
			</div>

			<input
				id={id}
				type="file"
				accept="application/epub+zip"
				onChange={onSelectFile}
				className="sr-only appearance-none"
				ref={field.ref}
				disabled={loading}
			/>
		</label>
	);
}
