import { NextResponse } from 'next/server';
import { JobPosting, CITIES } from '@/lib/data';
import { getSession } from '@/lib/session';

// Helper to determine language based on country
const getLanguage = (city: string) => {
  if (CITIES.KR.includes(city)) return 'Korean';
  if (CITIES.JP.includes(city)) return 'Japanese';
  if (CITIES.US.includes(city)) return 'English';
  return 'English';
};

// Mock data generator
const generateMockJobs = (city: string): JobPosting[] => {
  const language = getLanguage(city);
  const count = Math.floor(Math.random() * 5) + 3; // 3 to 7 jobs per city
  
  const jobs: JobPosting[] = [];
  
  for (let i = 0; i < count; i++) {
    jobs.push({
      id: `${city}-${i}-${Date.now()}`,
      title: language === 'Korean' ? `수석 소프트웨어 엔지니어 - ${i + 1}` : 
             language === 'Japanese' ? `シニアソフトウェアエンジニア - ${i + 1}` : 
             `Senior Software Engineer - ${i + 1}`,
      company: `Tech Corp ${city} ${String.fromCharCode(65 + i)}`,
      location: city,
      language: language,
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
      description: language === 'Korean' ? `${city}에서 혁신적인 프로젝트를 이끌어갈 뛰어난 엔지니어를 찾고 있습니다. 최신 기술 스택을 활용하여 확장 가능하고 안정적인 시스템을 설계 및 구축하게 됩니다.` :
                   language === 'Japanese' ? `${city}で革新的なプロジェクトをリードする優秀なエンジニアを探しています。最新の技術スタックを活用して、スケーラブルで安定したシステムを設計・構築します。` :
                   `We are looking for an exceptional engineer to lead innovative projects in ${city}. You will design and build scalable and reliable systems using the latest tech stack.`
    });
  }
  
  return jobs;
};

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { cities } = await request.json();
    
    if (!cities || !Array.isArray(cities)) {
      return NextResponse.json({ error: 'Invalid cities parameter' }, { status: 400 });
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let allJobs: JobPosting[] = [];
    
    cities.forEach(city => {
      allJobs = [...allJobs, ...generateMockJobs(city)];
    });

    // Sort by date descending
    allJobs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ jobs: allJobs });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
