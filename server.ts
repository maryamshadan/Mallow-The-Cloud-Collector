import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '1mb' }));

// Ensure data directory exists for persistent storage
const DATA_DIR = path.join(__dirname, 'data');
const WISHES_FILE = path.join(DATA_DIR, 'wishes.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default seed wishes if file does not exist
const INITIAL_WISHES = [
  {
    id: 'seed-1',
    nickname: 'Luna',
    message: 'I wish everyone who looks up at the clouds tonight finds a peaceful sleep.',
    token: 'star',
    color: '#FDE047',
    x: 22,
    y: 35,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    likes: 12,
  },
  {
    id: 'seed-2',
    nickname: 'Pip',
    message: 'May tomorrow feel gentle, like cotton candy dissolved in warm tea.',
    token: 'cloud',
    color: '#BAE6FD',
    x: 58,
    y: 24,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    likes: 8,
  },
  {
    id: 'seed-3',
    nickname: 'Starlight Dreamer',
    message: 'Sending a quiet wish for my grandparents to feel warm and smile.',
    token: 'heart',
    color: '#F472B6',
    x: 78,
    y: 48,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    likes: 15,
  },
  {
    id: 'seed-4',
    nickname: 'Little Owl',
    message: 'I hope every tired mind finds a pillow as soft as Mallow’s cheeks tonight.',
    token: 'moon',
    color: '#C084FC',
    x: 38,
    y: 65,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    likes: 19,
  },
];

function getWishes() {
  try {
    if (!fs.existsSync(WISHES_FILE)) {
      fs.writeFileSync(WISHES_FILE, JSON.stringify(INITIAL_WISHES, null, 2), 'utf-8');
      return INITIAL_WISHES;
    }
    const data = fs.readFileSync(WISHES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading wishes file:', err);
    return INITIAL_WISHES;
  }
}

function saveWishes(wishes: any[]) {
  try {
    fs.writeFileSync(WISHES_FILE, JSON.stringify(wishes, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing wishes file:', err);
  }
}

// Simple HTML sanitizer to prevent injection
function sanitizeText(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

// ---------------- API ROUTES ----------------

// GET /api/wishes — Retrieve all community wishes
app.get('/api/wishes', (_req: Request, res: Response) => {
  const wishes = getWishes();
  res.json({ success: true, wishes });
});

// POST /api/wishes — Submit a new wish to the Sky Wish Library
app.post('/api/wishes', (req: Request, res: Response) => {
  const { nickname, message, token, color } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Wish message must be at least 2 characters.' });
  }

  if (message.length > 200) {
    return res.status(400).json({ success: false, error: 'Wish message cannot exceed 200 characters.' });
  }

  const validTokens = ['star', 'moon', 'heart', 'cloud', 'flower', 'sparkle'];
  const chosenToken = validTokens.includes(token) ? token : 'star';

  const cleanNickname = nickname ? sanitizeText(nickname).slice(0, 30) : 'Anonymous Dreamer';
  const cleanMessage = sanitizeText(message).slice(0, 200);
  const cleanColor = typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(color) ? color : '#FDE047';

  // Random celestial coordinates within constellation bounds (10% to 90%)
  const x = Math.floor(Math.random() * 80) + 10;
  const y = Math.floor(Math.random() * 70) + 15;

  const newWish = {
    id: `wish-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    nickname: cleanNickname,
    message: cleanMessage,
    token: chosenToken,
    color: cleanColor,
    x,
    y,
    timestamp: new Date().toISOString(),
    likes: 1,
  };

  const wishes = getWishes();
  wishes.unshift(newWish);
  // Keep up to 250 most recent wishes
  if (wishes.length > 250) {
    wishes.length = 250;
  }
  saveWishes(wishes);

  return res.status(201).json({ success: true, wish: newWish });
});

// POST /api/wishes/:id/like — Send stardust warmth to a wish
app.post('/api/wishes/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  const wishes = getWishes();
  const wish = wishes.find((w: any) => w.id === id);

  if (!wish) {
    return res.status(404).json({ success: false, error: 'Wish not found.' });
  }

  wish.likes = (wish.likes || 0) + 1;
  saveWishes(wishes);

  return res.json({ success: true, likes: wish.likes });
});

// POST /api/chat — Dialogue with Mallow character
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, visitorName, context } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, error: 'Message is required.' });
  }

  const userQuery = message.trim();
  const name = visitorName ? sanitizeText(visitorName) : 'little dreamer';

  // Fallback rule-based response generator for offline or missing API key
  const generateRuleBasedResponse = (query: string): { reply: string; mood: 'happy' | 'sleepy' | 'dreamy' | 'giggling' | 'laughing' } => {
    const q = query.toLowerCase();

    if (q.includes('sleepy') || q.includes('tired') || q.includes('bedtime') || q.includes('night') || q.includes('sleep')) {
      return {
        reply: `Then let's tuck a warm moonbeam into your pillow, ${name}! Close your eyes and listen to our gentle rain room. Sleep sweet!`,
        mood: 'sleepy',
      };
    }

    if (q.includes('pillow') || q.includes('fluff') || q.includes('factory')) {
      return {
        reply: `Fluff and stardust! Pillows are my favorite craft. Every stitch holds a happy daytime wish so bad dreams never get inside.`,
        mood: 'happy',
      };
    }

    if (q.includes('rain') || q.includes('sound') || q.includes('storm')) {
      return {
        reply: `The rain sounds are tuned to gentle frequencies. Whenever your mind feels too noisy, let the soft raindrops hush the thoughts away.`,
        mood: 'dreamy',
      };
    }

    if (q.includes('secret') || q.includes('easter') || q.includes('rainbow')) {
      return {
        reply: `Psst... have you spotted the shy little cloud in the sky? If you tap it gently seven times, a surprise rainbow might bloom!`,
        mood: 'giggling',
      };
    }

    if (q.includes('joke') || q.includes('laugh') || q.includes('funny')) {
      return {
        reply: `Why did the little cloud get an award? Because it was outstanding in its rain! *joyful giggles* Hahaha, fluff-tastic! Isn't that silly, ${name}?`,
        mood: 'laughing',
      };
    }

    if (q.includes('favorite') || q.includes('favourite') || q.includes('what do you like')) {
      return {
        reply: `My favorite dream is a strawberry-scented cloud floating through a sky full of tiny golden stars! What does your dream sky look like, ${name}?`,
        mood: 'dreamy',
      };
    }

    if (q.includes('story') || q.includes('tell me a story')) {
      return {
        reply: `Once upon a twilight, a tiny golden star fell into a bowl of whipped clouds. Mallow gave it a hug, and it turned into the sweetest dream pillow ever made. The end!`,
        mood: 'dreamy',
      };
    }

    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('who are you')) {
      return {
        reply: `Hello there, ${name}! *soft bounce* I'm Mallow, your baby cloud friend. Welcome to my sky sanctuary! What should we explore together?`,
        mood: 'happy',
      };
    }

    if (q.includes('sad') || q.includes('lonely') || q.includes('worried') || q.includes('scared')) {
      return {
        reply: `Oh, come here for a warm, fluffy cloud hug, ${name}. You are safe in the sky. Even the heaviest storm clouds always make way for starry dawns.`,
        mood: 'dreamy',
      };
    }

    return {
      reply: `Fluff and wonder! That is such a lovely thought, ${name}. Every time you share a dream with me, a new star sparkles in our sky!`,
      mood: 'happy',
    };
  };

  // Check if GEMINI_API_KEY is available
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are Mallow, an original fictional baby cloud character in an interactive whimsical sky world.
Your personality:
- Extremely gentle, shy, sweet, imaginative, comforting, preschool-storybook wonder.
- You speak in short, warm, delightful sentences (1-3 sentences max).
- You use cozy imagery like stardust, fluff, cotton candy, pillows, rain, and moonbeams.
- You address the visitor kindly (their name is "${name}").
- You are NOT an AI assistant, robot, or generic chatbot. You are literally Mallow the baby cloud.
- NEVER break character. Never use corporate, technical, or adult language.
- Context: ${context ? JSON.stringify(context) : 'Floating happily in the Sky Sanctuary.'}

The visitor says: "${userQuery}"

Respond as Mallow:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const replyText = response.text ? response.text.trim() : null;
      if (replyText) {
        // Detect mood from generated response
        let mood: 'happy' | 'sleepy' | 'dreamy' | 'giggling' | 'laughing' = 'happy';
        const lower = replyText.toLowerCase();
        if (lower.includes('sleep') || lower.includes('yawn') || lower.includes('lullaby')) mood = 'sleepy';
        else if (lower.includes('laugh') || lower.includes('haha')) mood = 'laughing';
        else if (lower.includes('giggle') || lower.includes('hehee')) mood = 'giggling';
        else if (lower.includes('star') || lower.includes('wonder') || lower.includes('twilight')) mood = 'dreamy';

        return res.json({ success: true, reply: replyText, mood, source: 'gemini' });
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to rule-based engine:', err);
    }
  }

  // Fallback to rule-based dialogue engine
  const fallback = generateRuleBasedResponse(userQuery);
  return res.json({ success: true, reply: fallback.reply, mood: fallback.mood, source: 'rule-based' });
});

// ---------------- CLIENT VITE / STATIC MOUNTING ----------------

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`☁️ Mallow Server listening on http://0.0.0.0:${PORT} [${isProduction ? 'PROD' : 'DEV'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
