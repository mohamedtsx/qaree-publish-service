import Hello from "@/components/Hello";
import ThemeToggle from "@/components/themeToggle";

export default function Home() {
	return (
		<div className="h-full flex justify-center items-center">
			<ThemeToggle />
			<Hello />
		</div>
	);
}
