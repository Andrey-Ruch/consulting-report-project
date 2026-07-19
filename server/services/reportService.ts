import { getCompanyFinancials, CompanyFinancials } from './salesforceService';
import { getLatestArticle, NewsArticle } from './newsService';
import { generateMarkdown } from './geminiService';
import { buildPrompt } from './promptBuilder';
import { formatFinancialsTable, formatArticle } from './markdown';

// Shown when the LLM is unreachable (the free tier allows only 5 requests per
// minute, so this is a routine outcome rather than an edge case). No
// recommendation is offered - that needs the model - but the source data the
// report would have been built from is still worth seeing.
const buildFallbackReport = (
  companyName: string,
  financials: CompanyFinancials[],
  article: NewsArticle | null
): string =>
  `# ${companyName} — Investment Report\n\n` +
  `> ⚠️ AI analysis unavailable. Showing source data only.\n\n` +
  `## Sales & Profit Snapshot\n\n${formatFinancialsTable(financials)}\n\n` +
  `## Latest News\n\n${formatArticle(article)}`;

export const generateReportMarkdown = async (
  companyName: string,
  companyId: string,
  reportType: string
): Promise<string> => {
  const [financials, article] = await Promise.all([
    getCompanyFinancials(companyId),
    getLatestArticle(companyId),
  ]);

  const prompt = buildPrompt(companyName, financials, article, reportType);

  try {
    return await generateMarkdown(prompt);
  } catch (error) {
    console.error(`LLM report generation failed for ${companyId}:`, error);
    return buildFallbackReport(companyName, financials, article);
  }
};
