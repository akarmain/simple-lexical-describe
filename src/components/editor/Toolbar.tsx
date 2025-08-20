"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	$getSelection,
	$isRangeSelection,
	$createParagraphNode,
	FORMAT_TEXT_COMMAND,
	SELECTION_CHANGE_COMMAND,
	COMMAND_PRIORITY_LOW,
} from "lexical";
import {
	INSERT_ORDERED_LIST_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND,
	$isListNode,
} from "@lexical/list";
import { TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link";
import { mergeRegister } from "@lexical/utils";

import { toolbarStyles } from "../../styles/ui";
import { sanitizeUrl } from "../../utils/sanitizeUrl";
import { $createImageNode } from "../../nodes/ImageNode";
import { $createFileCardNode } from "../../nodes/FileCardNode";

export default function Toolbar() {
	const [editor] = useLexicalComposerContext();

	// Активные состояния
	const [isBold, setBold] = useState(false);
	const [isItalic, setItalic] = useState(false);
	const [isLink, setLink] = useState(false);
	const [isOL, setOL] = useState(false);
	const [isUL, setUL] = useState(false);

	const updateToolbar = useCallback(() => {
		const selection = $getSelection();
		if ($isRangeSelection(selection)) {
			setBold(selection.hasFormat("bold"));
			setItalic(selection.hasFormat("italic"));

			const anchor = selection.anchor.getNode();
			const parent = anchor.getParent();
			setLink($isLinkNode(anchor) || (!!parent && $isLinkNode(parent)));

			const top = anchor.getTopLevelElementOrThrow();
			if ($isListNode(top)) {
				const t = (top as any).getListType?.();
				setOL(t === "number");
				setUL(t !== "number");
			} else {
				setOL(false);
				setUL(false);
			}
		}
	}, []);

	useEffect(() => {
		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(updateToolbar);
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					updateToolbar();
					return false;
				},
				COMMAND_PRIORITY_LOW
			)
		);
	}, [editor, updateToolbar]);

	// Actions
	const onBold = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
	}, [editor]);

	const onItalic = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
	}, [editor]);

	const onLink = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		if (isLink) {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		} else {
			const url = window.prompt("URL ссылки:", "https://");
			if (url === null) return;
			const safe = url.trim() ? sanitizeUrl(url) : "";
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, safe || null);
		}
	}, [editor, isLink]);

	const onOL = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
	}, [editor]);

	const onUL = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
	}, [editor]);

	const insertImage = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		const raw = window.prompt("URL изображения:", "https://");
		if (!raw) return;
		const src = sanitizeUrl(raw);
		if (src === "about:blank") return;
		editor.update(() => {
			const node = $createImageNode({ src });
			const sel = $getSelection();
			if ($isRangeSelection(sel)) {
				sel.insertNodes([node]);
				const p = $createParagraphNode();
				node.insertAfter(p);
				p.select();
			}
		});
	}, [editor]);

	const insertFile = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		const raw = window.prompt("URL файла:", "https://");
		if (!raw) return;
		const url = sanitizeUrl(raw);
		if (url === "about:blank") return;
		editor.update(() => {
			const node = $createFileCardNode({ url }); // имя возьмётся из конца пути
			const sel = $getSelection();
			if ($isRangeSelection(sel)) {
				sel.insertNodes([node]);
				const p = $createParagraphNode();
				node.insertAfter(p);
				p.select();
			}
		});
	}, [editor]);

	const btnCls = (active: boolean) => `btn${active ? " active" : ""}`;

	return (
		<div style={toolbarStyles.wrapper}>
			<button className={btnCls(isBold)} onMouseDown={onBold}><b>B</b></button>
			<button className={btnCls(isItalic)} onMouseDown={onItalic}><i>I</i></button>
			<button className={btnCls(isLink)} onMouseDown={onLink}>Link</button>
			<button className={btnCls(isOL)} onMouseDown={onOL}>1.</button>
			<button className={btnCls(isUL)} onMouseDown={onUL}>•</button>
			<button className="btn" onMouseDown={insertImage}>Image</button>
			<button className="btn" onMouseDown={insertFile}>File</button>
		</div>
	);
}
