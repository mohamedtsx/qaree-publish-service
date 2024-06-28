import { getCurrentUser } from "@/lib/authOptions";
import { BACKEND_BASE_URL } from "@/lib/graphql";
import { fetcher } from "@/lib/graphql/fetcher";
import { getHtmlContentQuery } from "@/lib/graphql/queries";
import { Eye } from "lucide-react";
import { BookViewerContainer } from "./BookViewerContainer";
import { Button } from "./ui/button";
import { Dialog, DialogContent2, DialogTrigger } from "./ui/dialog";

const getHtmlContent = async (bookId: string) => {
  try {
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
    return items as Array<{
      id: string;
      title: string;
    }>;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log(error);
    }
    return [];
  }
};

const getBookChapter = async (bookId: string, chapter: string) => {
  const user = await getCurrentUser();

  try {
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
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log(error);
    }
    return "";
  }
};

interface Props {
  bookId: string;
  contentId: string;
}

export async function BookViewer({ bookId, contentId }: Props) {
  const htmlContent = await getHtmlContent(bookId);

  const htmlText = await getBookChapter(bookId, contentId ?? htmlContent[0].id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="gap-2 w-full">
          <Eye className="size-5" />
          <span>View Book</span>
        </Button>
      </DialogTrigger>
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
