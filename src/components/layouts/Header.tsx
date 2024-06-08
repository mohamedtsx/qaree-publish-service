import { Suspense } from "react";
import { MobileMenu } from "../MobileMenu";
import UserNav from "../UserNav";

function Header() {
	return (
		<header className="border-b max-lg:bg-muted/40">
			<div className="px-6 lg:h-[60px] flex justify-between h-14 items-center gap-4">
				<div className="flex gap-2">
					<div className="lg:hidden">
						<MobileMenu />
					</div>
					{/* <SearchForm /> */}
				</div>
				<div className="flex items-center gap-4">
					<Suspense fallback={<div className="size-8 rounded-full bg-muted" />}>
						<UserNav />
					</Suspense>
				</div>
			</div>
		</header>
	);
}

export default Header;
