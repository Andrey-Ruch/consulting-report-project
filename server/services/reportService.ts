import { getCompanyFinancials, CompanyFinancials } from './salesforceService';
import { getLatestArticle, NewsArticle } from './newsService';

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

  // Scaffolding: renders the raw source data so steps 1-2 are verifiable in the UI.
  return (
    `# ${companyName} — Investment Report\n` +
    `**${companyId}**: *${reportType}*\n\n` +
    `## Sales & Profit Snapshot\n\n${formatFinancialsTable(financials)}\n\n` +
    `## Latest News\n\n${formatArticle(article)}`
  );
};
