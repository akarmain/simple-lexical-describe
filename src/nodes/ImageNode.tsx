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

type ImagePayload = { src: string; alt?: string };

type SerializedImageNode = Spread<
	{ src: string; alt?: string },
	SerializedDecoratorNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
	__src: string;
	__alt: string;

	static getType(): string {
		return "image";
	}

	static clone(node: ImageNode): ImageNode {
		return new ImageNode(node.__src, node.__alt, node.__key);
	}

	constructor(src: string = "", alt: string = "", key?: NodeKey) {
		super(key);
		this.__src = src;
		this.__alt = alt;
	}

	static importJSON(json: SerializedImageNode): ImageNode {
		return new ImageNode(json.src ?? "", json.alt ?? "");
	}

	exportJSON(): SerializedImageNode {
		return { type: "image", version: 1, src: this.__src, alt: this.__alt };
	}

	decorate(editor: LexicalEditor): JSX.Element {
		const nodeKey = this.getKey();
		const remove = () => {
			editor.update(() => {
				const n = $getNodeByKey(nodeKey);
				if (n) n.remove();
			});
		};

		return (
			<div className="lex-image-wrap">
				<img src={this.__src} alt={this.__alt} className="lex-image" />
				<button
					type="button"
					className="lex-x"
					onClick={remove}
					aria-label="Удалить изображение"
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
		const img = document.createElement("img");
		img.setAttribute("src", this.__src);
		if (this.__alt) img.setAttribute("alt", this.__alt);
		img.setAttribute("data-lexical-image", "1");
		return { element: img };
	}

	static importDOM() {
		return {
			img: (domNode: HTMLElement) => {
				if (
					domNode instanceof HTMLImageElement &&
					domNode.hasAttribute("data-lexical-image")
				) {
					return {
						conversion: () => ({
							node: new ImageNode(
								domNode.getAttribute("src") || "",
								domNode.getAttribute("alt") || ""
							),
						}),
						priority: 3,
					};
				}
				return null;
			},
		};
	}
}

export function $createImageNode(payload: ImagePayload): ImageNode {
	return new ImageNode(payload.src, payload.alt ?? "");
}
