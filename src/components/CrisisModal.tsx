'use client';
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Phone, MessageSquare, MapPin, Heart, AlertTriangle, Clock, User, Shield, Wind, Focus } from "lucide-react";
import { useState, useEffect } from "react";

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  const [activeView, setActiveView] = useState<'main' | 'breathing' | 'grounding'>('main');
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [groundingStep, setGroundingStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathingActive) {
      let phase = 0; // 0: inhale, 1: hold, 2: exhale, 3: pause
      const phaseDurations = [4, 4, 6, 2]; // seconds for each phase
      const phaseNames: ('inhale' | 'hold' | 'exhale' | 'pause')[] = ['inhale', 'hold', 'exhale', 'pause'];
      
      let phaseTimer = 0;
      
      interval = setInterval(() => {
        phaseTimer++;
        
        if (phaseTimer >= phaseDurations[phase]) {
          phase = (phase + 1) % 4;
          phaseTimer = 0;
          setBreathingPhase(phaseNames[phase]);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathingActive]);

  const groundingSteps = [
    "Name 5 things you can see around you right now",
    "Name 4 things you can touch or feel",
    "Name 3 things you can hear right now",
    "Name 2 things you can smell",
    "Name 1 thing you can taste"
  ];

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
  const emergencyContacts = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support • Free & confidential",
      icon: Phone,
      badge: "24/7",
      color: "from-red-500 to-pink-500"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Text-based crisis support • Anonymous",
      icon: MessageSquare,
      badge: "Text",
      color: "from-blue-500 to-indigo-500"
    },
    {
      name: "LGBTQ+ National Hotline",
      number: "1-800-246-7743",
      description: "Specialized support for LGBTQ+ youth",
      icon: Heart,
      badge: "LGBTQ+",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "National Child Abuse Hotline",
      number: "1-800-4-A-CHILD",
      description: "Support for child abuse situations",
      icon: Shield,
      badge: "Youth",
      color: "from-green-500 to-teal-500"
    },
    {
      name: "Emergency Services",
      number: "911",
      description: "Immediate emergency help",
      icon: AlertTriangle,
      badge: "Emergency",
      color: "from-orange-500 to-red-500"
    }
  ];

  const calmingResources = [
    {
      title: "Breathing Exercise",
      description: "4-4-6-2 breathing technique for immediate calm",
      action: "Try Now",
      icon: Wind,
      onClick: () => setActiveView('breathing')
    },
    {
      title: "Grounding Technique",
      description: "5-4-3-2-1 sensory grounding method",
      action: "Start",
      icon: Focus,
      onClick: () => setActiveView('grounding')
    },
    {
      title: "Safe Space Visualization",
      description: "Guided imagery for mental refuge",
      action: "Begin",
      icon: Heart,
      onClick: () => alert('Opening guided visualization...')
    }
  ];

  if (activeView === 'breathing') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-0">
          <div className="p-8 text-center space-y-6 bg-background">
            <Button
              onClick={() => setActiveView('main')}
              variant="ghost"
              className="absolute top-4 left-4 text-muted-foreground"
            >
              ← Back
            </Button>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Emergency Breathing</h2>
              <p className="text-muted-foreground">Focus on your breath to find calm</p>
            </div>

            <motion.div
              animate={{
                scale: getBreathingCircleScale(),
                opacity: isBreathingActive ? [0.6, 1, 0.6] : 0.8
              }}
              transition={{
                duration: breathingPhase === 'inhale' ? 4 : 
                          breathingPhase === 'hold' ? 4 :
                          breathingPhase === 'exhale' ? 6 : 2,
                ease: "easeInOut",
                opacity: { duration: 2, repeat: isBreathingActive ? Infinity : 0 }
              }}
              className="w-48 h-48 mx-auto rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 backdrop-blur border border-white/30 flex items-center justify-center shadow-xl"
            >
              <Wind className="w-12 h-12 text-blue-400" />
            </motion.div>

            <motion.p
              key={breathingPhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-medium text-foreground"
            >
              {getBreathingInstruction()}
            </motion.p>

            <div className="space-y-3">
              {!isBreathingActive ? (
                <Button
                  onClick={() => setIsBreathingActive(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-2xl"
                >
                  Start Breathing Exercise
                </Button>
              ) : (
                <Button
                  onClick={() => setIsBreathingActive(false)}
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-900/50 px-8 py-3 rounded-2xl"
                >
                  Stop Exercise
                </Button>
              )}
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-4 text-left space-y-2">
              <h3 className="font-semibold text-foreground">How it works:</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Inhale for 4 seconds</div>
                <div>• Hold for 4 seconds</div>
                <div>• Exhale for 6 seconds</div>
                <div>• Pause for 2 seconds</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (activeView === 'grounding') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-0">
          <div className="p-8 text-center space-y-6 bg-background">
            <Button
              onClick={() => setActiveView('main')}
              variant="ghost"
              className="absolute top-4 left-4 text-muted-foreground"
            >
              ← Back
            </Button>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Grounding Exercise</h2>
              <p className="text-muted-foreground">Ground yourself in the present moment</p>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((groundingStep + 1) / groundingSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <motion.div
              key={groundingStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-2xl p-6">
                <div className="text-4xl mb-4">{5 - groundingStep}</div>
                <p className="text-lg">{groundingSteps[groundingStep]}</p>
              </div>

              {groundingStep < groundingSteps.length - 1 ? (
                <Button
                  onClick={() => setGroundingStep(prev => prev + 1)}
                  className="bg-white text-emerald-600 hover:bg-gray-200 px-8 py-3 rounded-2xl shadow-lg"
                >
                  Next Step →
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-800/50 rounded-2xl p-4">
                    <p className="text-foreground font-medium">Great job! 🌟</p>
                    <p className="text-muted-foreground text-sm mt-1">You've completed the grounding exercise. How do you feel now?</p>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={() => setGroundingStep(0)}
                      className="bg-white text-emerald-600 hover:bg-gray-200 px-6 py-2 rounded-2xl mr-2"
                    >
                      Start Over
                    </Button>
                    <Button
                      onClick={() => setActiveView('main')}
                      variant="outline"
                      className="border-emerald-500 text-emerald-400 hover:bg-emerald-900/50 px-6 py-2 rounded-2xl"
                    >
                      Back to Support
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-0">
        <div 
          className="p-6 text-white rounded-t-3xl"
          style={{
            background: 'linear-gradient(135deg, #FF6B9D 0%, #C8B6FF 100%)',
          }}
        >
          <DialogHeader>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center"
              >
                <Heart className="w-8 h-8" />
              </motion.div>
              <DialogTitle className="text-2xl font-semibold">
                You're Not Alone
              </DialogTitle>
              <p className="text-lg mt-2 text-white/90">
                We're here to help you through this difficult moment
              </p>
            </motion.div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Immediate Coping Strategies */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-violet-400" />
              Right Now, Try This
            </h3>
            <div className="grid gap-3">
              {calmingResources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card 
                    className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-700 cursor-pointer hover:shadow-lg transition-all"
                    onClick={resource.onClick}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                          <resource.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{resource.title}</h4>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl"
                      >
                        {resource.action}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-red-400" />
              Crisis Support Hotlines
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {emergencyContacts.map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: (index + 3) * 0.1 }}
                >
                  <Card className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${contact.color} flex items-center justify-center`}>
                          <contact.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-foreground text-sm truncate">{contact.name}</h4>
                            <Badge variant="outline" className="text-xs">{contact.badge}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{contact.description}</p>
                        </div>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          size="sm"
                          className={`bg-gradient-to-r ${contact.color} text-white rounded-xl text-xs px-3 py-1`}
                          onClick={() => {
                            if (contact.number.includes('741741')) {
                              window.open('sms:741741?body=HOME');
                            } else if (contact.number.includes('Text')) {
                              window.open('sms:741741?body=HOME');
                            } else {
                              window.open(`tel:${contact.number.replace(/\D/g, '')}`);
                            }
                          }}
                        >
                          {contact.number.includes('Text') ? 'Text' : 'Call'}
                        </Button>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>



          {/* Safety Reminder */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-violet-900/50 to-pink-900/50 rounded-2xl p-6 text-center border border-violet-700"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl mb-2"
            >
              💜
            </motion.div>
            <h4 className="font-semibold mb-2 text-violet-300">You Matter</h4>
            <p className="text-violet-400 leading-relaxed text-sm">
              This feeling is temporary. You are valuable and loved. 
              There are people who want to help you through this difficult time.
            </p>
          </motion.div>

          {/* Quick Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-2 gap-3"
          >
            <Button
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl py-3 font-medium"
              onClick={() => window.open('tel:988')}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call 988
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl py-3 font-medium"
              onClick={() => window.open('sms:741741?body=HOME')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Text Crisis Line
            </Button>
          </motion.div>

          {/* Additional Support */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              variant="outline"
              className="flex-1 rounded-2xl py-2 border-violet-700 text-violet-400 hover:bg-violet-900/50"
              onClick={() => setActiveView('breathing')}
            >
              <Wind className="w-4 h-4 mr-2" />
              Quick Breathing
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-2xl py-2 border-emerald-700 text-emerald-400 hover:bg-emerald-900/50"
              onClick={() => setActiveView('grounding')}
            >
              <Focus className="w-4 h-4 mr-2" />
              Grounding Exercise
            </Button>
          </motion.div>

          {/* Continue Support */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center space-y-3"
          >
            <Button
              variant="outline"
              className="rounded-2xl px-8 py-2 border-slate-700 text-muted-foreground hover:bg-slate-800"
              onClick={onClose}
            >
              Continue with Bloomly Support
            </Button>
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Available 24/7
              </div>
              <div className="flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                Confidential
              </div>
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                Location services available
              </div>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
