import Hello from "@/components/Hello";
import ThemeToggle from "@/components/ThemeToggle";
import { signUp } from "@/lib/graphql";

export default async function Home() {
	const data = await signUp({
		email: "mo@gmail.com",
		name: "ahmed",
		password: "Asd@1234",
	});
	console.log(data.data);

	return (
		<div className="h-full flex justify-center items-center">
			<ThemeToggle />
			<Hello />
		</div>
	);
}
