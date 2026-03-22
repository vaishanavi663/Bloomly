import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Moon, Play, Pause, Volume2, VolumeX, Clock, Star, Sparkles, BookOpen, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";

interface SleepCompanionProps {
  userSession: any;
}

interface SoundTrack {
  id: string;
  name: string;
  emoji: string;
  description: string;
  duration: number;
  category: 'nature' | 'ambient' | 'binaural' | 'meditation';
  color: string;
}

interface BedtimeStory {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: 'adventure' | 'peaceful' | 'fantasy' | 'mindfulness';
  emoji: string;
  content: string[];
}

const soundTracks: SoundTrack[] = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    emoji: '🌧️',
    description: 'Soft raindrops for deep relaxation',
    duration: 3600,
    category: 'nature',
    color: 'from-blue-400 to-teal-400'
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    emoji: '🌊',
    description: 'Rhythmic waves on a peaceful shore',
    duration: 3600,
    category: 'nature',
    color: 'from-cyan-400 to-blue-400'
  },
  {
    id: 'forest',
    name: 'Forest Night',
    emoji: '🌲',
    description: 'Gentle forest sounds and crickets',
    duration: 3600,
    category: 'nature',
    color: 'from-green-400 to-emerald-400'
  },
  {
    id: 'fireplace',
    name: 'Cozy Fireplace',
    emoji: '🔥',
    description: 'Warm crackling fire sounds',
    duration: 3600,
    category: 'ambient',
    color: 'from-orange-400 to-red-400'
  },
  {
    id: 'binaural',
    name: 'Deep Sleep Theta',
    emoji: '🧠',
    description: 'Theta waves for deep sleep',
    duration: 2700,
    category: 'binaural',
    color: 'from-purple-400 to-indigo-400'
  },
  {
    id: 'meditation',
    name: 'Tibetan Bowls',
    emoji: '🎵',
    description: 'Calming singing bowl meditation',
    duration: 1800,
    category: 'meditation',
    color: 'from-amber-400 to-orange-400'
  }
];

const bedtimeStories: BedtimeStory[] = [
  {
    id: 'starlight',
    title: 'The Starlight Garden',
    description: 'A magical journey through a garden of glowing stars',
    duration: 900,
    category: 'fantasy',
    emoji: '⭐',
    content: [
      "Close your eyes and imagine walking through a garden where each flower glows like a gentle star...",
      "The path beneath your feet sparkles with stardust, leading you deeper into this magical place...",
      "As you walk, you notice the flowers humming a soft, peaceful melody that makes you feel completely safe and calm...",
      "You find a comfortable spot among the glowing flowers and lie down, feeling the warm, gentle light surrounding you...",
      "The starlight flowers begin to dim slowly, like a natural nightlight, helping you drift into the most peaceful sleep..."
    ]
  },
  {
    id: 'cloudship',
    title: 'The Cloud Ship Adventure',
    description: 'Sail through peaceful skies on a magical cloud ship',
    duration: 1200,
    category: 'adventure',
    emoji: '☁️',
    content: [
      "You find yourself aboard a magnificent ship made entirely of soft, fluffy clouds...",
      "The cloud ship gently floats through the evening sky, carrying you on a peaceful journey...",
      "Below you, the world looks small and quiet, all the day's worries left far behind...",
      "The ship's cloud sails catch the gentle night breeze, rocking you softly as you travel through the stars...",
      "As the journey continues, you feel yourself becoming lighter and more relaxed, ready for restful dreams..."
    ]
  },
  {
    id: 'breathinghill',
    title: 'The Breathing Hill',
    description: 'A mindful story about a magical hill that breathes with you',
    duration: 600,
    category: 'mindfulness',
    emoji: '🌄',
    content: [
      "There's a special hill that breathes slowly and peacefully, just like you...",
      "As you lie on this gentle hill, you can feel it rise and fall with each breath...",
      "Breathe in slowly as the hill rises beneath you... breathe out as it gently falls...",
      "With each breath, you feel more relaxed, more peaceful, more ready for sleep...",
      "The hill continues its gentle breathing, carrying you safely into dreams..."
    ]
  }
];

export function SleepCompanion({ userSession }: SleepCompanionProps) {
  const [currentTrack, setCurrentTrack] = useState<SoundTrack | null>(null);
  const [currentStory, setCurrentStory] = useState<BedtimeStory | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [currentTime, setCurrentTime] = useState(0);
  const [sleepTimer, setSleepTimer] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('sounds');

  const timerRef = useRef<NodeJS.Timeout>();
  const sleepTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Load settings
    const savedSettings = localStorage.getItem(`sleep_companion_${userSession?.id}`);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setVolume([settings.volume || 70]);
      setSleepTimer(settings.sleepTimer || 0);
    }
  }, [userSession]);

  useEffect(() => {
    if (isPlaying && (currentTrack || currentStory)) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1);
        if (currentStory) {
          setStoryProgress(prev => {
            const newProgress = prev + 1;
            const totalDuration = currentStory.duration;
            return newProgress >= totalDuration ? totalDuration : newProgress;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentTrack, currentStory]);

  useEffect(() => {
    if (sleepTimer > 0 && isPlaying) {
      sleepTimerRef.current = setTimeout(() => {
        setIsPlaying(false);
        setCurrentTrack(null);
        setCurrentStory(null);
        setCurrentTime(0);
        setStoryProgress(0);
      }, sleepTimer * 60 * 1000);
    }

    return () => {
      if (sleepTimerRef.current) {
        clearTimeout(sleepTimerRef.current);
      }
    };
  }, [sleepTimer, isPlaying]);

  const playSound = (track: SoundTrack) => {
    if (currentTrack?.id === track.id && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentTrack(track);
      setCurrentStory(null);
      setIsPlaying(true);
      setCurrentTime(0);
      setStoryProgress(0);
    }
  };

  const playStory = (story: BedtimeStory) => {
    if (currentStory?.id === story.id && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentStory(story);
      setCurrentTrack(null);
      setIsPlaying(true);
      setCurrentTime(0);
      setStoryProgress(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const saveSettings = () => {
    const settings = {
      volume: volume[0],
      sleepTimer
    };
    localStorage.setItem(`sleep_companion_${userSession?.id}`, JSON.stringify(settings));
  };

  useEffect(() => {
    saveSettings();
  }, [volume, sleepTimer, userSession]);

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
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center"
          >
            <Moon className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Sleep Companion
          </h1>
          <p className="text-muted-foreground">Peaceful sounds and stories for restful sleep 🌙</p>
        </div>

        {/* Current Playing */}
        {(currentTrack || currentStory) && (
          <Card className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={isPlaying ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${
                    currentTrack ? currentTrack.color : 'from-purple-400 to-pink-400'
                  } flex items-center justify-center text-2xl`}
                >
                  {currentTrack ? currentTrack.emoji : currentStory?.emoji}
                </motion.div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground">
                    {currentTrack ? currentTrack.name : currentStory?.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {currentTrack ? currentTrack.description : currentStory?.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full w-12 h-12"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime((currentTrack?.duration || currentStory?.duration || 0))}</span>
                </div>
                <Progress 
                  value={(currentTime / (currentTrack?.duration || currentStory?.duration || 1)) * 100} 
                  className="h-2"
                />
              </div>

              {/* Story Progress */}
              {currentStory && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Story Progress</span>
                    <span>{Math.floor((storyProgress / currentStory.duration) * 100)}%</span>
                  </div>
                  <div className="text-sm text-foreground bg-slate-800/50 rounded-lg p-3 max-h-32 overflow-y-auto">
                    {currentStory.content[Math.floor((storyProgress / currentStory.duration) * currentStory.content.length)] || currentStory.content[0]}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <Card className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur border-white/20">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Volume */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {volume[0] === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span className="text-sm font-medium">Volume</span>
                </div>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center">{volume[0]}%</div>
              </div>

              {/* Sleep Timer */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Sleep Timer</span>
                </div>
                <div className="flex gap-2">
                  {[0, 15, 30, 60, 90].map((minutes) => (
                    <Button
                      key={minutes}
                      variant={sleepTimer === minutes ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSleepTimer(minutes)}
                      className="text-xs"
                    >
                      {minutes === 0 ? 'Off' : `${minutes}m`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm font-medium">Quick Actions</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentTrack(null);
                      setCurrentStory(null);
                      setCurrentTime(0);
                      setStoryProgress(0);
                    }}
                    className="text-xs"
                  >
                    Stop All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentTime(0);
                      setStoryProgress(0);
                    }}
                    className="text-xs"
                  >
                    Restart
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sounds" className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Relaxing Sounds
            </TabsTrigger>
            <TabsTrigger value="stories" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Bedtime Stories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sounds" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {soundTracks.map((track) => (
                <motion.div
                  key={track.id}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 ${
                      currentTrack?.id === track.id 
                        ? 'bg-slate-700/50 border-indigo-500 shadow-lg' 
                        : 'bg-slate-800/50 hover:bg-slate-700/50'
                    }`}
                    onClick={() => playSound(track)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${track.color} flex items-center justify-center text-xl`}>
                          {track.emoji}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{track.name}</h4>
                          <p className="text-sm text-muted-foreground">{track.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {track.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(track.duration)}
                            </span>
                          </div>
                        </div>
                        <div className="text-indigo-400">
                          {currentTrack?.id === track.id && isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stories" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {bedtimeStories.map((story) => (
                <motion.div
                  key={story.id}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 ${
                      currentStory?.id === story.id 
                        ? 'bg-slate-700/50 border-purple-500 shadow-lg' 
                        : 'bg-slate-800/50 hover:bg-slate-700/50'
                    }`}
                    onClick={() => playStory(story)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-xl">
                          {story.emoji}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{story.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{story.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {story.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(story.duration)}
                            </span>
                          </div>
                        </div>
                        <div className="text-purple-400">
                          {currentStory?.id === story.id && isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Tips */}
        <Card className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-indigo-700">
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <Sparkles className="w-6 h-6 text-indigo-300" />
              </div>
              <h3 className="font-semibold text-indigo-200">Sleep Tips</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-indigo-300">
                <div className="text-center">
                  <div className="text-2xl mb-1">📱</div>
                  <p>Put devices away 30 minutes before sleep</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🌡️</div>
                  <p>Keep your room cool (60-67°F)</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🧘‍♀️</div>
                  <p>Practice deep breathing before bed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
