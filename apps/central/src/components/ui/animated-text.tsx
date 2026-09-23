"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "cn";

interface AnimatedTextProps {
	text: string;
	className?: string;
	glimmer?: boolean;
}

export function AnimatedText({ text, className, glimmer }: AnimatedTextProps) {
	const [currentText, setCurrentText] = useState(text);

	useEffect(() => {
		setCurrentText(text);
	}, [text]);

	return (
		<div className="relative h-6 min-w-[200px] text-sm">
			<AnimatePresence mode="wait">
				<motion.span
					key={currentText}
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -20, opacity: 0 }}
					transition={{ duration: 0.3 }}
					className={cn("absolute left-0", className, {
						"loading-shimmer": glimmer,
					})}
				>
					{currentText}
				</motion.span>
			</AnimatePresence>
		</div>
	);
}
