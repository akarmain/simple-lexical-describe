import type { Metadata } from "next";
import { ReactNode } from "react";
import { FormProvider } from "@/lib/FormContext";

export const metadata: Metadata = {
	title: "Demo",
	description: "Пример с React Context",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="ru">
			<body>
				<FormProvider>
					{children}
				</FormProvider>
			</body>
		</html>
	);
}
