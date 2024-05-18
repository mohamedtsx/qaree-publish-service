"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return <div>No books found</div>;
}
