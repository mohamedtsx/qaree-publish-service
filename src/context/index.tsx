"use client";

import { createContext, useState, useContext } from "react";

import type { ReactNode, Dispatch, SetStateAction } from "react";

interface State {
	bookId: string;
	categories: string[];
	chapters: string[];
}

interface ContextProps {
	publishState: State;
	setPublishState: Dispatch<SetStateAction<State>>;
}

const DEFAULT_STATE: State = {
	bookId: "",
	categories: [],
	chapters: [],
};

const PublishFormContext = createContext<ContextProps>({
	publishState: DEFAULT_STATE,
	setPublishState: (): State => DEFAULT_STATE,
});

export const PublishFormContextProvider = ({
	children,
}: { children: ReactNode }) => {
	const [publishState, setPublishState] = useState(DEFAULT_STATE);

	return (
		<PublishFormContext.Provider value={{ publishState, setPublishState }}>
			{children}
		</PublishFormContext.Provider>
	);
};

export function usePublishFormContext() {
	return useContext(PublishFormContext);
}
