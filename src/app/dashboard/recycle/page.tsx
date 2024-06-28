import { DataTable, type TableSetting } from "@/components/DataTable";
import { fetcher } from "@/lib/graphql/fetcher";
import { getBooksFromRecycleBinQuery } from "@/lib/graphql/queries";
import { tags } from "@/lib/graphql/tags";
import { type RecycleBook, columns } from "./columns";
import { Trash } from "lucide-react";

const getData = async ({
  pageNumber,
  sizeNumber,
  filter,
  sort,
}: TableSetting) => {
  const { getBooksFromRecycleBin } = await fetcher({
    query: getBooksFromRecycleBinQuery,
    variables: {
      limit: sizeNumber,
      page: pageNumber,
      filterBy: filter,
      sortBy: sort,
    },
    server: true,
    tags: [tags.bin],
  });

  return {
    books: getBooksFromRecycleBin?.books,
    total: getBooksFromRecycleBin?.total,
  };
};
export default async function Page({
  searchParams: { page = "1", size = "5", filter = "", sort = "" },
}) {
  let pageNumber = Number.parseInt(page);
  const sizeNumber = Number(size);

  if (Number.isNaN(pageNumber)) {
    pageNumber = 1;
  }

  const { books, total } = await getData({
    pageNumber,
    sizeNumber,
    filter,
    sort,
  });

  if (!total) {
    return (
      <div className=" h-full flex items-center justify-center">
        <div className="flex items-center text-muted-foreground flex-col gap-2">
          <Trash className="size-24 " strokeWidth={1} />
          <p className="text-center max-w-xs sm:px-4">
            All clear! There`s nothing in your recycle bin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={books as Array<RecycleBook>}
      paginationConfig={{
        state: {
          pageIndex: pageNumber - 1,
          pageSize: sizeNumber,
        },
        rowCount: total ?? 0,
      }}
    />
  );
}
