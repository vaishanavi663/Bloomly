'use client';
import { SleepCompanion } from "@/components/SleepCompanion";
import { useAuthModal } from "@/app/context/app-context";

export default function SleepPage() {
    const { userSession } = useAuthModal();
    return <SleepCompanion userSession={userSession} />;
}
