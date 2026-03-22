import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, UserCheck, QrCode, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (session: any) => void;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [nickname, setNickname] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [loginMethod, setLoginMethod] = useState<'guest' | 'qr' | null>(null);

  const languages = [
    { code: 'en', name: 'English', emoji: '🇺🇸' },
    { code: 'es', name: 'Español', emoji: '🇪🇸' },
    { code: 'fr', name: 'Français', emoji: '🇫🇷' },
    { code: 'de', name: 'Deutsch', emoji: '🇩🇪' },
    { code: 'pt', name: 'Português', emoji: '🇧🇷' },
    { code: 'zh', name: '中文', emoji: '🇨🇳' },
    { code: 'ja', name: '日本語', emoji: '🇯🇵' },
    { code: 'ko', name: '한국어', emoji: '🇰🇷' },
    { code: 'ar', name: 'العربية', emoji: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', emoji: '🇮🇳' },
  ];

  const generateQRLogin = () => {
    const sessionId = Math.random().toString(36).substring(2, 15);
    const guestSession = {
      id: sessionId,
      type: 'qr_guest',
      nickname: `Guest_${sessionId.slice(0, 6)}`,
      language: selectedLanguage,
      joinedAt: new Date().toISOString(),
      anonymous: true
    };
    onLogin(guestSession);
  };

  const handleGuestLogin = () => {
    if (!nickname.trim()) return;
    
    const guestSession = {
      id: Math.random().toString(36).substring(2, 15),
      type: 'guest',
      nickname: nickname.trim(),
      language: selectedLanguage,
      joinedAt: new Date().toISOString(),
      anonymous: true
    };
    
    onLogin(guestSession);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => loginMethod ? setLoginMethod(null) : null}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700 shadow-2xl max-w-md w-full p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center"
                >
                  <span className="text-2xl">🌟</span>
                </motion.div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  Welcome to Bloomly
                </h2>
                <p className="text-muted-foreground">Choose how you'd like to connect</p>
              </div>

              {!loginMethod ? (
                /* Login Method Selection */
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setLoginMethod('guest')}
                    className="w-full p-4 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 text-white flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all"
                  >
                    <UserCheck className="w-5 h-5" />
                    <span>Continue as Guest</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setLoginMethod('qr')}
                    className="w-full p-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all"
                  >
                    <QrCode className="w-5 h-5" />
                    <span>Quick QR Access</span>
                  </motion.button>

                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      Anonymous & secure • No personal data required
                    </p>
                  </div>
                </div>
              ) : loginMethod === 'guest' ? (
                /* Guest Login Form */
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <button
                    onClick={() => setLoginMethod(null)}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    ← Back
                  </button>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Choose a nickname
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., StarryNight, CozyVibes..."
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="bg-slate-800/50 border-slate-600 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Globe className="w-4 h-4 inline mr-1" />
                        Language
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => setSelectedLanguage(lang.code)}
                            className={`p-2 rounded-lg text-sm flex items-center space-x-2 transition-all ${
                              selectedLanguage === lang.code
                                ? 'bg-violet-900/50 border-violet-500 border-2 text-white'
                                : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 text-gray-300'
                            }`}
                          >
                            <span>{lang.emoji}</span>
                            <span className="truncate">{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleGuestLogin}
                      disabled={!nickname.trim()}
                      className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white rounded-xl py-3"
                    >
                      Start Your Journey ✨
                    </Button>
                  </div>
                </motion.div>
              ) : (
                /* QR Login */
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <button
                    onClick={() => setLoginMethod(null)}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    ← Back
                  </button>

                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200">Quick Access</h3>
                      <p className="text-sm text-gray-400">
                        Instant anonymous access with a randomly generated secure ID
                      </p>
                    </div>

                    <Button
                      onClick={generateQRLogin}
                      className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl py-3"
                    >
                      Generate Access Code 🚀
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Privacy Notice */}
              <div className="text-center pt-4 border-t border-slate-700">
                <p className="text-xs text-gray-500">
                  🔒 Your privacy is our priority. All sessions are anonymous and secure.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
