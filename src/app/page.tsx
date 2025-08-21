"use client";

import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";

import { useFormContext } from "@/lib/FormContext";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";

import type { LexicalEditor } from "lexical";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";

import Toolbar from "../components/editor/Toolbar";
import { pageStyles, editorStyles, renderStyles } from "../styles/ui";
import { ImageNode } from "../nodes/ImageNode";
import { FileCardNode } from "../nodes/FileCardNode";

import "@/styles/globals.css";

export default function Page() {
	const { data, setMany } = useFormContext();
	const [previewHtml, setPreviewHtml] = useState<string>("");

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
				// eslint-disable-next-line no-console
				console.error(error);
			},
			nodes: [ListNode, ListItemNode, LinkNode, ImageNode, FileCardNode],

			// ВАЖНО: один сценарий инициализации
			editorState: (editor: LexicalEditor) => {
				if (data.inputLexicalJSON) {
					try {
						const state = editor.parseEditorState(data.inputLexicalJSON);
						editor.setEditorState(state);
						return;
					} catch (e) {
						console.warn("Bad inputLexicalJSON; fallback to empty paragraph:", e);
					}
				}
				// Фолбэк — пустой валидный корень
				editor.update(() => {
					const root = $getRoot();
					if (root.getChildrenSize() === 0) {
						const p = $createParagraphNode();
						p.append($createTextNode(""));
						root.append(p);
					}
				});
			},
		}),
		[data.inputLexicalJSON]
	);

	const handleChange = useCallback(
		(editorState: any, editor: LexicalEditor) => {
			// 1) Сохраняем JSON в глобальный контекст
			const json = JSON.stringify(editorState.toJSON());
			setMany({ inputLexicalJSON: json });

			// 2) Обновляем предпросмотр (HTML) — не влияет на состояние редактора
			editorState.read(() => {
				const html = $generateHtmlFromNodes(editor, null);
				setPreviewHtml(html);
			});
		},
		[setMany]
	);

	return (
		<div style={pageStyles.wrapper}>
			<h1 style={pageStyles.h1}>Lexical: форматирование + изображения/файлы + активные кнопки</h1>

			<div style={pageStyles.columns}>
				{/* Редактор */}
				<div style={pageStyles.card}>
					<h2 style={pageStyles.h2}>Редактор</h2>
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

				{/* Предпросмотр (HTML) */}
				<div style={pageStyles.card}>
					<h2 style={pageStyles.h2}>Предпросмотр (HTML)</h2>
					<div
						className="render-html"
						style={renderStyles.htmlBox}
						dangerouslySetInnerHTML={{ __html: previewHtml }}
					/>
				</div>

				{/* Переход к JSON-редактору */}
				<Link href="/html" className="alink-input">
					<span style={editorStyles.linkWrapper}>Смотреть JSON</span>
				</Link>
			</div>
		</div>
	);
}
