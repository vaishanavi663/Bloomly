'use client';
import { MoodDashboard } from "@/components/MoodDashboard";
import { useAuthModal } from "@/app/context/app-context";

export default function MoodPage() {
    const { userSession, setCurrentMood } = useAuthModal();
    return <MoodDashboard userSession={userSession} onMoodChange={setCurrentMood} />;
}
