"use client";

import * as React from "react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "@/lib/FormContext";
import styles from "@/styles/JsonEditor.module.css";
import "@/styles/globals.css";

export default function JsonEditorPage() {
	const { data, setMany } = useFormContext();
	const [raw, setRaw] = useState<string>("");
	const [error, setError] = useState<string>("");

	useEffect(() => {
		if (data.inputLexicalJSON) {
			try {
				const parsed = JSON.parse(data.inputLexicalJSON);
				setRaw(JSON.stringify(parsed, null, 2));
				setError("");
			} catch {
				setRaw(data.inputLexicalJSON);
				setError("⚠️ Некорректный JSON в хранилище");
			}
		} else {
			setRaw("");
			setError("");
		}
	}, [data.inputLexicalJSON]);

	const isValid = useMemo(() => {
		try {
			JSON.parse(raw);
			return true;
		} catch {
			return false;
		}
	}, [raw]);

	const onSave = () => {
		try {
			const parsed = JSON.parse(raw);
			const compact = JSON.stringify(parsed); // компактно храним
			setMany({ inputLexicalJSON: compact });
			setError("");
			console.log("Saved inputLexicalJSON:", compact);
		} catch (e: any) {
			setError(`Ошибка JSON: ${e?.message ?? "неизвестная ошибка"}`);
		}
	};


	return (
		<div className={styles.wrapper}>
			<h1 className={styles.h1}>Редактор JSON (Lexical EditorState)</h1>

			<div className={styles.card}>
				<h2 className={styles.h2}>Измените JSON и сохраните</h2>

				<textarea
					value={raw}
					onChange={(e) => setRaw(e.target.value)}
					placeholder='{"root":{"children":[...]}}'
					className={styles.textarea}
				/>

				<p
					className={styles.status}
					style={{ color: isValid ? "#10b981" : "#ef4444" }}
				>
					{isValid ? (error || "JSON валиден") : (error || "JSON невалиден")}
				</p>

				<div className={styles.actions}>
					<button
						onClick={onSave}
						disabled={!isValid}
						className={`${styles.button} ${styles.buttonPrimary}`}
					>
						Сохранить JSON
					</button>

					<Link href="/" className={`${styles.button} ${styles.buttonSecondary}`}>
						Назад на главную
					</Link>
				</div>
			</div>
		</div>
	);
}
