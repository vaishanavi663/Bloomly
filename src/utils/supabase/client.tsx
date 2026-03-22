import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseKey = publicAnonKey;

export const supabase = createClient(supabaseUrl, supabaseKey);

// API helper functions
export const api = {
  // Chat functions
  saveMessage: async (message: any) => {
    const response = await fetch(`${supabaseUrl}/functions/v1/make-server-ce746ba3/chat/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify(message)
    });
    return response.json();
  },

  getChatHistory: async (userId?: string) => {
    const url = userId 
      ? `${supabaseUrl}/functions/v1/make-server-ce746ba3/chat/history?userId=${userId}`
      : `${supabaseUrl}/functions/v1/make-server-ce746ba3/chat/history`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    return response.json();
  },

  // Mood tracking functions
  saveMoodEntry: async (moodData: any) => {
    const response = await fetch(`${supabaseUrl}/functions/v1/make-server-ce746ba3/mood/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify(moodData)
    });
    return response.json();
  },

  getMoodHistory: async (userId?: string, days = 7) => {
    const url = userId 
      ? `${supabaseUrl}/functions/v1/make-server-ce746ba3/mood/history?userId=${userId}&days=${days}`
      : `${supabaseUrl}/functions/v1/make-server-ce746ba3/mood/history?days=${days}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    return response.json();
  },

  // Stories functions
  getStories: async () => {
    const response = await fetch(`${supabaseUrl}/functions/v1/make-server-ce746ba3/stories`, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    return response.json();
  },

  likeStory: async (storyId: string, userId?: string) => {
    const response = await fetch(`${supabaseUrl}/functions/v1/make-server-ce746ba3/stories/${storyId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ userId })
    });
    return response.json();
  },

  // Analytics functions
  getAnalytics: async () => {
    const response = await fetch(`${supabaseUrl}/functions/v1/make-server-ce746ba3/analytics`, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    return response.json();
  },

  // Crisis intervention logging
  logCrisisIntervention: async (data: any) => {
    const response = await fetch(`${supabaseUrl}/functions/v1/make-server-ce746ba3/crisis/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // User management
  createUser: async (userData: any) => {
    const response = await fetch(`${supabaseUrl}/functions/v1/make-server-ce746ba3/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  }
};