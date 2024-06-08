import { getBookEPubContentAction } from "@/app/actions";
import { BookViewer } from "@/components/BookViewer";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { authOptions } from "@/lib/authOptions";
import { BACKEND_BASE_URL } from "@/lib/graphql";
import { fetcher } from "@/lib/graphql/fetcher";
import {
	getBookEPubContentQuery,
	getBookQuery,
	getHtmlContentQuery,
} from "@/lib/graphql/queries";
import type { DeepNonNullable } from "@/lib/graphql/types";
import { siteConfig } from "@/lib/site";
import {
	cn,
	formatCurrency,
	formatDate,
	formatEdition,
	formatRate,
} from "@/lib/utils";
import {
	ArrowRightIcon,
	Calendar,
	Download,
	ImageIcon,
	TriangleAlertIcon,
} from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

type Props = {
	params: {
		bookId: string;
	};
	searchParams: {
		contentId: string;
	};
};

const getBook = async (bookId: string) => {
	const { getBook } = await fetcher({
		query: getBookQuery,
		variables: {
			bookId,
		},
		server: true,
		tags: [bookId],
	});

	return getBook as DeepNonNullable<typeof getBook>;
};

export default async function BookPage({
	params: { bookId },
	searchParams: { contentId },
}: Props) {
	// const book = await getBook(id);

	const book = {
		_id: "6608c9539bd556631e84b3dc",
		sample: ["num_1"],
		cover: {
			path: "https://res.cloudinary.com/dgg86hhf3/image/upload/v1716194664/book/cover/vobzmvm5pqkuyignduzf.png",
		},
		file: {
			path: "https://res.cloudinary.com/dgg86hhf3/raw/upload/v1716191811/book/file/6608c9539bd556631e84b3dc/zucil8urlorxdutsyoo4.epub",
		},
		status: "rejected",
		createdAt: "1711851859077",
		updatedAt: "1716572131223",
		publishionDate: null,
		previousPublishingData: "1711851859076",
		rejectionReasons: "Sorry, you are not the owner of this book",
		name: "one v2",
		description: "one two three",
		isbn: "",
		edition: 1,
		publishingRights: true,
		categories: [{ name_en: "distributed systems", background: "#186cb0" }],
		avgRate: 0,
		price: 0,
		language: "en",
	};

	const {
		cover: { path: cover_path },
		file: { path: file_path },
		name,
		rejectionReasons, // nullable
		description,
		categories,
		status,
		sample,
	} = book;

	return (
		<div className="space-y-5 sm:space-y-12">
			<div className="flex items-center justify-between py-2">
				<h2 className="capitalize text-2xl">{name}</h2>
				<Badge variant={"notion_incomplete"}>{status}</Badge>
			</div>

			<div className="flex gap-5 max-sm:flex-col *:w-full">
				<div className="space-y-5 md:max-w-lg">
					<div className="space-y-5">
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
					</div>
					<p className="max-w-prose sm:sr-only">{description}</p>

					<div>
						<h3 className="font-medium text-lg">Selected Sample</h3>
						<ul className="flex flex-col list-inside list-disc px-4">
							{sample.map((el) => {
								return <li key={el}>{el}</li>;
							})}
						</ul>
					</div>
					<div>
						<h3 className="font-medium text-lg mb-2 ">Categories</h3>
						<div className="flex gap-2 p-2 flex-wrap">
							{categories.map((el) => (
								<Badge
									key={el.name_en}
									style={{ backgroundColor: el.background }}
									className="flex-1 justify-center"
								>
									{el.name_en}
								</Badge>
							))}
						</div>
					</div>
				</div>
				<div>
					{/* @ts-expect-error TODO: remove me */}
					<KeyValueGroup book={book} />
					<p className="max-w-prose max-sm:sr-only mt-5 pl-2">{description}</p>
				</div>
			</div>

			{status === "rejected" && (
				<Alert variant="destructive">
					<div className="flex items-start gap-4">
						<TriangleAlertIcon className="size-5" />
						<div className="flex-1 text-base">
							<AlertTitle>Book Rejected</AlertTitle>
							<AlertDescription className="text-base ">
								We're sorry, but your book "{name}" has been rejected. The
								content did not meet our publishing guidelines.{" "}
								<details className="inline-block peer">
									<summary className="list-none hover:underline   cursor-pointer">
										View rejection reason
									</summary>
								</details>
								<p className="hidden peer-open:block mt-4 border-t border-destructive pt-4 ">
									{rejectionReasons}
								</p>
							</AlertDescription>

							<div className="mt-4 flex items-center gap-2">
								<Link
									href={siteConfig.links.whatsapp_support}
									className="text-sm font-medium text-destructive hover:underline"
									prefetch={false}
									target="_blank"
								>
									Contact support
								</Link>
								<ArrowRightIcon className="h-4 w-4" />
							</div>
						</div>
					</div>
				</Alert>
			)}

			<div className="flex sm:justify-end py-2 mt-14">
				<div className="flex max-sm:flex-col gap-2 sm:gap-4 sm:w-fit w-full">
					<BookViewer bookId={bookId} contentId={contentId} />
					<a
						href={file_path}
						download
						className={cn(
							buttonVariants({
								variant: "outline",
								className: "w-full gap-2",
							}),
						)}
					>
						<Download className="size-5" />
						<span>Download</span>
					</a>
				</div>
			</div>
		</div>
	);

	// return (
	// 	<div className="flex max-md:mx-auto max-md:flex-col gap-4 items-start">
	// <div className="w-full md:max-w-lg space-y-5">
	// 	<div className="sm:p-4 rounded-md bg-muted  flex items-center justify-center aspect-[6/9]">
	// 		{cover_path ? (
	// 			<Image
	// 				src={cover_path}
	// 				alt={name ?? "book"}
	// 				width={584}
	// 				height={932}
	// 				className="max-sm:rounded-md"
	// 			/>
	// 		) : (
	// 			<ImageIcon className="sm:size-24 text-muted-foreground" />
	// 		)}
	// 	</div>
	// 			<Card>
	// 				<CardHeader>
	// 					<CardTitle>About The Book</CardTitle>
	// 				</CardHeader>
	// 				<CardContent className="text-muted-foreground text-balance max-w-prose">
	// 					{description}
	// 				</CardContent>
	// 				<CardFooter className="flex gap-2 flex-wrap">
	// 					{categories?.map((el) => (
	// 						<Badge
	// 							key={el?.name_en}
	// 							style={{
	// 								backgroundColor: el?.background,
	// 							}}
	// 						>
	// 							{el?.name_en}
	// 						</Badge>
	// 					))}
	// 				</CardFooter>
	// 			</Card>
	// 		</div>
	// 		<div className="space-y-5 w-full">
	// 			<div className="max-sm:hidden text-muted-foreground flex items-center gap-2">
	// 				<span>{formatDate(publishionDate)}</span>
	// 				<Calendar />
	// 			</div>
	// 		</div>
	// 		<Card>
	// 			<CardHeader>
	// 				<CardTitle>Book Information</CardTitle>
	// 				<CardDescription>
	// 					description -may be some hidden info as it is not provided yet-
	// 				</CardDescription>
	// 			</CardHeader>
	// 			<CardContent>
	// 				<KeyValueGroup book={book} />
	// 			</CardContent>
	// 			<CardFooter>
	// 				<Link
	// 					href={file_path}
	// 					target="_blank"
	// 					className={buttonVariants({
	// 						variant: "outline",
	// 						className: "w-full",
	// 						size: "lg",
	// 					})}
	// 				>
	// 					View Book File
	// 				</Link>
	// 			</CardFooter>
	// 		</Card>
	// 	</div>
	// );
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
