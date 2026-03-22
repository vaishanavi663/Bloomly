'use client';
import { GratitudeWall } from "@/components/GratitudeWall";
import { useAuthModal } from "@/app/context/app-context";

export default function GratitudePage() {
    const { userSession } = useAuthModal();
    return <GratitudeWall userSession={userSession} />;
}
