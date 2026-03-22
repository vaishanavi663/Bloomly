'use client';
import { AIRecommendations } from "@/components/AIRecommendations";
import { useAuthModal } from "@/app/context/app-context";


export default function RecommendationsPage() {
    const { userSession, currentMood } = useAuthModal();
    return <AIRecommendations userSession={userSession} currentMood={currentMood} />;
}
