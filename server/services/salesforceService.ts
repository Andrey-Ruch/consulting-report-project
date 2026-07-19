import { SalesforceData } from '../models/index';

export interface CompanyFinancials {
  year: number;
  sales: number;
  profit: number;
}

// Postgres returns `numeric` columns as strings, so sales/profit need coercing
// before anything downstream tries to compare or format them as numbers.
export const getCompanyFinancials = async (
  companyId: string
): Promise<CompanyFinancials[]> => {
  const rows = await SalesforceData.findAll({
    where: { companyId },
    order: [['year', 'ASC']],
  });

  console.log('\n\nrows:\n', rows);

  return rows.map((row) => ({
    year: row.year,
    sales: Number(row.sales),
    profit: Number(row.profit),
  }));
};
