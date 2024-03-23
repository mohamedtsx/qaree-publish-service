import { env } from "@/env";

export const BACKEND_URL = env.NEXT_PUBLIC_BACKEND_URL;

export const UPLOAD_FULL_URL = {
	cover: (bookId: string) => `${BACKEND_URL}/book/cover/${bookId}`,
	file: (bookId: string) => `${BACKEND_URL}/book/file/${bookId}`,
	sample: (bookId: string) => `${BACKEND_URL}/book/sample/${bookId}`,
};
