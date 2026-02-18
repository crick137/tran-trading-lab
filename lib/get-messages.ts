import en from "@/messages/en.json";
import ko from "@/messages/ko.json";

const messages = { en, ko } as const;
type Messages = typeof en;

export function getMessages(locale: string): Messages {
    return messages[locale as keyof typeof messages] ?? messages.en;
}
