
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles, Book, Film, Music, Send, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";

interface Recommendation {
    title: string;
    category: 'book' | 'movie' | 'music';
    reason: string;
}

interface AIRecommendationsProps {
  userSession: any;
  currentMood?: string;
}

type ConversationState = 'asking' | 'loading' | 'answered';

export function AIRecommendations({ userSession, currentMood = 'neutral' }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState("");
  const [conversationState, setConversationState] = useState<ConversationState>('asking');
  const [aiQuestion, setAiQuestion] = useState("What's one thing you're curious about right now?");
  const [userResponse, setUserResponse] = useState("");

  useEffect(() => {
    getInitialQuestion();
  }, [userSession]);

  const getInitialQuestion = async () => {
    setIsLoading(true);
    setConversationState('asking');

    const prompt = `You are an AI that recommends content (books, movies, music). 
    Your first job is to ask a single, short, uplifting, and open-ended question to understand the user's current state of mind.
    For example: 'What's on your mind today?' or 'What's a feeling you'd like to explore right now?'.
    Keep it to one sentence.`;
    
    try {
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("Gemini API key is not set.");
      }
      
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "text/plain" },
          }),
        }
      );
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      const question = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "What's a feeling you'd like to explore today?";
      setAiQuestion(question.replace(/"/g, ''));
    } catch (error) {
      console.error("AI question generation error:", error);
      setAiQuestion("What's a feeling you'd like to explore today?");
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendations = async () => {
    if (!userResponse.trim()) return;

    setConversationState('loading');
    setIsLoading(true);

    const prompt = `Based on the user's response: "${userResponse}", act as an empathetic friend.
    
    First, provide a short, single-sentence, uplifting insight. 
    
    Then, recommend 3 to 5 items (books, movies, or music). For each item, provide:
    - title (string)
    - category (string: "book", "movie", or "music")
    - reason (string: a short, thoughtful explanation of why you're recommending it based on their response)

    Format the output as a single JSON object with two keys: "insight" and "recommendations".
    The "recommendations" value should be an array of objects.
    
    Example output:
    {
      "insight": "It sounds like you're searching for a sense of wonder and connection right now.",
      "recommendations": [
        {
          "title": "The Midnight Library",
          "category": "book",
          "reason": "For a thoughtful mood, this book offers perspective on life choices and happiness."
        },
        {
          "title": "Inside Out",
          "category": "movie",
          "reason": "A great way to understand and empathize with your own emotions."
        }
      ]
    }
    `;

    try {
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("Gemini API key is not set.");
      }
      
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      const responseJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsedResponse = JSON.parse(responseJson);

      setAiInsight(parsedResponse.insight || "Here are some recommendations you might enjoy.");
      setRecommendations(parsedResponse.recommendations || []);
      setConversationState('answered');

    } catch (error) {
      console.error("AI recommendation error:", error);
      setAiInsight(`I hear you. Here is some content that might resonate with you.`);
      setRecommendations([]);
      setConversationState('answered');
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    setUserResponse("");
    setRecommendations([]);
    getInitialQuestion();
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'book': return <Book className="w-4 h-4" />;
      case 'movie': return <Film className="w-4 h-4" />;
      case 'music': return <Music className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

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
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            AI Recommendations
          </h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={conversationState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-muted-foreground text-lg min-h-[28px]"
            >
              {conversationState === 'loading' ? 'Thinking...' : conversationState === 'answered' ? aiInsight : aiQuestion}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Conversational UI */}
        <AnimatePresence mode="wait">
        {conversationState === 'asking' && !isLoading && (
            <motion.div 
              key="asking"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4 max-w-lg mx-auto"
            >
              <Textarea
                placeholder="Share your thoughts..."
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                className="min-h-24 resize-none bg-slate-800/50 border-slate-700 rounded-xl"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    generateRecommendations();
                  }
                }}
              />
              <Button
                onClick={generateRecommendations}
                disabled={!userResponse.trim()}
                className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white rounded-2xl"
              >
                <Send className="w-4 h-4 mr-2" />
                Get My Recommendations
              </Button>
            </motion.div>
        )}

        {(conversationState === 'loading' || conversationState === 'answered') && (
            <motion.div
              key={conversationState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-center">
                <Button
                  onClick={resetConversation}
                  disabled={isLoading}
                  variant="outline"
                  className="bg-gradient-to-r from-violet-500/20 to-indigo-500/20 hover:from-violet-600/30 hover:to-indigo-600/30 text-white rounded-2xl"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Ask Another Question
                </Button>
              </div>

              {isLoading && conversationState === 'loading' ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50">
                        <CardContent className="p-6">
                          <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                            <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                            <div className="h-16 bg-slate-700 rounded"></div>
                            <div className="h-8 bg-slate-700 rounded w-full mt-4"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {recommendations.map((rec, index) => (
                        <motion.div
                          key={rec.title + index}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ y: -5, scale: 1.02 }}
                        >
                          <Card className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                            <CardContent className="p-6 flex flex-col flex-grow">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <Badge className="mb-2" variant="outline">
                                    {getCategoryIcon(rec.category)}
                                    <span className="ml-1 capitalize">{rec.category}</span>
                                  </Badge>
                                  <h3 className="font-semibold text-lg">{rec.title}</h3>
                                </div>
                              </div>
                              
                              <div className="bg-violet-900/50 rounded-lg p-3 my-4 flex-grow">
                                <p className="text-sm text-violet-300">
                                  <Sparkles className="w-3 h-3 inline mr-1" />
                                  {rec.reason}
                                </p>
                              </div>
                              
                              <Button
                                className="w-full mt-auto bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white rounded-2xl"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Explore
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
            </motion.div>
        )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

    