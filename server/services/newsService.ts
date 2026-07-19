const NEWS_API_URL = 'https://news-api.jona-581.workers.dev/';

export interface NewsArticle {
  heading: string;
  content: string;
}

// Returns null rather than throwing so a report can still be built from the
// financials alone when the news API is unavailable.
export const getLatestArticle = async (
  companyId: string
): Promise<NewsArticle | null> => {
  try {
    const res = await fetch(
      `${NEWS_API_URL}?id=${encodeURIComponent(companyId)}`
    );

    if (!res.ok) {
      console.error(`News API responded with ${res.status} for ${companyId}`);
      return null;
    }

    const article = (await res.json()) as Partial<NewsArticle>;

    if (!article?.heading || !article?.content) {
      console.error(`News API returned an unexpected shape for ${companyId}`);
      return null;
    }

    return { heading: article.heading, content: article.content };
  } catch (error) {
    console.error(`Failed to fetch news for ${companyId}:`, error);
    return null;
  }
};
