"use client";

import React, {
	createContext,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";

export type FormData = {
	inputLexicalJSON?: string;
};

export type FormContextType = {
	data: FormData;
	setMany: (patch: Partial<FormData>) => void;
	reset: () => void;
};

const FormContext = createContext<FormContextType | null>(null);

export function useFormContext(): FormContextType {
	const ctx = useContext(FormContext);
	if (!ctx) {
		throw new Error("useFormContext must be used within <FormProvider>");
	}
	return ctx;
}

export function FormProvider({ children }: { children: ReactNode }) {
	const [data, setData] = useState<FormData>({});

	const api = useMemo<FormContextType>(
		() => ({
			data,
			setMany: (patch) => setData((prev) => ({ ...prev, ...patch })),
			reset: () => setData({}),
		}),
		[data]
	);

	return <FormContext.Provider value={api}>{children}</FormContext.Provider>;
}
