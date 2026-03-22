'use client';
import { PeerCircles } from "@/components/PeerCircles";
import { useAuthModal } from "@/app/context/app-context";

export default function CirclesPage() {
    const { userSession } = useAuthModal();
    return <PeerCircles userSession={userSession} />;
}
