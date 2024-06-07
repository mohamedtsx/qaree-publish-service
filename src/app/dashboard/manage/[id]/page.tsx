import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { fetcher } from "@/lib/graphql/fetcher";
import { getBookQuery } from "@/lib/graphql/queries";
import type { DeepNonNullable } from "@/lib/graphql/types";
import {
	formatCurrency,
	formatDate,
	formatEdition,
	formatRate,
} from "@/lib/utils";
import { Calendar, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
	params: {
		id: string;
	};
};

const getBook = async (bookId: string) => {
	const { getBook } = await fetcher({
		query: getBookQuery,
		variables: {
			bookId: bookId,
		},
		server: true,
		tags: [bookId],
	});

	return getBook as DeepNonNullable<typeof getBook>;
};

export default async function BookPage({ params: { id } }: Props) {
	const book = await getBook(id);

	const {
		cover: { path: cover_path },
		// createdAt,
		file: { path: file_path },
		name,
		// previousPublishingData,
		rejectionReasons, // nullable
		description,
		categories,
		// edition,
		// isbn,
		// language,
		// price,
		// publishingRights,
		status,
		// updatedAt,
		publishionDate,
		// avgRate,
		sample,
	} = book;

	return (
		<div className="flex max-md:mx-auto max-md:flex-col gap-4 items-start">
			<div className="w-full md:max-w-lg space-y-5">
				<div className="sm:p-4 rounded-md bg-muted  flex items-center justify-center aspect-[6/9]">
					{cover_path ? (
						<Image
							src={cover_path}
							alt={name ?? "book"}
							width={584}
							height={932}
							className="max-sm:rounded-md"
						/>
					) : (
						<ImageIcon className="sm:size-24 text-muted-foreground" />
					)}
				</div>
				<Card>
					<CardHeader>
						<CardTitle>About The Book</CardTitle>
					</CardHeader>
					<CardContent className="text-muted-foreground text-balance max-w-prose">
						{description}
					</CardContent>
					<CardFooter className="flex gap-2 flex-wrap">
						{categories?.map((el) => (
							<Badge
								key={el?.name_en}
								style={{
									backgroundColor: el?.background,
								}}
							>
								{el?.name_en}
							</Badge>
						))}
					</CardFooter>
				</Card>
			</div>
			<div className="space-y-5 w-full">
				<div className="max-sm:hidden text-muted-foreground flex items-center gap-2">
					<span>{formatDate(publishionDate)}</span>
					<Calendar />
				</div>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Book Information</CardTitle>
					<CardDescription>
						description -may be some hidden info as it is not provided yet-
					</CardDescription>
				</CardHeader>
				<CardContent>
					<KeyValueGroup book={book} />
				</CardContent>
				<CardFooter>
					<Link
						href={file_path}
						target="_blank"
						className={buttonVariants({
							variant: "outline",
							className: "w-full",
							size: "lg",
						})}
					>
						View Book File
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}

const KeyValueGroup = ({
	book,
}: { book: Awaited<ReturnType<typeof getBook>> }) => {
	const {
		createdAt,
		edition,
		isbn,
		language,
		price,
		publishingRights,
		status,
		updatedAt,
		publishionDate,
		avgRate,
	} = book;

	return (
		<ul>
			<Item itemKey={"Created At"} value={formatDate(createdAt)} />
			<Item itemKey={"Last Update"} value={formatDate(updatedAt)} />
			<Item
				itemKey={"Language"}
				value={language === "en" ? "English" : "Arabic"}
			/>
			<Item itemKey={"Price"} value={formatCurrency(price)} />
			<Item itemKey={"Rate"} value={formatRate(avgRate)} />
			<Item itemKey={"Rights"} value={publishingRights ? "Yes" : "No"} />
			<Item itemKey={"Edition"} value={formatEdition(edition)} />
			<Item itemKey={"Status"} value={status} />
			<Item itemKey={"Publishion Date"} value={formatDate(publishionDate)} />
			<Item itemKey={"ISBN"} value={isbn} />
		</ul>
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
