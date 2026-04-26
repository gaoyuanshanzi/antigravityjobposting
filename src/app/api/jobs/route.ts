import { NextResponse } from 'next/server';
import { JobPosting, CITIES } from '@/lib/data';
import { getSession } from '@/lib/session';
import { GoogleGenAI } from '@google/genai';

// Helper to determine language based on country
const getLanguage = (city: string) => {
  if (CITIES.KR.includes(city)) return 'Korean';
  if (CITIES.JP.includes(city)) return 'Japanese';
  if (CITIES.US.includes(city)) return 'English';
  return 'English';
};

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { cities, apiKey } = await request.json();
    
    if (!cities || !Array.isArray(cities)) {
      return NextResponse.json({ error: 'Invalid cities parameter' }, { status: 400 });
    }
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key is required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Process cities in parallel using Promise.all to be faster
    const promises = cities.map(async (city) => {
      const language = getLanguage(city);
      const prompt = `
        You are a job posting aggregator. I need you to find or generate realistic, up-to-date job postings for the city of ${city}.
        Please provide exactly 3 realistic job postings in ${language}.
        
        The response MUST be a valid JSON array of objects.
        Each object MUST match this interface precisely:
        {
          "id": string (unique identifier like "${city}-1"),
          "title": string,
          "company": string,
          "location": string (MUST be ${city}),
          "description": string (3-4 sentences detailing role),
          "language": string (MUST be ${language}),
          "date": string (ISO format YYYY-MM-DD, e.g. "2023-10-25")
        }
        
        ONLY return the JSON array. Do not include markdown code blocks like \`\`\`json. Just the raw JSON string.
      `;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            temperature: 0.7,
            responseMimeType: "application/json",
          }
        });

        const text = response.text || "[]";
        // Attempt to parse JSON. We requested raw JSON.
        const parsed = JSON.parse(text) as JobPosting[];
        return parsed;
      } catch (err) {
        console.error(`Failed to generate jobs for ${city}`, err);
        return [];
      }
    });

    const results = await Promise.all(promises);
    let allJobs: JobPosting[] = results.flat();

    // Sort by date descending
    allJobs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ jobs: allJobs });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
