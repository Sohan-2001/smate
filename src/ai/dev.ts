import { config } from 'dotenv';
config();

import '@/ai/flows/generate-text-from-prompt.ts';
import '@/ai/flows/summarize-selected-text.ts';
import '@/ai/flows/improve-writing-style.ts';
import '@/ai/flows/check-spelling.ts';
