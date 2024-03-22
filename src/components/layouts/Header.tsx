import ThemeToggle from "../ThemeToggle";
import { UserNav } from "../UserNav";
import SearchForm from "./SearchForm";

function Header() {
	return (
		<header className="flex justify-between h-14 items-center gap-4 border-b lg:h-[60px] px-24 mb-12">
			<SearchForm />
			<div className="flex items-center gap-4">
				<ThemeToggle />
				<UserNav />
			</div>
		</header>
	);
}

export default Header;
