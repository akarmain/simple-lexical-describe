export function sanitizeUrl(input: string): string {
	const url = input.trim();
	if (!url) return "";
	if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../")) return url;
	try {
		const u = new URL(url);
		const protocol = u.protocol.toLowerCase();
		if (protocol === "http:" || protocol === "https:" || protocol === "mailto:" || protocol === "tel:") {
			return url;
		}
		return "about:blank";
	} catch {
		return "about:blank";
	}
}
