import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Users, Heart, MessageCircle, Shield, Send, Plus, Sparkles, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface PeerCirclesProps {
  userSession: any;
}

interface Circle {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  theme: string;
  isPrivate: boolean;
  lastActivity: string;
  color: string;
}

interface Message {
  id: string;
  circleId: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: string;
  reactions: { emoji: string; count: number }[];
  supportGiven: number;
}

export function PeerCircles({ userSession }: PeerCirclesProps) {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [activeView, setActiveView] = useState<'browse' | 'chat' | 'create'>('browse');

  useEffect(() => {
    // Initialize with some sample circles
    const sampleCircles: Circle[] = [
      {
        id: "1",
        name: "Study Stress Support",
        description: "A safe space for students dealing with academic pressure",
        memberCount: 47,
        theme: "academic",
        isPrivate: false,
        lastActivity: "2 min ago",
        color: "from-blue-500 to-indigo-500"
      },
      {
        id: "2", 
        name: "Night Owls Unite",
        description: "For those who find peace in late-night conversations",
        memberCount: 23,
        theme: "night",
        isPrivate: false,
        lastActivity: "5 min ago",
        color: "from-purple-500 to-pink-500"
      },
      {
        id: "3",
        name: "Creative Souls",
        description: "Artists, writers, and creators sharing their journey",
        memberCount: 34,
        theme: "creative",
        isPrivate: false,
        lastActivity: "1 hour ago", 
        color: "from-emerald-500 to-teal-500"
      },
      {
        id: "4",
        name: "Anxiety Allies",
        description: "Understanding anxiety together, one breath at a time",
        memberCount: 82,
        theme: "anxiety",
        isPrivate: true,
        lastActivity: "Just now",
        color: "from-rose-400 to-orange-400"
      }
    ];
    setCircles(sampleCircles);
  }, []);

  const joinCircle = (circle: Circle) => {
    setSelectedCircle(circle);
    setActiveView('chat');
    
    // Load sample messages for the circle
    const sampleMessages: Message[] = [
      {
        id: "1",
        circleId: circle.id,
        authorId: "user1",
        authorName: "StarryNight",
        content: "Just wanted to share that I finally submitted my thesis! The anxiety was overwhelming but this community helped me push through 💙",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        reactions: [{ emoji: "💙", count: 12 }, { emoji: "🎉", count: 8 }],
        supportGiven: 15
      },
      {
        id: "2", 
        circleId: circle.id,
        authorId: "user2",
        authorName: "MoonChild",
        content: "Having one of those days where everything feels too much. Anyone else struggling today?",
        timestamp: new Date(Date.now() - 120000).toISOString(),
        reactions: [{ emoji: "🤗", count: 6 }, { emoji: "💜", count: 4 }],
        supportGiven: 8
      },
      {
        id: "3",
        circleId: circle.id, 
        authorId: "user3",
        authorName: "WarmVibes",
        content: "@MoonChild I'm here with you. Some days are harder than others and that's okay. You're not alone in this 🌙✨",
        timestamp: new Date(Date.now() - 60000).toISOString(),
        reactions: [{ emoji: "💙", count: 3 }],
        supportGiven: 2
      }
    ];
    setMessages(sampleMessages);
    setShowJoinModal(false);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedCircle) return;

    const message: Message = {
      id: Date.now().toString(),
      circleId: selectedCircle.id,
      authorId: userSession?.id || "anonymous",
      authorName: userSession?.nickname || "Anonymous",
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      reactions: [],
      supportGiven: 0
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions.map(r => 
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1 }]
          };
        }
      }
      return msg;
    }));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (activeView === 'chat') {
    return (
      <div className="min-h-screen bg-background">
        {/* Chat Header */}
        <div className="bg-slate-900/80 backdrop-blur border-b border-slate-700 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => {
                    setActiveView('browse');
                    setSelectedCircle(null);
                  }}
                  variant="ghost"
                  className="text-muted-foreground"
                >
                  ← Back
                </Button>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${selectedCircle.color} flex items-center justify-center`}>
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{selectedCircle.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedCircle.memberCount} members • {selectedCircle.isPrivate ? 'Private' : 'Open'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-400 border-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="max-w-4xl mx-auto p-4 space-y-4 pb-24">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 shadow-sm border border-slate-700"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-400 to-blue-400 flex items-center justify-center">
                    <span className="text-sm text-white font-medium">
                      {message.authorName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-foreground">{message.authorName}</span>
                      <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                    </div>
                    <p className="text-foreground mb-3">{message.content}</p>
                    
                    {/* Reactions */}
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-1">
                        {message.reactions.map((reaction, index) => (
                          <button
                            key={index}
                            onClick={() => addReaction(message.id, reaction.emoji)}
                            className="flex items-center space-x-1 bg-slate-700 hover:bg-slate-600 rounded-full px-2 py-1 text-sm transition-colors"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-muted-foreground">{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                      <div className="flex space-x-2 text-xs">
                        <button 
                          onClick={() => addReaction(message.id, "💙")}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          💙 Support
                        </button>
                        <button 
                          onClick={() => addReaction(message.id, "🤗")}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          🤗 Hug
                        </button>
                        <button 
                          onClick={() => addReaction(message.id, "✨")}
                          className="text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          ✨ Encourage
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Message Input */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur border-t border-slate-700 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-3">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share your thoughts... remember, you're among friends 💜"
                className="flex-1 bg-slate-800 border-slate-600 rounded-xl resize-none"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white rounded-xl px-6"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center"
          >
            <Users className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            Peer Circles
          </h1>
          <p className="text-muted-foreground">Connect with others in safe, anonymous spaces</p>
        </div>

        {/* Safety Notice */}
        <Card className="bg-gradient-to-r from-blue-900/50 to-teal-900/50 border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="font-semibold text-blue-200">Safe Space Guidelines</h3>
                <p className="text-blue-300 text-sm mt-1">
                  All circles are anonymous and moderated. Be kind, supportive, and respect others' privacy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Circle Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {circles.map((circle) => (
            <motion.div
              key={circle.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => joinCircle(circle)}
            >
              <Card className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-violet-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${circle.color} flex items-center justify-center`}>
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {circle.isPrivate && (
                        <Badge variant="outline" className="text-purple-400 border-purple-700">
                          <Shield className="w-3 h-3 mr-1" />
                          Private
                        </Badge>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {circle.lastActivity}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-violet-400 transition-colors">
                    {circle.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">{circle.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {circle.memberCount} members
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Active
                      </div>
                    </div>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-violet-400 group-hover:text-violet-300"
                    >
                      →
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Create New Circle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 border-violet-700 border-dashed">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-violet-800 to-purple-800 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-violet-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-violet-200 mb-2">Create Your Own Circle</h3>
                  <p className="text-violet-400 text-sm mb-4">
                    Start a new supportive community around a topic you care about
                  </p>
                  <Button 
                    variant="outline"
                    className="border-violet-600 text-violet-300 hover:bg-violet-800/50"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
