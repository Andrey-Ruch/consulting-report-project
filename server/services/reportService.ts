import { getCompanyFinancials, CompanyFinancials } from './salesforceService';
import { getLatestArticle, NewsArticle } from './newsService';
import { generateMarkdown } from './geminiService';

const formatFinancialsTable = (financials: CompanyFinancials[]): string => {
  if (financials.length === 0) return '_No financial data on record._';

  const rows = financials
    .map((f) => `| ${f.year} | ${f.sales} | ${f.profit} |`)
    .join('\n');

  return `| Year | Sales | Profit |\n| --- | --- | --- |\n${rows}`;
};

const formatArticle = (article: NewsArticle | null): string => {
  if (!article) return '_No recent news available._';

  return `**${article.heading}**\n\n${article.content}`;
};

export const generateReportMarkdown = async (
  companyName: string,
  companyId: string,
  reportType: string
): Promise<string> => {
  const [financials, article] = await Promise.all([
    getCompanyFinancials(companyId),
    getLatestArticle(companyId),
  ]);

  // Scaffolding: proves the Gemini client works before any prompt design.
  const llmOutput = await generateMarkdown(
    'Reply with a markdown H1 saying Hello, and nothing else.'
  );

  return (
    `# ${companyName} — Investment Report\n` +
    `**${companyId}**: *${reportType}*\n\n` +
    `## Sales & Profit Snapshot\n\n${formatFinancialsTable(financials)}\n\n` +
    `## Latest News\n\n${formatArticle(article)}\n\n` +
    `## LLM Smoke Test\n\n${llmOutput}`
  );
};
