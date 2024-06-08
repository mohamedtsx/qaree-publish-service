"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
	Suspense,
	useEffect,
	useState,
	useTransition,
	type ReactNode,
} from "react";

interface ViewerLayoutProps {
	children: ReactNode;
	content: Array<{
		id: string;
		title: string;
	}>;
}

export function BookViewerLayout({ children, content }: ViewerLayoutProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const searchParams = useSearchParams();

	return (
		<div>
			<header>
				<button
					type="button"
					onClick={async () => {
						startTransition(() => {
							console.log("Start");
							const contentId = searchParams.get("contentId") ?? content[0].id;
							const index = content.findIndex((el) => el.id === contentId);
							if (index === -1) {
								throw Error("Invalid content id");
							}
							router.push(`?contentId=${content[index + 1].id}`);
							console.log("End");
						});
					}}
				>
					go next
				</button>
				<div>
					<div>menu icon</div>
					<h3>book name</h3>
				</div>
			</header>
			<div>
				<aside>aside show book conetnt</aside>
				{isPending ? <>Loading...</> : children}
			</div>
		</div>
	);
}
