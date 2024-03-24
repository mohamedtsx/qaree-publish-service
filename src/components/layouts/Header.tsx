import ThemeToggle from "../ThemeToggle";
import { UserNav } from "../UserNav";
import SearchForm from "./SearchForm";

function Header() {
	return (
		<header className="border-b">
			<div className="container lg:h-[60px] flex justify-between h-14 items-center gap-4">
				<SearchForm />
				<div className="flex items-center gap-4">
					<ThemeToggle />
					<UserNav />
				</div>
			</div>
		</header>
	);
}

export default Header;
