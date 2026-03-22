
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Trophy, Star, Flame, Calendar, CheckCircle, Circle, Gift, Sparkles, Target, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import initialState from "@/app/lib/challenges-state.json";

interface SelfCareChallengesProps {
  userSession: any;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'milestone';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  icon: string;
  color: string;
  isCompleted: boolean;
  completedAt?: string;
  streak?: number;
  totalDays?: number;
}

interface UserStats {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  challengesCompleted: number;
  badges: string[];
}

export function SelfCareChallenges({ userSession }: SelfCareChallengesProps) {
  const [challenges, setChallenges] = useState<Challenge[]>(initialState.challenges);
  const [userStats, setUserStats] = useState<UserStats>(initialState.userStats);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'daily' | 'weekly' | 'milestone'>('all');
  const [showCelebration, setShowCelebration] = useState(false);
  const [newBadge, setNewBadge] = useState<string | null>(null);

  useEffect(() => {
    // For demo, we manage state locally. In a real app, this would be a DB call.
    const savedState = localStorage.getItem(`challenges_state_${userSession?.id}`);
    if (savedState) {
      const { challenges: savedChallenges, userStats: savedStats } = JSON.parse(savedState);
      setChallenges(savedChallenges);
      setUserStats(savedStats);
    } else {
      setChallenges(initialState.challenges);
      setUserStats(initialState.userStats);
    }
  }, [userSession]);

  const saveState = (newChallenges: Challenge[], newStats: UserStats) => {
    // In a real app, you'd save this to a DB. For demo, we use localStorage.
    localStorage.setItem(`challenges_state_${userSession?.id}`, JSON.stringify({ challenges: newChallenges, userStats: newStats }));
  };

  const completeChallenge = (challengeId: string) => {
    let updatedChallenge: Challenge | undefined;
    const newChallenges = challenges.map(c => {
      if (c.id === challengeId && !c.isCompleted) {
        updatedChallenge = { ...c, isCompleted: true, completedAt: new Date().toISOString() };
        return updatedChallenge;
      }
      return c;
    });

    if (updatedChallenge) {
      setChallenges(newChallenges);

      const newStats = {
        ...userStats,
        totalPoints: userStats.totalPoints + updatedChallenge.points,
        challengesCompleted: userStats.challengesCompleted + 1,
        currentStreak: updatedChallenge.category === 'daily' ? userStats.currentStreak + 1 : userStats.currentStreak
      };

      const newLevel = Math.floor(newStats.totalPoints / 100) + 1;
      if (newLevel > userStats.level) {
        newStats.level = newLevel;
        triggerCelebration(`Level ${newLevel} Unlocked! 🎉`);
      }

      checkForNewBadges(newStats, (badgeMessage) => {
         triggerCelebration(badgeMessage);
      });
      
      setUserStats(newStats);
      saveState(newChallenges, newStats);
      triggerCelebration(`+${updatedChallenge.points} points! 🌟`);
    }
  };

  const triggerCelebration = (message: string) => {
    setNewBadge(message);
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      setNewBadge(null);
    }, 3000);
  };

  const checkForNewBadges = (stats: UserStats, onNewBadge: (message: string) => void) => {
    const newBadges = [...stats.badges];
    let badgeEarned = false;

    if (stats.challengesCompleted >= 5 && !newBadges.includes('starter')) {
      newBadges.push('starter');
      onNewBadge('🎯 Starter Badge Earned!');
      badgeEarned = true;
    }
    
    if (stats.currentStreak >= 7 && !newBadges.includes('streak')) {
      newBadges.push('streak');
      onNewBadge('🔥 Streak Master Badge!');
      badgeEarned = true;
    }
    
    if (stats.totalPoints >= 500 && !newBadges.includes('achiever')) {
      newBadges.push('achiever');
      onNewBadge('⭐ High Achiever Badge!');
      badgeEarned = true;
    }
    
    if (badgeEarned) {
      setUserStats(prev => ({ ...prev, badges: newBadges }));
    }
  };

  const filteredChallenges = selectedCategory === 'all' 
    ? challenges 
    : challenges.filter(c => c.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-300 bg-green-900/50';
      case 'medium': return 'text-yellow-300 bg-yellow-900/50';
      case 'hard': return 'text-red-300 bg-red-900/50';
      default: return 'text-gray-300 bg-gray-700/50';
    }
  };

  const getProgressToNextLevel = () => {
    const currentLevelPoints = (userStats.level - 1) * 100;
    const pointsForNextLevel = 100;
    const progress = ((userStats.totalPoints - currentLevelPoints) / pointsForNextLevel) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Self-Care Challenges
          </h1>
          <p className="text-muted-foreground">Build healthy habits with fun, rewarding challenges</p>
        </div>

        {/* User Stats Dashboard */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2"><Star className="w-8 h-8" /></div>
              <div className="text-2xl font-bold">{userStats.totalPoints}</div>
              <div className="text-violet-100 text-sm">Total Points</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2"><Flame className="w-8 h-8" /></div>
              <div className="text-2xl font-bold">{userStats.currentStreak}</div>
              <div className="text-orange-100 text-sm">Current Streak</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2"><Award className="w-8 h-8" /></div>
              <div className="text-2xl font-bold">Level {userStats.level}</div>
              <div className="text-blue-100 text-sm">Current Level</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2"><Target className="w-8 h-8" /></div>
              <div className="text-2xl font-bold">{userStats.challengesCompleted}</div>
              <div className="text-emerald-100 text-sm">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">Level {userStats.level} Progress</span>
              <span className="text-sm text-muted-foreground">
                {userStats.totalPoints - ((userStats.level - 1) * 100)}/{100} XP
              </span>
            </div>
            <Progress 
              value={getProgressToNextLevel()} 
              className="h-3 bg-slate-700"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {100 - (userStats.totalPoints - ((userStats.level - 1) * 100))} points to next level
            </p>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { key: 'all', label: 'All Challenges', icon: Sparkles },
            { key: 'daily', label: 'Daily', icon: Calendar },
            { key: 'weekly', label: 'Weekly', icon: Target },
            { key: 'milestone', label: 'Milestones', icon: Trophy }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => setSelectedCategory(key as any)}
              variant={selectedCategory === key ? "default" : "outline"}
              className={selectedCategory === key 
                ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white" 
                : ""
              }
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        {/* Challenges Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredChallenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`group ${challenge.isCompleted ? 'opacity-75' : ''}`}
              >
                <Card className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${challenge.color} flex items-center justify-center text-2xl`}>
                        {challenge.icon}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        <div className="flex items-center text-violet-300">
                          <Star className="w-4 h-4 mr-1" />
                          <span className="font-medium">{challenge.points}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-semibold text-foreground mb-2">{challenge.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{challenge.description}</p>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-violet-300 border-violet-700">
                        {challenge.category}
                      </Badge>
                      
                      {challenge.isCompleted ? (
                        <div className="flex items-center text-green-400">
                          <CheckCircle className="w-5 h-5 mr-1" />
                          <span className="text-sm font-medium">Completed!</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => completeChallenge(challenge.id)}
                          size="sm"
                          className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
                        >
                          <Circle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Badges Section */}
        {userStats.badges.length > 0 && (
          <Card className="bg-gradient-to-r from-yellow-900/50 to-amber-900/50 border-yellow-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-300">
                <Gift className="w-5 h-5" />
                <span>Your Badges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {userStats.badges.map((badge) => (
                  <motion.div
                    key={badge}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur rounded-full px-4 py-2 border border-yellow-700"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full flex items-center justify-center">
                      <span className="text-xs">🏆</span>
                    </div>
                    <span className="text-amber-300 text-sm font-medium capitalize">{badge}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
              <span className="font-medium">{newBadge}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating celebration particles */}
      {showCelebration && typeof window !== 'undefined' && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 1, 
                y: window.innerHeight,
                x: Math.random() * window.innerWidth,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                y: -100,
                rotate: Math.random() * 360
              }}
              transition={{
                duration: Math.random() * 2 + 3,
                ease: "easeOut"
              }}
              className="absolute text-2xl"
            >
              {['🎉', '⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
