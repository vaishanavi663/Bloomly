
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Heart, Plus, Star, Sparkles, Calendar, Filter, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import initialPosts from '@/app/lib/gratitude-posts.json';

interface GratitudeWallProps {
  userSession: any;
}

interface GratitudePost {
  id: string;
  content: string;
  author: string;
  date: string;
  category: 'family' | 'friends' | 'achievement' | 'nature' | 'health' | 'moment' | 'other';
  hearts: number;
  userHearted: boolean;
  anonymous: boolean;
}

const categoryEmojis = {
  family: '👨‍👩‍👧‍👦',
  friends: '👯‍♀️',
  achievement: '🏆',
  nature: '🌳',
  health: '💪',
  moment: '✨',
  other: '💝'
};

const categoryColors = {
  family: 'bg-pink-900/50 text-pink-300',
  friends: 'bg-yellow-900/50 text-yellow-300',
  achievement: 'bg-purple-900/50 text-purple-300',
  nature: 'bg-green-900/50 text-green-300',
  health: 'bg-blue-900/50 text-blue-300',
  moment: 'bg-orange-900/50 text-orange-300',
  other: 'bg-gray-700/50 text-gray-300'
};

export function GratitudeWall({ userSession }: GratitudeWallProps) {
  const [posts, setPosts] = useState<GratitudePost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GratitudePost['category']>('moment');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [filter, setFilter] = useState<'all' | GratitudePost['category']>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    // For demo purposes, we manage state locally. In a real app, this would be a DB call.
    const savedPosts = localStorage.getItem(`gratitude_wall_${userSession?.id}`);
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(initialPosts);
    }
  }, [userSession]);

  const handleSubmit = async () => {
    if (!newPost.trim()) return;
    
    setIsSubmitting(true);
    
    const post: GratitudePost = {
      id: Date.now().toString(),
      content: newPost.trim(),
      author: isAnonymous ? `Anonymous${Math.floor(Math.random() * 1000)}` : userSession?.nickname || 'You',
      date: new Date().toISOString(),
      category: selectedCategory,
      hearts: 0,
      userHearted: false,
      anonymous: isAnonymous
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    // In a real app, you'd save this to a DB. For demo, we use localStorage.
    localStorage.setItem(`gratitude_wall_${userSession?.id}`, JSON.stringify(updatedPosts));
    
    setNewPost('');
    setShowAddDialog(false);
    setIsSubmitting(false);
  };

  const toggleHeart = (postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          hearts: post.userHearted ? post.hearts - 1 : post.hearts + 1,
          userHearted: !post.userHearted
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem(`gratitude_wall_${userSession?.id}`, JSON.stringify(updatedPosts));
  };

  const filteredPosts = filter === 'all' ? posts : posts.filter(post => post.category === filter);

  const getTimeAgo = (dateString: string) => {
    if (typeof window === 'undefined') return ''; // Avoid server-side rendering issues
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
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
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center"
          >
            <Heart className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
            Daily Gratitude Wall
          </h1>
          <p className="text-muted-foreground">Share what you're grateful for and spread positivity ✨</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-3 items-center">
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="family">👨‍👩‍👧‍👦 Family</SelectItem>
                <SelectItem value="friends">👯‍♀️ Friends</SelectItem>
                <SelectItem value="achievement">🏆 Achievement</SelectItem>
                <SelectItem value="nature">🌳 Nature</SelectItem>
                <SelectItem value="health">💪 Health</SelectItem>
                <SelectItem value="moment">✨ Moment</SelectItem>
                <SelectItem value="other">💝 Other</SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="outline">
              {filteredPosts.length} gratitude posts
            </Badge>
          </div>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-2xl">
                <Plus className="w-4 h-4 mr-2" />
                Share Gratitude
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" />
                  What are you grateful for today?
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="I'm grateful for..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-24 resize-none"
                  maxLength={280}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {newPost.length}/280 characters
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family">👨‍👩‍👧‍👦 Family</SelectItem>
                        <SelectItem value="friends">👯‍♀️ Friends</SelectItem>
                        <SelectItem value="achievement">🏆 Achievement</SelectItem>
                        <SelectItem value="nature">🌳 Nature</SelectItem>
                        <SelectItem value="health">💪 Health</SelectItem>
                        <SelectItem value="moment">✨ Moment</SelectItem>
                        <SelectItem value="other">💝 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="anonymous" className="text-sm">
                    Post anonymously
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!newPost.trim() || isSubmitting}
                    className="flex-1 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Sharing...
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-2" />
                        Share
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6">
          <AnimatePresence>
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Card className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-400 to-orange-400 flex items-center justify-center">
                          <span className="text-xl">{categoryEmojis[post.category]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{post.author}</p>
                          <p className="text-xs text-muted-foreground">{getTimeAgo(post.date)}</p>
                        </div>
                      </div>
                      <Badge className={categoryColors[post.category]}>
                        {post.category}
                      </Badge>
                    </div>

                    <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                    <div className="flex items-center justify-between">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleHeart(post.id)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${
                          post.userHearted
                            ? 'bg-rose-900/50 text-rose-300'
                            : 'bg-slate-700/50 text-muted-foreground hover:bg-rose-900/50 hover:text-rose-300'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${post.userHearted ? 'fill-current' : ''}`}
                        />
                        <span className="text-sm font-medium">{post.hearts}</span>
                      </motion.button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🌸</div>
            <p className="text-muted-foreground mb-4">
              {filter === 'all' 
                ? "No gratitude posts yet. Be the first to share!" 
                : `No ${filter} posts yet.`}
            </p>
            <Button
              onClick={() => setShowAddDialog(true)}
              variant="outline"
              className="rounded-2xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Share Your First Gratitude
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
