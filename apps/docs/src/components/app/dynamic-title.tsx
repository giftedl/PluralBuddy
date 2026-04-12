import { useEffect } from "react";
import { useLocation } from "react-router";

export const DynamicPageTitle = ({ title }: { title: string }) => {
	const location = useLocation();

	useEffect(() => {
		document.title = title;
	}, [location, title]);

	return null;
};
