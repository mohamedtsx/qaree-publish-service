import Link from "next/link";
import Logo from "@/components/Logo";
import { ArrowRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { lusitana } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Page() {
	return (
		<main className="flex min-h-screen flex-col p-6">
			<div className="flex h-20 shrink-0 items-end rounded-lg bg-muted p-4 md:h-52">
				<Logo className="me-2" />
				<div className={cn("text-4xl font-semibold", lusitana.className)}>
					Qaree
				</div>
			</div>
			<div className="mt-4 flex grow flex-col gap-4 md:flex-row">
				<div className="flex flex-col justify-center gap-6 rounded-lg bg-muted px-6 py-10 md:w-2/5 md:px-20">
					<p
						className={cn(
							"text-xl md:text-3xl md:leading-normal",
							lusitana.className,
						)}
					>
						Unleash your inner author. Publish your book and find your readers
						with <strong>Qaree</strong>.
					</p>
					<Link
						href="/login"
						className={buttonVariants({ className: "w-fit" })}
					>
						<span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
					</Link>
				</div>
				<div className="flex items-center justify-center  md:w-3/5 relative ">
					{/* todo: replace this image with happy author illusteration */}
					<Image
						src={"https://picsum.photos/id/85/1000/760?grayscale"}
						width={1000}
						height={760}
						alt="Qaree hero"
						className="h-min"
					/>
				</div>
			</div>
		</main>
	);
}
