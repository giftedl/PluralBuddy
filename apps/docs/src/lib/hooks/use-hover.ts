import React, { useEffect } from "react";

export function useHover(previousNode: React.RefObject<HTMLElement | null>) {
	const [hovering, setHovering] = React.useState(false);

	const handleMouseEnter = React.useCallback(() => {
		setHovering(true);
	}, []);

	const handleMouseLeave = React.useCallback(() => {
		setHovering(false);
	}, []);

	useEffect(
		() => {
			if (previousNode.current?.nodeType === Node.ELEMENT_NODE) {
				previousNode.current.removeEventListener(
					"mouseenter",
					handleMouseEnter,
				);
				previousNode.current.removeEventListener(
					"mouseleave",
					handleMouseLeave,
				);
			}

			if (previousNode.current?.nodeType === Node.ELEMENT_NODE) {
				previousNode.current?.addEventListener("mouseenter", handleMouseEnter);
				previousNode.current?.addEventListener("mouseleave", handleMouseLeave);
			}
		},
		[handleMouseEnter, handleMouseLeave],
	);

	return hovering;
}

