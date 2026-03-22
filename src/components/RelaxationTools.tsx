import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  Wind, Music, Leaf, Mountain, Waves, Play, Pause, SkipForward, 
  Volume2, VolumeX, Timer, Focus, Sparkles, Sun, Moon, Cloud
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";

interface RelaxationToolsProps {
  userSession: any;
}

interface Track {
  id: string;
  title: string;
  category: 'nature' | 'meditation' | 'ambient';
  duration: string;
  description: string;
  icon: string;
  color: string;
}

export function RelaxationTools({ userSession }: RelaxationToolsProps) {
  const [activeView, setActiveView] = useState<'menu' | 'breathing' | 'music' | 'grounding'>('menu');
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [breathingDuration, setBreathingDuration] = useState(5); // minutes
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [groundingStep, setGroundingStep] = useState(0);
  
  const breathingIntervalRef = useRef<NodeJS.Timeout>();
  const timerIntervalRef = useRef<NodeJS.Timeout>();

  const tracks: Track[] = [
    {
      id: "1",
      title: "Forest Rain",
      category: "nature",
      duration: "30:00",
      description: "Gentle rainfall in a peaceful forest",
      icon: "🌧️",
      color: "from-green-400 to-emerald-500"
    },
    {
      id: "2", 
      title: "Ocean Waves",
      category: "nature",
      duration: "45:00", 
      description: "Soothing ocean waves on a quiet beach",
      icon: "🌊",
      color: "from-blue-400 to-cyan-500"
    },
    {
      id: "3",
      title: "Mountain Breeze",
      category: "nature",
      duration: "25:00",
      description: "Wind through mountain trees",
      icon: "🏔️",
      color: "from-slate-400 to-blue-400"
    },
    {
      id: "4",
      title: "Tibetan Bowls",
      category: "meditation",
      duration: "20:00",
      description: "Deep meditation with singing bowls",
      icon: "🎵",
      color: "from-purple-400 to-indigo-500"
    },
    {
      id: "5",
      title: "Ambient Dreams",
      category: "ambient",
      duration: "60:00",
      description: "Ethereal soundscapes for deep relaxation",
      icon: "✨",
      color: "from-violet-400 to-purple-500"
    },
    {
      id: "6",
      title: "Dawn Chorus",
      category: "nature",
      duration: "35:00",
      description: "Birds singing at sunrise",
      icon: "🐦",
      color: "from-yellow-400 to-orange-400"
    }
  ];

  const groundingSteps = [
    {
      instruction: "Take a deep breath and look around you",
      prompt: "Name 5 things you can see around you right now",
      icon: "👀",
      color: "from-blue-500 to-blue-600"
    },
    {
      instruction: "Focus on your sense of touch",
      prompt: "Name 4 things you can touch or feel",
      icon: "✋",
      color: "from-green-500 to-green-600"
    },
    {
      instruction: "Listen carefully to your environment",
      prompt: "Name 3 things you can hear right now",
      icon: "👂",
      color: "from-purple-500 to-purple-600"
    },
    {
      instruction: "Focus on scents around you",
      prompt: "Name 2 things you can smell",
      icon: "👃",
      color: "from-pink-500 to-pink-600"
    },
    {
      instruction: "Notice any tastes",
      prompt: "Name 1 thing you can taste",
      icon: "👅",
      color: "from-orange-500 to-orange-600"
    },
    {
      instruction: "You're now grounded in the present moment",
      prompt: "Take a moment to appreciate how you feel",
      icon: "🌟",
      color: "from-violet-500 to-violet-600"
    }
  ];

  useEffect(() => {
    return () => {
      if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startBreathingExercise = () => {
    setIsBreathing(true);
    setBreathingTimer(0);
    setBreathingPhase('inhale');
    
    // Start timer
    timerIntervalRef.current = setInterval(() => {
      setBreathingTimer(prev => prev + 1);
    }, 1000);

    // Breathing cycle: 4s inhale, 4s hold, 6s exhale, 2s pause
    let phase = 0; // 0: inhale, 1: hold, 2: exhale, 3: pause
    const phaseDurations = [4, 4, 6, 2]; // seconds for each phase
    const phaseNames: ('inhale' | 'hold' | 'exhale' | 'pause')[] = ['inhale', 'hold', 'exhale', 'pause'];
    
    let phaseTimer = 0;
    
    breathingIntervalRef.current = setInterval(() => {
      phaseTimer++;
      
      if (phaseTimer >= phaseDurations[phase]) {
        phase = (phase + 1) % 4;
        phaseTimer = 0;
        setBreathingPhase(phaseNames[phase]);
      }
    }, 1000);
  };

  const stopBreathingExercise = () => {
    setIsBreathing(false);
    if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setBreathingTimer(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe in slowly...';
      case 'hold': return 'Hold your breath...';
      case 'exhale': return 'Exhale gently...';
      case 'pause': return 'Rest for a moment...';
    }
  };

  const getBreathingCircleScale = () => {
    switch (breathingPhase) {
      case 'inhale': return 1.3;
      case 'hold': return 1.3;
      case 'exhale': return 1.0;
      case 'pause': return 1.0;
    }
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  if (activeView === 'breathing') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-2xl mx-auto"
        >
          <Button
            onClick={() => setActiveView('menu')}
            variant="ghost"
            className="absolute top-6 left-6 text-muted-foreground"
          >
            ← Back
          </Button>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Breathing Exercise
            </h1>
            <p className="text-muted-foreground">Find your calm with guided breathing</p>
          </div>

          {/* Breathing Circle */}
          <motion.div
            animate={{
              scale: getBreathingCircleScale(),
              opacity: isBreathing ? [0.6, 1, 0.6] : 0.8
            }}
            transition={{
              duration: breathingPhase === 'inhale' ? 4 : 
                        breathingPhase === 'hold' ? 4 :
                        breathingPhase === 'exhale' ? 6 : 2,
              ease: "easeInOut",
              opacity: { duration: 2, repeat: isBreathing ? Infinity : 0 }
            }}
            className="w-80 h-80 mx-auto rounded-full bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur border border-white/10 flex items-center justify-center shadow-2xl"
          >
            <motion.div
              animate={{
                scale: isBreathing ? [0.8, 1.2, 0.8] : 1
              }}
              transition={{
                duration: 4,
                repeat: isBreathing ? Infinity : 0,
                ease: "easeInOut"
              }}
              className="w-40 h-40 rounded-full bg-gradient-to-r from-blue-800/50 to-purple-800/50 backdrop-blur flex items-center justify-center"
            >
              <Wind className="w-16 h-16 text-white" />
            </motion.div>
          </motion.div>

          {/* Instructions */}
          <div className="space-y-4">
            <motion.p
              key={breathingPhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-medium text-foreground"
            >
              {getBreathingInstruction()}
            </motion.p>
            
            {isBreathing && (
              <div className="text-muted-foreground">
                <p>Session: {formatTime(breathingTimer)} / {breathingDuration}:00</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            {!isBreathing ? (
              <Button
                onClick={startBreathingExercise}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-2xl"
              >
                <Wind className="w-5 h-5 mr-2" />
                Start Breathing
              </Button>
            ) : (
              <Button
                onClick={stopBreathingExercise}
                variant="outline"
                className="border-blue-700 text-blue-300 hover:bg-blue-900/50 px-8 py-3 rounded-2xl"
              >
                Stop Session
              </Button>
            )}
          </div>

          <Card className="bg-slate-800/50 backdrop-blur border-white/10">
            <CardContent className="p-6">
              <div className="space-y-3 text-left">
                <h3 className="font-semibold text-foreground">4-4-6-2 Breathing Pattern</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>• Inhale for 4 seconds</div>
                  <div>• Hold for 4 seconds</div>
                  <div>• Exhale for 6 seconds</div>
                  <div>• Pause for 2 seconds</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (activeView === 'music') {
    return (
      <div className="min-h-screen bg-background p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          <Button
            onClick={() => setActiveView('menu')}
            variant="ghost"
            className="text-muted-foreground"
          >
            ← Back
          </Button>

          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Calming Sounds
            </h1>
            <p className="text-muted-foreground">Immerse yourself in peaceful soundscapes</p>
          </div>

          {/* Current Player */}
          {currentTrack && (
            <Card className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur border-white/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${currentTrack.color} flex items-center justify-center text-3xl`}>
                    {currentTrack.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{currentTrack.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{currentTrack.description}</p>
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white rounded-xl"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                        <div className="w-24">
                          <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-2">
                      {currentTrack.duration}
                    </Badge>
                    <p className="text-sm text-muted-foreground">Now Playing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Track Categories */}
          <div className="space-y-6">
            {['nature', 'meditation', 'ambient'].map((category) => (
              <div key={category}>
                <h2 className="text-xl font-semibold text-foreground mb-4 capitalize flex items-center">
                  {category === 'nature' && <Leaf className="w-5 h-5 mr-2 text-green-400" />}
                  {category === 'meditation' && <Focus className="w-5 h-5 mr-2 text-purple-400" />}
                  {category === 'ambient' && <Sparkles className="w-5 h-5 mr-2 text-violet-400" />}
                  {category} Sounds
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tracks.filter(track => track.category === category).map((track) => (
                    <motion.div
                      key={track.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer h-full">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${track.color} flex items-center justify-center text-2xl`}>
                              {track.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">{track.title}</h3>
                              <p className="text-muted-foreground text-sm mb-3">{track.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  {track.duration}
                                </Badge>
                                <Button
                                  onClick={() => playTrack(track)}
                                  size="sm"
                                  className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white"
                                >
                                  <Play className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (activeView === 'grounding') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-2xl mx-auto"
        >
          <Button
            onClick={() => setActiveView('menu')}
            variant="ghost"
            className="absolute top-6 left-6 text-muted-foreground"
          >
            ← Back
          </Button>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              5-4-3-2-1 Grounding
            </h1>
            <p className="text-muted-foreground">Ground yourself in the present moment</p>
          </div>

          {groundingStep < groundingSteps.length - 1 && (
            <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
              <motion.div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((groundingStep + 1) / groundingSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}

          <motion.div
            key={groundingStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <Card className={`bg-gradient-to-r ${groundingSteps[groundingStep].color} text-white border-0 shadow-2xl`}>
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">{groundingSteps[groundingStep].icon}</div>
                <h2 className="text-2xl font-semibold mb-3">{groundingSteps[groundingStep].instruction}</h2>
                <p className="text-lg opacity-90">{groundingSteps[groundingStep].prompt}</p>
              </CardContent>
            </Card>

            {groundingStep < groundingSteps.length - 1 ? (
              <Button
                onClick={() => setGroundingStep(prev => prev + 1)}
                className="bg-white text-emerald-600 hover:bg-gray-200 px-8 py-3 rounded-2xl shadow-lg"
              >
                Next Step →
              </Button>
            ) : (
              <div className="space-y-4">
                <Button
                  onClick={() => setGroundingStep(0)}
                  className="bg-white text-emerald-600 hover:bg-gray-200 px-8 py-3 rounded-2xl shadow-lg mr-4"
                >
                  Start Over
                </Button>
                <Button
                  onClick={() => setActiveView('menu')}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-2xl"
                >
                  Back to Tools
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center"
          >
            <Leaf className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            Relaxation Tools
          </h1>
          <p className="text-muted-foreground">Find your calm with guided exercises and soothing sounds</p>
        </div>

        {/* Tool Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView('breathing')}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-blue-700 shadow-lg hover:shadow-xl transition-all h-full">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Wind className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Breathing Exercise</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Guided 4-4-6-2 breathing pattern to calm your mind and body
                </p>
                <Badge variant="outline" className="text-blue-300 border-blue-700">5-15 min</Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView('music')}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-violet-900/50 to-purple-900/50 border-violet-700 shadow-lg hover:shadow-xl transition-all h-full">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Calming Sounds</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Nature sounds, meditation music, and ambient tracks
                </p>
                <Badge variant="outline" className="text-violet-300 border-violet-700">10-60 min</Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView('grounding')}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border-emerald-700 shadow-lg hover:shadow-xl transition-all h-full">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Focus className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Grounding Exercise</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  5-4-3-2-1 technique to ground yourself in the present
                </p>
                <Badge variant="outline" className="text-emerald-300 border-emerald-700">3-5 min</Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Access */}
        <Card className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Timer className="w-5 h-5 text-violet-400" />
              <span>Quick Calm</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                variant="outline"
                className="border-blue-700 text-blue-300 hover:bg-blue-900/50 p-4 h-auto flex-col space-y-2"
                onClick={() => setActiveView('breathing')}
              >
                <Wind className="w-6 h-6" />
                <span>2 Min Breathing</span>
              </Button>
              <Button 
                variant="outline"
                className="border-emerald-700 text-emerald-300 hover:bg-emerald-900/50 p-4 h-auto flex-col space-y-2"
                onClick={() => setActiveView('grounding')}
              >
                <Focus className="w-6 h-6" />
                <span>Quick Grounding</span>
              </Button>
              <Button 
                variant="outline"
                className="border-violet-700 text-violet-300 hover:bg-violet-900/50 p-4 h-auto flex-col space-y-2"
                onClick={() => setActiveView('music')}
              >
                <Waves className="w-6 h-6" />
                <span>Ocean Sounds</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
