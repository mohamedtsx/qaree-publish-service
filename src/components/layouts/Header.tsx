import SearchForm from "./SearchForm";
import ThemeToggle from "../ThemeToggle";

function Header() {
	return (
		<header className="flex justify-between h-14 items-center gap-4 border-b lg:h-[60px] px-24 mb-12">
			<SearchForm />
			<ThemeToggle />
		</header>
	);
}

export default Header;
