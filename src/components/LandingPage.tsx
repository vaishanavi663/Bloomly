'use client';
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  MessageSquare, BookOpen, BarChart3, Heart, Shield, Zap, 
  Users, Trophy, Leaf, Mic, Calendar, User, Star, Play, Moon, Sparkles 
} from "lucide-react";
import Image from "next/image";
import { useAuthModal } from "@/app/context/app-context";
import { useRouter } from "next/navigation";

export function LandingPage() {
  const { setShowAuthModal } = useAuthModal();
  const router = useRouter();
  
  const onPageChange = (page: string) => {
    router.push(page);
  };
  
  const onAuthClick = () => {
    setShowAuthModal(true);
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-indigo-900/30"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div 
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1, 1.05, 1] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-6xl md:text-8xl mb-4"
              >
                🌱
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold bg-gradient-to-r from-rose-400 via-violet-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                Bloomly
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Your comprehensive mental wellness platform designed for youth. Bloom into your best self with AI-powered tools. 
                <span className="block mt-2 text-lg text-gray-400">
                  Safe, anonymous, and empowering 🌸✨
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    onClick={onAuthClick}
                    className="bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-2xl px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Start Chatting Now
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => onPageChange('/stories')}
                    className="border-2 border-violet-500 text-violet-300 hover:bg-violet-900/50 rounded-2xl px-8 py-6"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Success Stories
                  </Button>
                </motion.div>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>100% Anonymous</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span>Youth-Focused</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Instant Support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comprehensive Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">
              Your Complete Wellness Ecosystem
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need to bloom into your best self - AI companion, mood tracking, peer support, personalized recommendations, and more.
            </p>
          </motion.div>

          {/* Core Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: MessageSquare,
                title: "AI Chat Companion",
                description: "Warm, empathetic conversations with AI trained to understand youth mental health.",
                gradient: "from-blue-500 to-cyan-500",
                badge: "24/7"
              },
              {
                icon: Mic,
                title: "Voice Journal",
                description: "Record your thoughts and get AI-powered emotion insights and mood analysis.",
                gradient: "from-purple-500 to-violet-500",
                badge: "New"
              },
              {
                icon: Calendar,
                title: "Mood Tracker",
                description: "Visual calendar with trends, patterns, and personalized AI suggestions.",
                gradient: "from-teal-500 to-emerald-500",
                badge: "Smart"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="p-8 rounded-3xl border-0 shadow-xl bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 h-full relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 mb-6 mx-auto`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  {feature.badge && (
                    <Badge className="absolute top-4 right-4 bg-orange-500 text-white">
                      {feature.badge}
                    </Badge>
                  )}
                  <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
                  <p className="text-muted-foreground text-center leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Extended Features */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: Users,
                title: "Peer Circles",
                description: "Anonymous support groups for safe sharing",
                gradient: "from-pink-500 to-rose-500"
              },
              {
                icon: Trophy,
                title: "Wellness Challenges",
                description: "Gamified self-care with streaks & badges",
                gradient: "from-orange-500 to-yellow-500"
              },
              {
                icon: Leaf,
                title: "Relaxation Tools",
                description: "Breathing exercises, sounds & grounding",
                gradient: "from-green-500 to-teal-500"
              },
              {
                icon: Shield,
                title: "Crisis Support",
                description: "Immediate hotline access & safety resources",
                gradient: "from-red-500 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -3, scale: 1.02 }}
              >
                <Card className="p-6 rounded-2xl border-0 shadow-lg bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-3 mb-4 mx-auto`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <h4 className="font-semibold mb-2 text-center">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm text-center">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* NEW Advanced Features */}
          <div className="text-center mb-8 mt-16">
            <Badge className="bg-gradient-to-r from-rose-500 to-violet-500 text-white px-4 py-1 text-sm mb-4">
              ✨ New Advanced Features
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Daily Gratitude Wall",
                description: "Share gratitude & spread positivity",
                gradient: "from-rose-500 to-pink-500",
                badge: "Community"
              },
              {
                icon: Star,
                title: "Mood Buddy Avatar",
                description: "Your personal companion that changes with mood",
                gradient: "from-purple-500 to-violet-500",
                badge: "Interactive"
              },
              {
                icon: Moon,
                title: "Sleep Companion",
                description: "Relaxing sounds & bedtime stories",
                gradient: "from-indigo-500 to-purple-500",
                badge: "Wellness"
              },
              {
                icon: Sparkles,
                title: "AI Recommendations",
                description: "Personalized books, movies & music",
                gradient: "from-violet-500 to-indigo-500",  
                badge: "Smart"
              }
            ].map((feature, index) => (
              <motion.div
                key={`new-${index}`}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.6 }}
                whileHover={{ y: -3, scale: 1.02 }}
              >
                <Card className="p-6 rounded-2xl border-0 shadow-lg bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 h-full relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-3 mb-4 mx-auto`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <Badge className="absolute top-3 right-3 bg-rose-500 text-white text-xs">
                    {feature.badge}
                  </Badge>
                  <h4 className="font-semibold mb-2 text-center">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm text-center">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Privacy & Safety */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16"
          >
            <Card className="p-8 rounded-3xl bg-gradient-to-r from-violet-900/50 to-blue-900/50 border-violet-700">
              <div className="text-center">
                <div className="flex justify-center space-x-8 mb-6">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-6 h-6 text-violet-400" />
                    <span className="font-medium text-violet-300">Anonymous & Secure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-6 h-6 text-pink-400" />
                    <span className="font-medium text-pink-300">Youth-Focused</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-6 h-6 text-amber-400" />
                    <span className="font-medium text-amber-300">Multi-Language</span>
                  </div>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Designed specifically for young people, with complete privacy protection and crisis support built-in. 
                  Available in multiple languages with emoji-rich communication.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              See MindMate in Action
            </h2>
            <p className="text-lg text-muted-foreground">Quick previews of our core features</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Try AI Chat",
                description: "Experience our empathetic AI companion",
                icon: MessageSquare,
                gradient: "from-blue-500 to-cyan-500",
                action: () => onAuthClick()
              },
              {
                title: "Voice Journal",
                description: "Record and analyze your emotions",
                icon: Mic,
                gradient: "from-purple-500 to-violet-500",
                action: () => onAuthClick()
              },
              {
                title: "Breathing Exercise",
                description: "Try our calming 4-4-6-2 technique",
                icon: Leaf,
                gradient: "from-green-500 to-teal-500",
                action: () => onAuthClick()
              }
            ].map((demo, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card 
                  className="p-8 rounded-3xl border-0 shadow-xl bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 cursor-pointer h-full"
                  onClick={demo.action}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${demo.gradient} p-4 mb-6 mx-auto`}>
                    <demo.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">{demo.title}</h3>
                  <p className="text-muted-foreground text-center mb-6">{demo.description}</p>
                  <div className="text-center">
                    <Button className={`bg-gradient-to-r ${demo.gradient} text-white rounded-2xl`}>
                      <Play className="w-4 h-4 mr-2" />
                      Try Now
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div 
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 rounded-3xl p-12 text-center shadow-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🌟
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-white">
              Ready to Bloom Into Your Best Self?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of young people who have found support, growth, and empowerment through Bloomly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  onClick={onAuthClick}
                  className="bg-white text-violet-600 rounded-2xl px-8 py-6 hover:bg-white/90 shadow-lg font-medium"
                >
                  <User className="w-5 h-5 mr-2" />
                  Start Free Today
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onPageChange('/stories')}
                  className="border-2 border-white text-white hover:bg-white/10 rounded-2xl px-8 py-6"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Read Success Stories
                </Button>
              </motion.div>
            </div>
            <p className="text-white/70 text-sm mt-6">
              Anonymous • Secure • Available 24/7 • No credit card required
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
