'use client';
import { SelfCareChallenges } from "@/components/SelfCareChallenges";
import { useAuthModal } from "@/app/context/app-context";

export default function ChallengesPage() {
    const { userSession } = useAuthModal();
    return <SelfCareChallenges userSession={userSession} />;
}
