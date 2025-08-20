"use client";

import {
	DecoratorNode,
	LexicalEditor,
	NodeKey,
	SerializedDecoratorNode,
	Spread,
	$getNodeByKey,
} from "lexical";
import * as React from "react";

type FilePayload = { url: string; name?: string; sizeText?: string };

type SerializedFileCardNode = Spread<
	{ url: string; name?: string; sizeText?: string },
	SerializedDecoratorNode
>;

export class FileCardNode extends DecoratorNode<JSX.Element> {
	__url: string;
	__name: string;
	__sizeText: string;

	static getType(): string {
		return "file-card";
	}

	static clone(node: FileCardNode): FileCardNode {
		return new FileCardNode(
			node.__url,
			node.__name,
			node.__sizeText,
			node.__key
		);
	}

	constructor(
		url: string = "",
		name: string = "",
		sizeText: string = "",
		key?: NodeKey
	) {
		super(key);
		this.__url = url;
		this.__name = name;
		this.__sizeText = sizeText;
	}

	static importJSON(json: SerializedFileCardNode): FileCardNode {
		return new FileCardNode(
			json.url ?? "",
			json.name ?? "",
			json.sizeText ?? ""
		);
	}

	exportJSON(): SerializedFileCardNode {
		return {
			type: "file-card",
			version: 1,
			url: this.__url,
			name: this.__name,
			sizeText: this.__sizeText,
		};
	}

	decorate(editor: LexicalEditor): JSX.Element {
		const nodeKey = this.getKey();
		const remove = () => {
			editor.update(() => {
				const n = $getNodeByKey(nodeKey);
				if (n) n.remove();
			});
		};

		const displayName =
			this.__name || this.__url.split("/").pop() || "file";

		return (
			<div className="file-card">
				<div className="file-card__icon" aria-hidden>
					📄
				</div>
				<div className="file-card__body">
					<a
						className="file-card__name"
						href={this.__url}
						target="_blank"
						rel="noreferrer noopener"
						download
					>
						{displayName}
					</a>
					{this.__sizeText ? (
						<div className="file-card__meta">{this.__sizeText}</div>
					) : null}
				</div>
				<button
					type="button"
					className="file-card__x"
					onClick={remove}
					aria-label="Удалить файл"
				>
					×
				</button>
			</div>
		);
	}

	createDOM(): HTMLElement {
		return document.createElement("span");
	}
	updateDOM(): boolean {
		return false;
	}
	isInline(): boolean {
		return false;
	}

	exportDOM(): { element: HTMLElement } {
		const wrap = document.createElement("div");
		wrap.setAttribute("data-lexical-file", "1");
		wrap.setAttribute("data-url", this.__url);
		if (this.__name) wrap.setAttribute("data-name", this.__name);
		if (this.__sizeText) wrap.setAttribute("data-size", this.__sizeText);

		const a = document.createElement("a");
		a.href = this.__url;
		a.setAttribute("download", "");
		a.textContent = this.__name || this.__url.split("/").pop() || "file";
		wrap.appendChild(a);

		return { element: wrap };
	}

	static importDOM() {
		return {
			div: (domNode: HTMLElement) => {
				if (
					domNode instanceof HTMLDivElement &&
					domNode.hasAttribute("data-lexical-file")
				) {
					return {
						conversion: () => {
							const url = domNode.getAttribute("data-url") || "";
							const name = domNode.getAttribute("data-name") || "";
							const size = domNode.getAttribute("data-size") || "";
							return { node: new FileCardNode(url, name, size) };
						},
						priority: 3,
					};
				}
				return null;
			},
		};
	}
}

export function $createFileCardNode(payload: FilePayload): FileCardNode {
	return new FileCardNode(payload.url, payload.name ?? "", payload.sizeText ?? "");
}
