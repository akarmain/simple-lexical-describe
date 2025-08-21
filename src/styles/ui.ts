import type React from "react";

export const pageStyles: Record<string, React.CSSProperties> = {
	wrapper: { maxWidth: 1200, margin: "0 auto", padding: "24px", fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial", color: "#0f172a" },
	h1: { fontSize: 28, fontWeight: 700, marginBottom: 16 },
	h2: { fontSize: 18, fontWeight: 700, margin: "0 0 12px 0" },
	columns: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
	card: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", overflow: "hidden" },
};

export const editorStyles: Record<string, React.CSSProperties> = {
	container: { display: "flex", flexDirection: "column", gap: 8 },
	editorOuter: { border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", background: "#f8fafc" },
	editorInner: { position: "relative" },
	contentEditable: { minHeight: 260, padding: 12, outline: "none", background: "#ffffff", fontSize: 16, lineHeight: 1.6, whiteSpace: "pre-wrap" },
	placeholder: { position: "absolute", top: 12, left: 12, pointerEvents: "none", opacity: 0.5, fontSize: 16 },
	linkWrapper: { marginTop: 8, position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "10px 18px", borderRadius: 8, backgroundColor: "#111827", color: "#ffffff", fontSize: 15, fontWeight: 500, lineHeight: "20px", textDecoration: "none", cursor: "pointer", transition: "background-color 0.2s ease, transform 0.1s ease", userSelect: "none" },
};

export const toolbarStyles: Record<string, React.CSSProperties> = {
	wrapper: { display: "flex", gap: 8, padding: "8px 8px", border: "1px solid #e2e8f0", borderRadius: 10, background: "#f1f5f9" },
};

export const previewStyles: Record<string, React.CSSProperties> = {
	pre: { background: "#0b1021", color: "#e5e7eb", padding: 12, borderRadius: 10, minHeight: 260, overflow: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", border: "1px solid #0f172a22" },
};

export const renderStyles: Record<string, React.CSSProperties> = {
	htmlBox: { minHeight: 260, border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, background: "#ffffff" },
};
