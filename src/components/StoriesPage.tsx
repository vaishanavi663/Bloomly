import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Heart, MessageCircle, Share2, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface Story {
  id: string;
  title: string;
  excerpt: string;
  fullStory: string;
  author: string;
  avatar: string;
  category: string;
  likes: number;
  comments: number;
  readTime: string;
  tags: string[];
}

export function StoriesPage() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set());

  const stories: Story[] = [
    {
      id: '1',
      title: 'Finding Light in Dark Times',
      excerpt: 'My journey through anxiety and how I learned to embrace small victories...',
      fullStory: `When I first started experiencing anxiety, it felt like I was drowning in my own thoughts. Every day was a struggle, and I couldn't see a way out. But gradually, with the help of therapy, supportive friends, and mindfulness practices, I began to find small moments of peace.

The breakthrough came when I realized that healing isn't linear. Some days are harder than others, and that's okay. I learned to celebrate tiny victories - getting out of bed, taking a shower, having a conversation with a friend. These small steps built up my confidence and showed me that I was stronger than I thought.

Today, I still have challenging days, but I have tools to cope. I practice gratitude, connect with nature, and most importantly, I'm kind to myself. If you're struggling, please know that it's okay to not be okay, and that seeking help is a sign of strength, not weakness.`,
      author: 'Maya',
      avatar: '/api/placeholder/32/32',
      category: 'Anxiety',
      likes: 142,
      comments: 28,
      readTime: '3 min read',
      tags: ['anxiety', 'recovery', 'mindfulness']
    },
    {
      id: '2',
      title: 'The Power of Speaking Up',
      excerpt: 'How sharing my struggles with depression helped me heal and connect...',
      fullStory: `For years, I kept my depression a secret. I thought I could handle it alone, that admitting I was struggling would make me a burden to others. But isolation only made things worse.

The turning point came when I finally opened up to my best friend. I was terrified they would judge me or pull away, but instead, they listened with compassion and shared their own struggles. That conversation changed everything.

Opening up didn't cure my depression, but it broke the cycle of shame and isolation. I learned that vulnerability creates connection, not distance. Now I encourage others to share their stories too - not because it's easy, but because it's worth it.`,
      author: 'Alex',
      avatar: '/api/placeholder/32/32',
      category: 'Depression',
      likes: 89,
      comments: 15,
      readTime: '2 min read',
      tags: ['depression', 'vulnerability', 'connection']
    },
    {
      id: '3',
      title: 'Building Healthy Boundaries',
      excerpt: 'Learning to say no and protect my mental health in relationships...',
      fullStory: `I used to be a people pleaser. I said yes to everything, even when it drained me emotionally and physically. I thought being helpful meant never disappointing anyone, but I was only disappointing myself.

Learning to set boundaries was one of the hardest but most important things I've ever done. It started with small things - saying no to plans when I needed rest, speaking up when someone crossed a line, prioritizing my own needs.

At first, some people didn't understand. But the people who truly cared about me respected my boundaries and even thanked me for being honest. Now I have healthier relationships and more energy to give to the things that truly matter.`,
      author: 'Jordan',
      avatar: '/api/placeholder/32/32',
      category: 'Self-Care',
      likes: 203,
      comments: 42,
      readTime: '4 min read',
      tags: ['boundaries', 'self-care', 'relationships']
    },
    {
      id: '4',
      title: 'Overcoming Social Anxiety',
      excerpt: 'From avoiding social situations to finding my voice and community...',
      fullStory: `Social anxiety controlled my life for years. I avoided parties, presentations, even casual conversations. The fear of judgment was paralyzing, and I missed out on so many opportunities and connections.

The journey to overcome social anxiety started with small, manageable steps. I practiced conversations in the mirror, joined online communities where I felt safer to express myself, and gradually pushed myself into increasingly social situations.

Therapy helped me understand that most people are focused on themselves, not judging me. I learned coping strategies like deep breathing and positive self-talk. Today, while I still feel nervous sometimes, I don't let social anxiety make decisions for me anymore.`,
      author: 'Sam',
      avatar: '/api/placeholder/32/32',
      category: 'Social Anxiety',
      likes: 156,
      comments: 33,
      readTime: '3 min read',
      tags: ['social anxiety', 'growth', 'courage']
    }
  ];

  const handleLike = (storyId: string) => {
    setLikedStories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) {
        newSet.delete(storyId);
      } else {
        newSet.add(storyId);
      }
      return newSet;
    });
  };

  const categories = ['All', 'Anxiety', 'Depression', 'Self-Care', 'Social Anxiety'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredStories = selectedCategory === 'All' 
    ? stories 
    : stories.filter(story => story.category === selectedCategory);

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-semibold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Peer Stories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from young people who've walked similar paths. You're not alone in your journey.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {categories.map((category) => (
            <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-2xl ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                    : 'hover:bg-accent/10'
                }`}
              >
                {category}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="p-6 rounded-3xl bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                      {story.author[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{story.author}</p>
                    <p className="text-sm text-muted-foreground">{story.readTime}</p>
                  </div>
                  <div className="ml-auto">
                    <Badge 
                      variant="secondary" 
                      className="bg-accent/20 text-accent-foreground rounded-full"
                    >
                      {story.category}
                    </Badge>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-foreground">{story.title}</h3>
                <p className="text-muted-foreground mb-4 flex-grow">{story.excerpt}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {story.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs rounded-full">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(story.id)}
                      className={`flex items-center space-x-1 transition-colors ${
                        likedStories.has(story.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedStories.has(story.id) ? 'fill-current' : ''}`} />
                      <span className="text-sm">{story.likes + (likedStories.has(story.id) ? 1 : 0)}</span>
                    </motion.button>
                    
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{story.comments}</span>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      onClick={() => setSelectedStory(story)}
                      className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl"
                    >
                      Read More
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Story Detail Modal */}
        <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl">
            {selectedStory && (
              <>
                <DialogHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                        {selectedStory.author[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedStory.author}</p>
                      <p className="text-sm text-muted-foreground">{selectedStory.readTime}</p>
                    </div>
                    <div className="ml-auto">
                      <Badge 
                        variant="secondary" 
                        className="bg-accent/20 text-accent-foreground rounded-full"
                      >
                        {selectedStory.category}
                      </Badge>
                    </div>
                  </div>
                  <DialogTitle className="text-2xl">{selectedStory.title}</DialogTitle>
                </DialogHeader>
                
                <div className="mt-6">
                  <div className="prose prose-lg max-w-none prose-invert">
                    {selectedStory.fullStory.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-6 mb-4">
                    {selectedStory.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs rounded-full">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(selectedStory.id)}
                        className={`flex items-center space-x-2 transition-colors ${
                          likedStories.has(selectedStory.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${likedStories.has(selectedStory.id) ? 'fill-current' : ''}`} />
                        <span>{selectedStory.likes + (likedStories.has(selectedStory.id) ? 1 : 0)} likes</span>
                      </motion.button>
                      
                      <div className="flex items-center space-x-2 text-gray-500">
                        <MessageCircle className="w-5 h-5" />
                        <span>{selectedStory.comments} comments</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-2xl"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
