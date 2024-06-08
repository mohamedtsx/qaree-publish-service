"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
	Suspense,
	useEffect,
	useState,
	useTransition,
	type ReactNode,
} from "react";
import { Button } from "./ui/button";
import {
	ChevronLeft,
	ChevronRight,
	PanelLeft,
	PanelLeftClose,
} from "lucide-react";

interface ViewerContainerProps {
	children: ReactNode;
	content: Array<{
		id: string;
		title: string;
	}>;
}

export function BookViewerContainer({
	children,
	content,
}: ViewerContainerProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const searchParams = useSearchParams();

	const canGoTo = (somewehre: "prev" | "next"): boolean => {
		return false;
	};

	const goNext = () => {
		startTransition(() => {
			const contentId = searchParams.get("contentId") ?? content[0].id;
			const index = content.findIndex((el) => el.id === contentId);
			if (index === -1) {
				throw Error("Invalid content id");
			}
			router.push(`?contentId=${content[index + 1].id}`);
		});
	};

	const goPrev = () => {
		startTransition(() => {
			const contentId = searchParams.get("contentId");
			const index = content.findIndex((el) => el.id === contentId);
			if (index === -1) {
				throw Error("Invalid content id");
			}
			router.push(`?contentId=${content[index - 1].id}`);
		});
	};

	const goSomewhere = (contentId: string) => {
		startTransition(() => {
			const index = content.findIndex((el) => el.id === contentId);
			if (index === -1) {
				throw Error("Invalid content id");
			}
			router.push(`?contentId=${contentId}`);
		});
	};

	const getTitle = () => {
		const contentId = searchParams.get("contentId") ?? content[0].id;
		const element = content.find((el) => el.id === contentId);
		return element?.title;
	};

	return (
		<div className="flex items-center justify-center">
			<div>
				<nav className="flex justify-between items-center p-2">
					<div className="flex gap-6">
						<div className="flex-1 flex items-center">
							<Button size={"icon"} variant={"outline"}>
								<PanelLeft />
								{/* <PanelLeftClose /> */}
							</Button>
							<h3>{getTitle()}</h3>
							{/* <h3>hello world</h3> */}
						</div>
						<Button size={"icon"} variant={"outline"} onClick={goPrev}>
							<ChevronLeft />
						</Button>
						<Button size={"icon"} variant={"outline"} onClick={goNext}>
							<ChevronRight />
						</Button>
					</div>
				</nav>
				<div>
					<aside>aside show book conetnt</aside>
					{isPending ? <>Loading...</> : children}
				</div>
			</div>
		</div>
	);
}
