import { CompanyFinancials } from './salesforceService';
import { NewsArticle } from './newsService';

export const formatFinancialsTable = (
  financials: CompanyFinancials[]
): string => {
  if (financials.length === 0) return '_No financial data on record._';

  const rows = financials
    .map((f) => `| ${f.year} | ${f.sales} | ${f.profit} |`)
    .join('\n');

  return `| Year | Sales | Profit |\n| --- | --- | --- |\n${rows}`;
};

export const formatArticle = (article: NewsArticle | null): string => {
  if (!article) return '_No recent news available._';

  return `**${article.heading}**\n\n${article.content}`;
};
