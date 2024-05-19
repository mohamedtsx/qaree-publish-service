import { PublishForm } from "@/components/publish/PublishForm";
import { fetcher } from "@/lib/graphql/fetcher";
import { getDraftBookQuery } from "@/lib/graphql/queries";
import React from "react";

const getDraftBook = async (bookId: string) => {
	const data = await fetcher({
		query: getDraftBookQuery,
		variables: {
			bookId,
		},
		server: true,
	});

	if (!data.getBook) {
		throw Error("Error: getDraftBookQuery");
	}

	return data;
};

async function PublishDraftBook({ params: { draft = "" } }) {
	// const data = await getDraftBook(draft);
	const data = {
		getBook: {
			_id: "6608ca9c9bd556631e84b44c",
		},
	};

	return (
		<div>
			<PublishForm type="draft" draftBook={data} />
		</div>
	);
}

export default PublishDraftBook;
