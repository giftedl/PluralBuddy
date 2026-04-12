import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
 
export default getRequestConfig(async ({ requestLocale }) => {
  // Static for now, we'll change this later
  const requested = (await requestLocale) ?? "en";
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
 
  return {
    locale: "en",
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});