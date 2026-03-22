'use client';
import { RelaxationTools } from "@/components/RelaxationTools";
import { useAuthModal } from "@/app/context/app-context";

export default function RelaxPage() {
    const { userSession } = useAuthModal();
    return <RelaxationTools userSession={userSession} />;
}
