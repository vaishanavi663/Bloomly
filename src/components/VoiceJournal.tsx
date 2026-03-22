
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Play, Pause, Trash2, Calendar, Heart, Brain, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import initialEntries from "@/app/lib/journal-entries.json";
import { useToast } from "./ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";


interface VoiceJournalProps {
  userSession: any;
}

interface JournalAnalysis {
  transcript: string;
  emotions: {
    primary: string;
    secondary?: string;
    confidence: number;
  };
  moodScore: number;
  aiInsights: string[];
}

interface JournalEntry extends JournalAnalysis {
  id: string;
  date: string;
  duration: number;
  audioUrl?: string; 
}

export function VoiceJournal({ userSession }: VoiceJournalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // For demo, we manage state locally.
    const savedEntries = localStorage.getItem(`voice_journal_${userSession?.id}`);
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    } else {
      setEntries(initialEntries);
    }
  }, [userSession]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        navigator.permissions.query({ name: 'microphone' as PermissionName }).then((permissionStatus) => {
            setHasPermission(permissionStatus.state === 'granted');
            permissionStatus.onchange = () => {
                setHasPermission(permissionStatus.state === 'granted');
            };
        });
    }
  }, []);

  const saveEntries = (newEntries: JournalEntry[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(`voice_journal_${userSession?.id}`, JSON.stringify(newEntries));
    }
  };
  
  const getMicrophonePermission = async () => {
    if (typeof window === 'undefined') return null;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      return stream;
    } catch (err) {
      console.error("Microphone access denied:", err);
      toast("Microphone Access Denied: Please enable microphone permissions in your browser settings to use this feature.");
      setHasPermission(false);
      return null;
    }
  };
  
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else {
      if(timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
        if(timerRef.current) clearInterval(timerRef.current)
    };
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    const stream = await getMicrophonePermission();
    if (!stream) return;

    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = event => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      processVoiceEntry(audioBlob);
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setIsPaused(false);
  };

  const pauseRecording = () => {
    if (isPaused) mediaRecorderRef.current?.resume();
    else mediaRecorderRef.current?.pause();
    setIsPaused(!isPaused);
  };

  const processVoiceEntry = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    // Simulate API call and response
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const mockAnalysis: JournalAnalysis = {
        transcript: "This is a simulated transcript. It sounds like you had a thoughtful day exploring new ideas!",
        emotions: { primary: 'thoughtful', secondary: 'curiosity', confidence: 0.88 },
        moodScore: 7,
        aiInsights: ["Exploring new ideas is a wonderful way to grow. What was the most interesting thought you had today?"]
      };

      const audioUrl = URL.createObjectURL(audioBlob);

      const newEntry: JournalEntry = {
        ...mockAnalysis,
        id: Date.now().toString(),
        date: new Date().toISOString(),
        duration: recordingTime,
        audioUrl,
      };

      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      setCurrentEntry(newEntry);
      saveEntries(updatedEntries);
       toast("Entry Analyzed! Your new voice journal entry has been saved.");

    } catch (error) {
      console.error("AI processing error:", error);
      toast("Analysis Failed: Could not analyze the journal entry. Please try again.");
    } finally {
      setIsProcessing(false);
      setRecordingTime(0);
    }
  };

  const deleteEntry = (entryId: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId);
    setEntries(updatedEntries);
    saveEntries(updatedEntries);
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      joy: "bg-yellow-900/50 text-yellow-300",
      tired: "bg-gray-700/50 text-gray-300",
      hope: "bg-teal-900/50 text-teal-300",
      excitement: "bg-orange-900/50 text-orange-300",
      thoughtful: "bg-blue-900/50 text-blue-300",
      curiosity: "bg-indigo-900/50 text-indigo-300"
    };
    return colors[emotion] || "bg-slate-700/50 text-slate-300";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
            <Mic className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Voice Journal</h1>
          <p className="text-muted-foreground">Express your thoughts, track your emotions</p>
        </div>

        <Card className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-sm shadow-xl">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              
              {!hasPermission && (
                <Alert variant="destructive">
                  <MicOff className="h-4 w-4" />
                  <AlertTitle>Microphone Access Required</AlertTitle>
                  <AlertDescription>
                    This feature needs microphone access. Click the "Start Recording" button to grant permission.
                  </AlertDescription>
                </Alert>
              )}

              <motion.div animate={isRecording && !isPaused ? { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] } : {}} transition={{ duration: 1, repeat: isRecording && !isPaused ? Infinity : 0, ease: "easeInOut" }} className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${ isRecording ? isPaused ? 'bg-yellow-500/20 border-4 border-yellow-500' : 'bg-red-500/20 border-4 border-red-500' : 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-4 border-violet-400' }`}>
                {isRecording ? (isPaused ? <Pause className="w-12 h-12 text-yellow-400" /> : <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.5, repeat: Infinity }}><MicOff className="w-12 h-12 text-red-400" /></motion.div>) : <Mic className="w-12 h-12 text-violet-300" />}
              </motion.div>

              {(isRecording || recordingTime > 0) && <div className="text-2xl font-mono font-bold text-foreground">{formatTime(recordingTime)}</div>}

              <div className="flex justify-center space-x-4">
                {!isRecording ? (
                  <Button onClick={startRecording} disabled={isProcessing} className="px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white disabled:bg-gray-500">
                    {isProcessing ? <><Sparkles className="w-5 h-5 mr-2 animate-spin" />Processing...</> : <><Mic className="w-5 h-5 mr-2" />Start Recording</>}
                  </Button>
                ) : (
                  <div className="flex space-x-3">
                    <Button onClick={pauseRecording} variant="outline" className="px-6 py-3 rounded-2xl">{isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}</Button>
                    <Button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl"><MicOff className="w-5 h-5 mr-2" />Stop</Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence>
          {currentEntry && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 border-violet-700">
                <CardHeader><CardTitle className="flex items-center space-x-2"><Brain className="w-5 h-5 text-violet-400" /><span>Latest Entry Insights</span></CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getEmotionColor(currentEntry.emotions.primary)}>{currentEntry.emotions.primary} ({Math.round(currentEntry.emotions.confidence * 100)}%)</Badge>
                    {currentEntry.emotions.secondary && <Badge variant="outline">{currentEntry.emotions.secondary}</Badge>}
                    <Badge variant="outline"><Heart className="w-3 h-3 mr-1" />Mood: {currentEntry.moodScore}/10</Badge>
                  </div>
                  <p className="text-muted-foreground italic">"{currentEntry.transcript}"</p>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    {currentEntry.aiInsights.map((insight, index) => <p key={index} className="text-violet-300">{insight}</p>)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {entries.length > 0 && (
          <Card className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50">
            <CardHeader><CardTitle className="flex items-center space-x-2"><Calendar className="w-5 h-5 text-violet-400" /><span>Your Journey ({entries.length} entries)</span></CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {entries.map((entry) => (
                  <motion.div key={entry.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-violet-700 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString()} • {formatTime(entry.duration)}</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge size="sm" className={getEmotionColor(entry.emotions.primary)}>{entry.emotions.primary}</Badge>
                          <Badge size="sm" variant="outline">{entry.moodScore}/10</Badge>
                        </div>
                      </div>
                      <Button onClick={() => deleteEntry(entry.id)} variant="ghost" size="sm" className="text-muted-foreground hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                    <p className="text-foreground text-sm italic mb-2">"{entry.transcript}"</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
