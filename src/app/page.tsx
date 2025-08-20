"use client";

import * as React from "react";
import { useCallback, useMemo, useState } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import type { LexicalEditor } from "lexical";

import { $generateHtmlFromNodes } from "@lexical/html";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";

import Toolbar from "../components/editor/Toolbar";
import { pageStyles, editorStyles, previewStyles, renderStyles } from "../styles/ui";


import { ImageNode, $createImageNode } from "../nodes/ImageNode";
import { FileCardNode, $createFileCardNode } from "../nodes/FileCardNode";


export default function Page() {
	const [html, setHtml] = useState<string>("");

	const initialConfig = useMemo(
		() => ({
			namespace: "lexical-demo-merged",
			theme: {
				paragraph: "editor-paragraph",
				link: "editor-link",
				text: { bold: "editor-text-bold", italic: "editor-text-italic" },
				list: {
					ul: "editor-ul",
					ol: "editor-ol",
					listitem: "editor-li",
					nested: { listitem: "editor-li-nested" },
				},
			},
			onError(error: unknown) {
				console.error(error);
			},
			nodes: [ListNode, ListItemNode, LinkNode, ImageNode, FileCardNode],
		}),
		[]
	);

	const handleChange = useCallback((editorState: any, editor: LexicalEditor) => {
		editorState.read(() => {
			const htmlString = $generateHtmlFromNodes(editor, null);
			setHtml(htmlString);
		});
	}, []);

	return (
		<div style={pageStyles.wrapper}>
			<h1 style={pageStyles.h1}>Lexical: форматирование + изображения/файлы + активные кнопки</h1>

			<div style={pageStyles.columns}>
				{/* 1) Редактор */}
				<div style={pageStyles.card}>
					<h2 style={pageStyles.h2}>1) Редактор</h2>
					<LexicalComposer initialConfig={initialConfig}>
						<div style={editorStyles.container}>
							<Toolbar />
							<div style={editorStyles.editorOuter}>
								<div style={editorStyles.editorInner}>
									<RichTextPlugin
										contentEditable={<ContentEditable style={editorStyles.contentEditable} />}
										placeholder={<div style={editorStyles.placeholder}>Начните печатать…</div>}
										ErrorBoundary={LexicalErrorBoundary}
									/>
									<HistoryPlugin />
									<ListPlugin />
									<LinkPlugin />
									<OnChangePlugin onChange={handleChange} />
								</div>
							</div>
						</div>
					</LexicalComposer>
				</div>

				{/* 2) Предпросмотр HTML */}
				<div style={pageStyles.card}>
					<h2 style={pageStyles.h2}>2) Предпросмотр HTML</h2>
					<pre style={previewStyles.pre}>{html}</pre>
				</div>

				{/* 3) Рендер HTML */}
				<div style={pageStyles.card}>
					<h2 style={pageStyles.h2}>3) Рендер HTML</h2>
					<div className="render-html" style={renderStyles.htmlBox} dangerouslySetInnerHTML={{ __html: html }} />
				</div>
			</div>

			{/* Глобальные классы для темы и рендера */}
			<style>{`
        .editor-paragraph { margin: 0 0 8px 0; }
        .editor-text-bold { font-weight: bold; }
        .editor-text-italic { font-style: italic; }
        .editor-link { color: #2563eb; text-decoration: underline; cursor: pointer; }
        .editor-ul { padding-left: 1.2rem; list-style: disc; }
        .editor-ol { padding-left: 1.2rem; list-style: decimal; }
        .editor-li { margin: 4px 0; }
        .editor-li-nested { list-style-type: circle; }

        /* карточки внутри редактора */
        .lex-image-wrap { position: relative; border-radius: 16px; overflow: hidden; margin: 8px 0 12px; border: 1px solid #e5e7eb; }
        .lex-image { display:block; width:100%; height:auto; }
        .lex-x { position: absolute; top: 8px; right: 8px; width:28px; height:28px; border-radius:9999px; border: 1px solid #e5e7eb; background:#fff; cursor: pointer; line-height: 24px; font-size: 18px; box-shadow: 0 1px 2px rgba(0,0,0,.08); }

        .file-card { display:flex; align-items:center; gap:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:10px 12px; margin:8px 0; }
        .file-card__icon { font-size:20px; }
        .file-card__body { display:flex; flex-direction:column; min-width:0; }
        .file-card__name { color:#111827; text-decoration:none; font-weight:600; word-break:break-all; }
        .file-card__name:hover { text-decoration:underline; }
        .file-card__meta { color:#6b7280; font-size:12px; }
        .file-card__x { margin-left:auto; width:28px; height:28px; border-radius:9999px; border:1px solid #e5e7eb; background:#fff; cursor:pointer; line-height:24px; font-size:18px; }

        /* активные кнопки тулбара */
        .btn { border:1px solid #e2e8f0; border-radius:8px; background:#ffffff; padding:6px 10px; font-size:14px; cursor:pointer; }
        .btn.active { background:#e0f2fe; border-color:#7dd3fc; }

        /* рендер мини-HTML по data-* атрибутам */
        .render-html p{ margin:0 0 8px 0; }
        .render-html img[data-lexical-image]{ display:block; width:100%; height:auto; border-radius:16px; overflow:hidden; border:1px solid #e5e7eb; margin:8px 0 12px; }
        .render-html [data-lexical-file]{ display:flex; align-items:center; gap:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:10px 12px; margin:8px 0; }
        .render-html [data-lexical-file]::before{ content:"📄"; font-size:18px; line-height:1; }
        .render-html [data-lexical-file] > a{ color:#111827; font-weight:600; text-decoration:none; word-break:break-all; }
        .render-html [data-lexical-file] > a:hover{ text-decoration:underline; }
      `}</style>
		</div>
	);
}
