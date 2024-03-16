import { cn } from "@/lib/utils";
import { Icons } from "./Icons";
import { lusitana } from "@/lib/fonts";

function Logo() {
	return (
		<div>
			<Icons.logo className="me-2 h-12 w-12 rotate-[15deg]" />
			<div className={cn("text-4xl font-semibold", lusitana.className)}>
				Qaree
			</div>
		</div>
	);
}

export default Logo;
