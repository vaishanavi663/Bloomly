
'use client';
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Home, MessageSquare, BookOpen, BarChart3, Users, 
  Trophy, Leaf, Mic, Calendar, User, Menu, X, Heart,
  Moon, Sparkles, MoreHorizontal
} from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { useAuthModal } from "@/app/context/app-context";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { userSession, setShowAuthModal } = useAuthModal();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, color: 'from-violet-500 to-indigo-500', href: '/' },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare, color: 'from-blue-500 to-cyan-500', href: '/chat' },
    { id: 'voice', label: 'Voice Journal', icon: Mic, color: 'from-purple-500 to-violet-500', href: '/voice' },
    { id: 'mood', label: 'Mood Tracker', icon: Calendar, color: 'from-teal-500 to-emerald-500', href: '/mood' },
    { id: 'circles', label: 'Peer Circles', icon: Users, color: 'from-pink-500 to-rose-500', href: '/circles' },
    { id: 'challenges', label: 'Challenges', icon: Trophy, color: 'from-orange-500 to-yellow-500', href: '/challenges' },
    { id: 'gratitude', label: 'Gratitude Wall', icon: Heart, color: 'from-rose-500 to-pink-500', badge: 'New', href: '/gratitude' },
    { id: 'sleep', label: 'Sleep Companion', icon: Moon, color: 'from-indigo-500 to-purple-500', badge: 'New', href: '/sleep' },
    { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles, color: 'from-violet-500 to-purple-500', badge: 'New', href: '/recommendations' },
    { id: 'relax', label: 'Relax', icon: Leaf, color: 'from-green-500 to-teal-500', href: '/relax' },
    { id: 'stories', label: 'Stories', icon: BookOpen, color: 'from-indigo-500 to-purple-500', href: '/stories' },
    { id: 'dashboard', label: 'Analytics', icon: BarChart3, color: 'from-slate-500 to-gray-500', href: '/dashboard' },
  ];

  const onPageChange = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  }

  const handleAuthClick = () => {
    setShowAuthModal(true);
  }

  const currentPage = navItems.find(item => item.href === pathname)?.id || 'home';

  const mobileNavItems = navItems.slice(0, 4); // First 4 items for bottom nav

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 bg-[length:200%_200%] animate-gradient shadow-lg hidden lg:block"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              onClick={() => onPageChange('/')}
              style={{ cursor: 'pointer' }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-violet-500 flex items-center justify-center"
              >
                <span className="text-white text-lg">🌸</span>
              </motion.div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">
                  Bloomly
                </span>
                <div className="text-xs text-gray-400 -mt-1">Youth Wellness Platform</div>
              </div>
            </motion.div>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.slice(0, 6).map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={currentPage === item.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onPageChange(item.href)}
                      className={`relative flex items-center space-x-2 rounded-2xl transition-all ${
                        currentPage === item.id
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{item.label}</span>
                      {item.badge && (
                        <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1 py-0">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </motion.div>
                );
              })}
              
              {/* More Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="rounded-2xl text-gray-300 hover:bg-white/10"
                >
                  <Menu className="w-4 h-4" />
                  <span className="ml-2 text-sm">More</span>
                </Button>
                
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-12 bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-2 min-w-48"
                  >
                    {navItems.slice(6).map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onPageChange(item.href);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full justify-start rounded-xl mb-1 ${
                            currentPage === item.id
                              ? `bg-gradient-to-r ${item.color} text-white`
                              : 'text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {item.label}
                        </Button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-3">
              {userSession ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {userSession.nickname?.charAt(0) || 'G'}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-white">{userSession.nickname}</div>
                    <div className="text-xs text-gray-400">{userSession.type === 'guest' ? 'Guest' : 'User'}</div>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleAuthClick}
                  size="sm"
                  className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-2xl px-4"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center space-x-3"
              onClick={() => onPageChange('/')}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-violet-500 flex items-center justify-center">
                <span className="text-white text-lg">🌸</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">
                Bloomly
              </span>
            </motion.div>
            {userSession ? (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userSession.nickname?.charAt(0) || 'G'}
                </span>
              </div>
            ) : (
              <Button
                onClick={handleAuthClick}
                size="sm"
                className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-2xl px-3"
              >
                <User className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-md border-t border-white/10 p-2">
        <div className="flex justify-around items-center">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onPageChange(item.href)}
                className={`flex flex-col items-center h-full rounded-lg p-1 transition-all ${
                  isActive ? 'text-violet-400' : 'text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
          <Button
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center h-full rounded-lg p-1 text-gray-400"
          >
            <MoreHorizontal className="w-5 h-5 mb-1" />
            <span className="text-xs">More</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile "More" Menu Sheet */}
      {isMobileMenuOpen && (
         <div className="lg:hidden fixed inset-0 z-50">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute inset-0 bg-black/60"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute bottom-0 left-0 right-0 bg-slate-800 rounded-t-3xl p-4 border-t border-white/10"
            >
              <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-4" />
              <div className="grid grid-cols-3 gap-4 text-center">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <motion.div key={item.id} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        onClick={() => onPageChange(item.href)}
                        className={`flex flex-col items-center justify-center w-full h-20 rounded-xl transition-colors ${
                          isActive ? 'bg-violet-500/20 text-violet-300' : 'text-gray-300'
                        }`}
                      >
                        <Icon className="w-6 h-6 mb-1" />
                        <span className="text-xs text-center">{item.label}</span>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
         </div>
      )}
    </>
  );
}
