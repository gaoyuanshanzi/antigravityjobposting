export const COUNTRIES = [
  { id: 'KR', name: 'South Korea' },
  { id: 'JP', name: 'Japan' },
  { id: 'US', name: 'United States' },
];

export const CITIES: Record<string, string[]> = {
  KR: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Changwon', 'Goyang'],
  JP: ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Saitama'],
  US: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
};

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  language: string;
  date: string;
}
