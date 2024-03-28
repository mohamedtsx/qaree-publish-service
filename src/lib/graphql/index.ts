import { env } from "@/env";

export const BACKEND_URL = env.NEXT_PUBLIC_BACKEND_URL;

// todo remove this publish url
export const UPLOAD_FULL_URL = {
	cover: (bookId: string) =>
		`https://qaree-backend.onrender.com/upload/book/cover/${bookId}`,
	file: (bookId: string) => `${BACKEND_URL}/upload/book/file/${bookId}`,
	sample: (bookId: string) => `${BACKEND_URL}/upload/book/sample/${bookId}`,
};
