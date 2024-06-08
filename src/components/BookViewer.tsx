import { getCurrentUser } from "@/lib/authOptions";
import { BACKEND_BASE_URL } from "@/lib/graphql";
import { BookViewerContainer } from "./BookViewerContainer";
import { getHtmlContentQuery } from "@/lib/graphql/queries";
import { fetcher } from "@/lib/graphql/fetcher";
import {
	Dialog,
	DialogContent,
	DialogContent2,
	DialogOverlay,
	DialogPortal,
	DialogTrigger,
} from "./ui/dialog";
import { ReactNode } from "react";

const getHtmlContent = async (bookId: string) => {
	const { getBookEPubContent } = await fetcher({
		query: getHtmlContentQuery,
		variables: {
			bookId,
		},
		server: true,
	});

	if (!getBookEPubContent?.allHTML) {
		throw Error("Cannot get book content!");
	}

	const items = getBookEPubContent.allHTML.map((el, index) => {
		return {
			...el,
			title: getBookEPubContent?.content
				? getBookEPubContent.content[index]?.title ?? "unkown"
				: "unkown",
		};
	});

	// return getBookEPubContent.allHTML as Array<{
	// 	id: string;
	// 	title: string;
	// }>;

	// TODO: use html contnt titles after bing nonnullable
	return items as Array<{
		id: string;
		title: string;
	}>;
};

const getBookChapter = async (bookId: string, chapter: string) => {
	const user = await getCurrentUser();

	const res = await fetch(`${BACKEND_BASE_URL}/read/${bookId}/${chapter}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${user.access_token}`,
			accept: "text/html",
		},
		cache: "force-cache",
	});

	if (!res.ok) {
		throw Error(res.statusText);
	}

	const text = await res.text();

	return text;
};

interface Props {
	bookId: string;
	contentId: string;
}

export async function BookViewer({ bookId, contentId }: Props) {
	const htmlContent = await getHtmlContent(bookId);
	const found = htmlContent.some((el) => el.id === contentId);

	if (contentId && !found) {
		throw Error("Invalid content id!");
	}

	const htmlText = await getBookChapter(bookId, contentId ?? htmlContent[0].id);

	return (
		<Dialog>
			<DialogTrigger>click me</DialogTrigger>
			<DialogContent2 className="max-w-5xl p-0">
				<BookViewerContainer content={htmlContent}>
					<div
						// biome-ignore lint: using dangerouslySetInnerHTML
						dangerouslySetInnerHTML={{ __html: htmlText }}
					/>
				</BookViewerContainer>
			</DialogContent2>
		</Dialog>
	);
}

// const CustomeDialogContent = ({ children }: { children: ReactNode }) => {
// 	return (
// 		<DialogPortal>
// 			<DialogOverlay />
// 			<DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
// 				{children}
// 			</DialogPrimitive.Content>
// 		</DialogPortal>
// 	);
// };
