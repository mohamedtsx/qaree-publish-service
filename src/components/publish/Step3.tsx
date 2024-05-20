import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { publishBookAction } from "@/app/actions";
import { toast } from "sonner";
import { getDraftBookQuery } from "@/lib/graphql/queries";
import { fetcher } from "@/lib/graphql/fetcher";
import type { ResultOf } from "gql.tada";
import { Spinner } from "../Spinner";

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
	const [preview, setPreview] = useState<ResultOf<typeof getDraftBookQuery>>();
	const [previewLoading, setPreviewLoading] = useState(false);

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
			setPreviewLoading(true);
			try {
				fetcher({
					query: getDraftBookQuery,
					variables: {
						bookId: data.bookId,
					},
					server: false,
				}).then((result) => {
					setPreview(result);
					setPreviewLoading(false);
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
			<div className="min-h-40 bg-muted">
				{previewLoading && (
					<Spinner className="size-8 mx-auto border-t-primary" />
				)}

				<pre>{JSON.stringify(preview, null, 2)}</pre>
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
