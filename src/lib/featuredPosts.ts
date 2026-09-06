// The knowledge articles shown on the home page. Kept in its own small module so
// the client bundle doesn't have to carry all 62 articles from lib/knowledge.
// Slug, title and excerpt mirror the article itself — update both if one changes.

export interface FeaturedPost {
  slug: string;
  category: string;
  categoryEn: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  minutes: number;
  image: string;
  imageAlt: string;
}

export const FEATURED_POSTS: FeaturedPost[] = [
  {
    slug: 'varfor-alltid-trott',
    category: 'Energi & trötthet',
    categoryEn: 'Energy & fatigue',
    title: 'Varför är jag alltid trött?',
    titleEn: 'Why am I always tired?',
    excerpt:
      'Ständigt trött trots att du sover? Här är de vanligaste orsakerna till kronisk trötthet — och vad du kan göra åt dem.',
    excerptEn:
      'Always tired even though you sleep? Here are the most common causes of chronic fatigue — and what you can do about them.',
    minutes: 5,
    image: '/assets/images/post-trotthet.jpg',
    imageAlt: 'Man i fjällandskap i gryningsljus',
  },
  {
    slug: 'naturligt-oka-testosteron',
    category: 'Testosteron & hormoner',
    categoryEn: 'Testosterone & hormones',
    title: 'Kan man öka testosteron naturligt?',
    titleEn: 'Can you raise testosterone naturally?',
    excerpt:
      'Så stöttar du en normal testosteronnivå naturligt — genom sömn, träning, vikt, kost och rätt näring som zink.',
    excerptEn:
      'How to support a normal testosterone level naturally — through sleep, training, weight, diet and nutrients like zinc.',
    minutes: 5,
    image: '/assets/images/post-testosteron.jpg',
    imageAlt: 'Man som tränar hårt i ett mörkt gym',
  },
];
