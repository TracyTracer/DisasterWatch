
import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-safety-tips.ts';
import '@/ai/flows/disaster-info.ts';
import '@/ai/flows/assess-disaster-severity.ts';
import '@/ai/flows/locate-resources-flow.ts'; // New flow import
