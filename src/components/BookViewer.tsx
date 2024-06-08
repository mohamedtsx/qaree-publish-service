import { getCurrentUser } from "@/lib/authOptions";
import { BACKEND_BASE_URL } from "@/lib/graphql";
import { Button } from "./ui/button";
import { BookViewerContainer } from "./BookViewerContainer";
import { getHtmlContentQuery } from "@/lib/graphql/queries";
import { fetcher } from "@/lib/graphql/fetcher";

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
		<BookViewerContainer content={htmlContent}>
			<div
				className=" bg-muted px-4"
				// biome-ignore lint: using dangerouslySetInnerHTML
				dangerouslySetInnerHTML={{ __html: htmlText }}
			/>
		</BookViewerContainer>
	);
}
