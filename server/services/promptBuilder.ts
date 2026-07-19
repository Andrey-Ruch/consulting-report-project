import { CompanyFinancials } from './salesforceService';
import { NewsArticle } from './newsService';
import { formatFinancialsTable, formatArticle } from './markdown';

const HIGH_LEVEL_INSTRUCTIONS = `Write one or two sentences: the single most
important signal, then your verdict. End with the verdict in bold - exactly one
of **Invest**, **Don't Invest**, or **Defer**. Use no headings, tables, or lists.`;

const detailedInstructions = (companyName: string): string => `Use exactly these
sections, in this order:

# ${companyName} — Investment Report

## Executive Summary
Two or three sentences covering the overall picture and where it leaves you.

## Sales & Profit Snapshot
A Markdown table of every year on record, then one or two sentences on the trend
(direction and pace of sales and profit, and whether profit is positive).

## News Analysis
Name the headline, then explain what it signals and how it interacts with the
financial trend - reinforcing it, contradicting it, or neither.

## Recommendation
Open with exactly one of **Invest**, **Don't Invest**, or **Defer** in bold on
its own line. Follow with a short justification and any key uncertainty a
decision-maker should know about.`;

export const buildPrompt = (
  companyName: string,
  financials: CompanyFinancials[],
  article: NewsArticle | null,
  reportType: string
): string => {
  const latestYear =
    financials.length > 0 ? financials[financials.length - 1].year : null;

  return `You are an investment consultant at a firm that evaluates companies for
potential investment. Write an investment report for ${companyName}.

# Source data

## Reported financials (internal database)
${formatFinancialsTable(financials)}

## Recent news article
${formatArticle(article)}

# How to reason

- The financials are historical${
    latestYear ? ` and end at ${latestYear}` : ''
  }; they are not current. Read them as a
  trend - the direction and pace of sales and profit - rather than as today's position.
- The news article is more recent than the financials. Where the two conflict, the news wins.
- Recent negative news outweighs a strong financial history: recommend "Don't Invest"
  or "Defer" even when sales and profit look healthy.
- Some articles are routine or promotional and carry little signal. Say so plainly
  rather than inflating them into a reason to act.
- If the article contains updated financial figures, prefer them over the database
  figures and note that you have done so.
- If data is missing, or the signals conflict without resolving, state the uncertainty
  and recommend "Defer".
- Use only the data above. Do not invent figures, events, sources, or currency units -
  the figures are unitless as supplied.

# Output

${
  reportType === 'detailed'
    ? detailedInstructions(companyName)
    : HIGH_LEVEL_INSTRUCTIONS
}

Return only the Markdown report itself - no preamble, no commentary about your
process, and no surrounding code fence.`;
};
