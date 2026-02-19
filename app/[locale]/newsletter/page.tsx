import { redirect } from "next/navigation";

export default function NewsletterPage({ params: { locale } }: { params: { locale: string } }) {
    redirect(`/${locale}/subscribe`);
}
