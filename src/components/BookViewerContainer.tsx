"use client";

import { cn } from "@/lib/utils";
import {
	ChevronLeft,
	ChevronRight,
	PanelLeft,
	PanelLeftClose,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	type ReactNode,
	Suspense,
	useEffect,
	useState,
	useTransition,
} from "react";
import { Spinner } from "./Spinner";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

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
	const pathname = usePathname();

	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);

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

	const contentId = searchParams.get("contentId") ?? content[0].id;
	const current = content.find((el) => el.id === contentId);

	const canGoPrev = current?.id !== content[0].id;
	const canGoNext = current?.id !== content[content.length - 1].id;

	return (
		<div className="border rounded-xl overflow-hidden">
			<nav className="bg-background border-b h-16 py-2 flex justify-between px-4 ">
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
					<h3>{current?.title}</h3>
				</div>
				<div className="flex gap-6 items-center">
					<Button
						size={"icon"}
						variant={"outline"}
						onClick={goPrev}
						disabled={!canGoPrev}
					>
						<ChevronLeft />
					</Button>
					<Button
						size={"icon"}
						variant={"outline"}
						onClick={goNext}
						disabled={!canGoNext}
					>
						<ChevronRight />
					</Button>
				</div>
			</nav>
			<div className="flex">
				<div
					className={cn(
						"w-0 transition-all py-4 h-[80vh] overflow-auto no-scrollbar ",
						open && "w-72 border-r",
					)}
				>
					<div className="flex flex-col px-2">
						{content.map((el) => {
							return (
								<Link
									key={el.id}
									href={`${pathname}?contentId=${el.id}`}
									scroll={false}
									className={cn(
										"p-2 hover:bg-muted rounded transition text-ellipsis text-nowrap overflow-hidden",
										el.id === current?.id && "bg-muted",
									)}
									onClick={() => goSomewhere(el.id)}
								>
									{el.title}
								</Link>
							);
						})}
					</div>
				</div>
				<ScrollArea className="w-full h-[80vh] px-4">
					{isPending ? (
						<div className="h-[80vh] flex items-center justify-center">
							<Spinner className="border-t-primary" />
						</div>
					) : (
						children
					)}
				</ScrollArea>
			</div>
		</div>
	);
}
