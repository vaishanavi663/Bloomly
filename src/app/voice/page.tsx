'use client';
import { VoiceJournal } from "@/components/VoiceJournal";
import { useAuthModal } from "@/app/context/app-context";

export default function VoicePage() {
    const { userSession } = useAuthModal();
    return <VoiceJournal userSession={userSession} />;
}
