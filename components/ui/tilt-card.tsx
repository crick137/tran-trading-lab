import { ReactNode } from "react";

interface TiltCardProps {
    children: ReactNode;
    className?: string;
    maxTilt?: number;
}

export function TiltCard({ children }: TiltCardProps) {
    return <>{children}</>;
}
