"use client";

import { createContext, useContext, useState } from "react";

import type { Dispatch, ReactNode, SetStateAction } from "react";

interface State {
	bookId: string;
	categories: string[];
	sampleItems: { label: string; value: string }[];
	sampleItemsIsLoading: boolean;
	sampleSelectedValues: string[];
}

interface ContextProps {
	publishState: State;
	setPublishState: Dispatch<SetStateAction<State>>;
}

const DEFAULT_STATE: State = {
	bookId: "",
	categories: [],
	sampleItems: [],
	sampleSelectedValues: [],
	sampleItemsIsLoading: false,
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
