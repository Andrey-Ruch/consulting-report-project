import { getCompanyFinancials } from './salesforceService';
import { getLatestArticle } from './newsService';
import { generateMarkdown } from './geminiService';
import { buildPrompt } from './promptBuilder';

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

  return generateMarkdown(prompt);
};
