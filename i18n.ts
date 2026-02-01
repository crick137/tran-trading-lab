import { getRequestConfig } from "next-intl/server";
import { routing, locales, type Locale } from "./i18n/routing";

export { locales, defaultLocale, type Locale } from "./i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Validate that the incoming `locale` parameter is valid
    if (!locale || !locales.includes(locale as Locale)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
    };
});
