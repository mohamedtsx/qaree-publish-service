import { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { publishBookAction } from "@/app/actions";
import { toast } from "sonner";
import { getDraftBookQuery } from "@/lib/graphql/queries";
import { fetcher } from "@/lib/graphql/fetcher";
import type { ResultOf } from "gql.tada";
import { Spinner } from "../Spinner";
import Image from "next/image";
import { cn, formatCurrency, formatDate, formatEdition } from "@/lib/utils";
import { Badge } from "../ui/badge";

type Book = ResultOf<typeof getDraftBookQuery>;

export const Step3 = ({
	onDone,
	data,
}: {
	onDone: () => void;
	data: {
		bookId: string;
	};
}) => {
	const [loading, setLoading] = useState(false);
	const [book, setBook] = useState<ResultOf<typeof getDraftBookQuery>>();
	const [bookLoading, setBookLoading] = useState(false);

	const publish = async () => {
		setLoading(true);
		const { success, message } = await publishBookAction(data.bookId);
		if (!success) {
			setLoading(false);
			return toast.error(message);
		}
		setLoading(false);
		// show a message fore now, later better to show thanks page
		toast.success(message);
	};

	useEffect(() => {
		if (data.bookId) {
			setBookLoading(true);
			try {
				fetcher({
					query: getDraftBookQuery,
					variables: {
						bookId: data.bookId,
					},
					server: false,
				}).then((result) => {
					setBook(result);
					setBookLoading(false);
				});
			} catch (error) {
				let message = "Somethign went wrong!";
				if (error instanceof Error) {
					message = error.message;
				}
				setLoading(false);
				toast.error(message);
			}
		}
	}, [data.bookId]);

	return (
		<div className="p-4 space-y-8">
			<div className="min-h-40">
				{bookLoading && <Spinner className="size-8 mx-auto border-t-primary" />}

				{book?.getBook ? <Preview book={book} /> : null}
			</div>

			<div className="flex justify-end">
				<Button
					isLoading={loading}
					type="button"
					onClick={publish}
					className="w-40 mt-4"
				>
					Publish
				</Button>
			</div>
		</div>
	);
};
const Preview = ({ book }: { book: Book }) => {
	const { getBook } = book;
	const nonNullableBook = getBook as NonNullable<typeof getBook>;
	const {
		language,
		name,
		categories,
		cover,
		description,
		edition,
		file,
		isbn,
		price,
		status,
		publishingRights,
		previousPublishingData,
	} = nonNullableBook;

	return (
		<div>
			<h2 className="text-xl sm:text-3xl capitalize mb-4">{name}</h2>
			<div className="flex justify-between gap-12 max-sm:flex-col-reverse">
				<ul className="w-full">
					<Item
						itemKey={"Language"}
						value={language === "en" ? "English" : "Arabic"}
					/>
					<Item itemKey={"Price"} value={formatCurrency(price as number)} />
					<Item
						itemKey={"Edition"}
						value={formatEdition(nonNullableBook?.edition as number)}
					/>
					<Item itemKey={"Rights"} value={publishingRights ? "Yes" : "No"} />
					<Item itemKey={"Edition"} value={formatEdition(edition ?? 1)} />
					<Item itemKey={"Status"} value={status} />
					<Item itemKey={"ISBN"} value={isbn} />
					<Item
						itemKey={"Previous Publishing Date"}
						value={formatDate(previousPublishingData as string)}
					/>
				</ul>
				<div className="w-full max-w-xs aspect-[6/9]">
					<div className="rounded-md bg-muted p-4  ">
						<Image
							src={cover?.path as string}
							alt={`${name} cover`}
							className=" size-full"
							width={400}
							height={600}
						/>
					</div>
					<a
						href={file?.path as string}
						download
						className={cn(
							buttonVariants({
								variant: "outline",
								className: "w-full mt-2",
							}),
						)}
					>
						Download E-Book
					</a>
				</div>
			</div>
			<div className="p-4">
				<p className="max-w-5xl text-balance">{description}</p>
				<div className="mt-4 flex gap-4 flex-wrap">
					{categories?.map((el) => (
						<Badge
							key={`${el?._id}_${el?.name_en}`}
							style={{
								backgroundColor: el?.background as string,
							}}
						>
							{el?.name_en}
						</Badge>
					))}
				</div>
			</div>
		</div>
	);
};
const Item = ({
	itemKey,
	value,
}: { itemKey: string; value: string | null }) => (
	<li className="p-4 rounded-lg capitalize odd:bg-muted flex items-center justify-between">
		<div>{itemKey}</div>
		<div>{value ? value : "_"}</div>
	</li>
);
