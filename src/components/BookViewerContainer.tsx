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
import { Spinner } from "./Spinner";
import { cn } from "@/lib/utils";

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
	const searchParams = useSearchParams();

	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);

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
		<div className="flex items-center justify-center  size-full">
			<div className="relative pt-16 w-full max-w-5xl border rounded-xl overflow-hidden h-[80vh]">
				<nav className="absolute border-b inset-x-0 top-0 h-16 py-2 flex justify-between px-4 ">
					<div className="flex-1 flex items-center gap-4">
						<Button
							size={"icon"}
							variant={"outline"}
							onClick={() => {
								setOpen(!open);
							}}
						>
							{open ? <PanelLeftClose /> : <PanelLeft />}
						</Button>
						<h3>{getTitle()}</h3>
					</div>
					<div className="flex gap-6 items-center">
						<Button size={"icon"} variant={"outline"} onClick={goPrev}>
							<ChevronLeft />
						</Button>
						<Button size={"icon"} variant={"outline"} onClick={goNext}>
							<ChevronRight />
						</Button>
					</div>
				</nav>
				<div className="flex">
					<aside
						className={cn(
							"w-0 h-ful overflow-hiddenl transition-all",
							open && "w-96",
						)}
					>
						aside show book conetnt
					</aside>
					<div className="size-full flex items-center justify-center">
						{isPending ? <Spinner /> : children}
					</div>
				</div>
			</div>
		</div>
	);
}
