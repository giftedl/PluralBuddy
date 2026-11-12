import { useEffect } from "react";
import { useLocation } from "react-router";

export const DynamicPageTitle = ({ title }: { title: string }) => {
  const location = useLocation();

  useEffect(() => {
    document.title = title;
  }, [location, title]);

  return null;
};

export const DynamicPageTitleRouterLess = ({ title }: { title: string }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
};
