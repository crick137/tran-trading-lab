import { redirect } from "next/navigation";

export default function LearnPage({
    params: { locale },
}: {
    params: { locale: string };
}) {
    redirect(`/${locale}/academy`);
}
