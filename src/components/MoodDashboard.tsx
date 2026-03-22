
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Calendar, TrendingUp, Brain, Heart, Lightbulb, Target, 
  ChevronLeft, ChevronRight, Sparkles, BarChart3, LineChart
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import initialMoodData from '@/app/lib/mood-entries.json';

interface MoodDashboardProps {
  userSession: any;
  onMoodChange?: (mood: string) => void;
}

interface MoodEntry {
  date: string;
  mood: number;
  emotions: string[];
  notes?: string;
  activities?: string[];
}

interface Insight {
  type: 'pattern' | 'suggestion' | 'achievement' | 'concern';
  title: string;
  description: string;
  icon: string;
  color: string;
}

const moodLevels = {
  1: { emoji: '😢', name: 'awful' }, 2: { emoji: '😭', name: 'very sad' },
  3: { emoji: '😞', name: 'sad' }, 4: { emoji: '😕', name: 'down' },
  5: { emoji: '😐', name: 'neutral' }, 6: { emoji: '🙂', name: 'okay' },
  7: { emoji: '😊', name: 'happy' }, 8: { emoji: '😄', name: 'very happy' },
  9: { emoji: '🤩', name: 'ecstatic' }, 10: { emoji: '🥳', name: 'fantastic' }
};

export function MoodDashboard({ userSession, onMoodChange }: MoodDashboardProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [moodData, setMoodData] = useState<MoodEntry[]>(initialMoodData);
  const [viewMode, setViewMode] = useState<'calendar' | 'trends' | 'insights'>('calendar');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const getMoodForDate = (date: Date): MoodEntry | undefined => {
    return moodData.find(entry => entry.date === date.toISOString().split('T')[0]);
  };

  useEffect(() => {
    const todayMood = getMoodForDate(new Date());
    if (todayMood && onMoodChange) {
      onMoodChange(moodLevels[todayMood.mood as keyof typeof moodLevels]?.name || 'neutral');
    }
  }, [moodData, onMoodChange]);
  
  useEffect(() => {
    const data = moodData.length > 0 ? moodData : generateSampleData();
    setMoodData(data);
    generateInsights(data);
  }, []);

  const saveMood = (mood: number) => {
    if (!selectedDate) return;

    const newEntry: MoodEntry = {
      date: selectedDate.toISOString().split('T')[0],
      mood,
      emotions: [],
      activities: []
    };

    const updatedData = moodData.filter(entry => entry.date !== newEntry.date);
    updatedData.push(newEntry);
    updatedData.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setMoodData(updatedData);
    setSelectedMood(mood);
    if(onMoodChange) onMoodChange(moodLevels[mood as keyof typeof moodLevels]?.name || 'neutral');
    
    // In a real app, this would write to the JSON file on the server
    console.log("Saving mood to local state (demo only):", updatedData);
  };

  const generateInsights = (data: MoodEntry[]) => {
    // Insights generation logic remains the same
    const recentData = data.slice(-7);
    if (recentData.length < 7) {
      setInsights([]);
      return;
    }

    const averageMood = recentData.reduce((sum, entry) => sum + entry.mood, 0) / recentData.length;
    const previousWeekAverage = data.slice(-14, -7).reduce((sum, entry) => sum + entry.mood, 0) / 7;
    
    const newInsights: Insight[] = [];

    // Trend analysis
    if (averageMood > previousWeekAverage + 0.5) {
      newInsights.push({
        type: 'achievement',
        title: 'Mood Improvement Streak!',
        description: `Your mood has improved by ${((averageMood - previousWeekAverage) * 10).toFixed(0)}% this week compared to last week.`,
        icon: '📈',
        color: 'from-green-400 to-emerald-500'
      });
    }
  };

  const generateSampleData = () => {
      const data: MoodEntry[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const baselineMood = 6 + Math.sin(i / 7) * 1.5;
        const randomVariation = (Math.random() - 0.5) * 2;
        const mood = Math.max(1, Math.min(10, Math.round(baselineMood + randomVariation)));
        data.push({
          date: date.toISOString().split('T')[0],
          mood: mood,
          emotions: [],
          activities: []
        });
      }
      return data;
  };

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return 'bg-red-800/50 text-red-200';
    if (mood <= 5) return 'bg-orange-800/50 text-orange-200';
    if (mood <= 7) return 'bg-yellow-800/50 text-yellow-200';
    return 'bg-green-800/50 text-green-200';
  };

  const getMoodEmoji = (mood: number) => moodLevels[mood as keyof typeof moodLevels]?.emoji || '🤔';

  const formatChartData = () => moodData.slice(-14).map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: entry.mood,
      fullDate: entry.date
    }));

  const getEmotionData = () => {
    const emotionCounts: { [key: string]: number } = {};
    moodData.forEach(entry => {
      entry.emotions.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });

    const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
    
    return Object.entries(emotionCounts)
      .map(([emotion, count], index) => ({ name: emotion, value: count, color: colors[index % colors.length] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`} className="h-12"></div>);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = dateObj.toISOString().split('T')[0];
      const moodEntry = moodData.find(entry => entry.date === dateString);
      
      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedDate(dateObj)}
          className={`h-12 w-12 mx-auto rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
            moodEntry ? getMoodColor(moodEntry.mood) : 'bg-slate-800/50 hover:bg-slate-700/50'
          } ${selectedDate?.toDateString() === dateObj.toDateString() ? 'ring-2 ring-violet-400' : ''}`}
        >
          <span className="text-sm font-medium">{day}</span>
          {moodEntry && <span className="text-xs">{getMoodEmoji(moodEntry.mood)}</span>}
        </motion.div>
      );
    }
    return days;
  };

  const renderView = (view: typeof viewMode) => {
    switch (view) {
      case 'trends':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Card className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50">
              <CardHeader><CardTitle className="flex items-center space-x-2"><LineChart className="w-5 h-5 text-violet-400" /><span>14-Day Mood Trend</span></CardTitle></CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={formatChartData()}>
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis domain={[1, 10]} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                      <Line type="monotone" dataKey="mood" stroke="url(#gradient)" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 5 }} />
                      <defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="#06B6D4" /></linearGradient></defs>
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      case 'insights':
         return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {insights.length > 0 ? insights.map((insight, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className={`bg-gradient-to-r ${insight.color} text-white border-0 shadow-xl`}>
                  <CardContent className="p-6 flex items-start space-x-4">
                    <div className="text-4xl">{insight.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{insight.title}</h3>
                      <p className="opacity-90">{insight.description}</p>
                      <Badge className="mt-3 bg-white/20 text-white border-white/30 capitalize">{insight.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )) : <p className="text-center text-muted-foreground">Not enough data for insights yet. Keep tracking your mood!</p>}
          </motion.div>
        );
      default: // calendar view
        return (
          <>
            <Card className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2"><Calendar className="w-5 h-5 text-violet-400" /><span>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></CardTitle>
                  <div className="flex space-x-2">
                    <Button onClick={() => navigateMonth('prev')} variant="outline" size="sm"><ChevronLeft className="w-4 h-4" /></Button>
                    <Button onClick={() => navigateMonth('next')} variant="outline" size="sm"><ChevronRight className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4 text-center text-sm font-medium text-muted-foreground">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="p-2">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
              </CardContent>
            </Card>
            
            <AnimatePresence>
              {selectedDate && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <Card className="bg-gradient-to-r from-violet-900/80 to-blue-900/80 border-violet-700">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>How are you feeling on {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}?</span>
                        <Button onClick={() => setSelectedDate(null)} variant="ghost" size="sm">×</Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="flex justify-center flex-wrap gap-2 mb-4">
                        {Object.entries(moodLevels).map(([level, { emoji, name }]) => (
                          <motion.button
                            key={level}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => saveMood(parseInt(level))}
                            className={`p-2 rounded-lg text-3xl transition-all ${getMoodForDate(selectedDate)?.mood === parseInt(level) ? 'bg-violet-500/50 ring-2 ring-violet-300' : 'hover:bg-violet-500/20'}`}
                            title={name}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>
                      {getMoodForDate(selectedDate) && (
                        <p className="text-violet-300">You rated your mood as {getMoodForDate(selectedDate)?.mood}/10 ({moodLevels[getMoodForDate(selectedDate)!.mood as keyof typeof moodLevels].name}).</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        );
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              {viewMode === 'calendar' ? 'Mood Calendar' : viewMode === 'trends' ? 'Mood Trends' : 'AI Insights'}
            </h1>
            <p className="text-muted-foreground">
              {viewMode === 'calendar' ? 'Track your daily emotional wellbeing' : viewMode === 'trends' ? 'Track your emotional patterns over time' : 'Personalized patterns and suggestions'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setViewMode('calendar')} variant={viewMode === 'calendar' ? 'default' : 'outline'}><Calendar className="w-4 h-4 mr-2" />Calendar</Button>
            <Button onClick={() => setViewMode('trends')} variant={viewMode === 'trends' ? 'default' : 'outline'}><TrendingUp className="w-4 h-4 mr-2" />Trends</Button>
            <Button onClick={() => setViewMode('insights')} variant={viewMode === 'insights' ? 'default' : 'outline'}><Brain className="w-4 h-4 mr-2" />Insights</Button>
          </div>
        </div>
        {renderView(viewMode)}
      </motion.div>
    </div>
  );
}
