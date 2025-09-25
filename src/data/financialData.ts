import { CashAccount, Transaction, DREReport, CashFlowProjection } from '../types/financial';

export const mockCashAccounts: CashAccount[] = [
  {
    id: '1',
    name: 'Caixa Principal',
    type: 'cash',
    balance: 15000,
    currency: 'BRL',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-19T10:00:00Z'
  },
  {
    id: '2',
    name: 'Banco do Brasil - CC',
    type: 'bank',
    balance: 85000,
    currency: 'BRL',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-19T10:00:00Z'
  },
  {
    id: '3',
    name: 'Itaú - Poupança',
    type: 'bank',
    balance: 25000,
    currency: 'BRL',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-19T10:00:00Z'
  },
  {
    id: '4',
    name: 'CDB Banco Inter',
    type: 'investment',
    balance: 50000,
    currency: 'BRL',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-19T10:00:00Z'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    accountId: '2',
    type: 'income',
    category: 'Juros de Empréstimos',
    amount: 2500,
    description: 'Pagamento parcela empréstimo #001',
    date: '2024-12-19',
    reference: 'EMP001-P05',
    createdAt: '2024-12-19T10:00:00Z',
    updatedAt: '2024-12-19T10:00:00Z'
  },
  {
    id: '2',
    accountId: '2',
    type: 'expense',
    category: 'Despesas Administrativas',
    amount: 800,
    description: 'Aluguel escritório',
    date: '2024-12-18',
    createdAt: '2024-12-18T14:00:00Z',
    updatedAt: '2024-12-18T14:00:00Z'
  },
  {
    id: '3',
    accountId: '1',
    type: 'income',
    category: 'Multas por Atraso',
    amount: 150,
    description: 'Multa atraso parcela cliente João',
    date: '2024-12-17',
    createdAt: '2024-12-17T16:30:00Z',
    updatedAt: '2024-12-17T16:30:00Z'
  },
  {
    id: '4',
    accountId: '2',
    type: 'expense',
    category: 'Marketing e Publicidade',
    amount: 1200,
    description: 'Campanha Google Ads',
    date: '2024-12-16',
    createdAt: '2024-12-16T09:00:00Z',
    updatedAt: '2024-12-16T09:00:00Z'
  },
  {
    id: '5',
    accountId: '4',
    type: 'income',
    category: 'Rendimentos Financeiros',
    amount: 420,
    description: 'Rendimento CDB dezembro',
    date: '2024-12-15',
    createdAt: '2024-12-15T12:00:00Z',
    updatedAt: '2024-12-15T12:00:00Z'
  }
];

export const mockDREReport: DREReport = {
  period: '2024-12',
  revenue: {
    loanInterest: 45000,
    fees: 3500,
    other: 1200,
    total: 49700
  },
  costs: {
    defaultLosses: 2800,
    operationalCosts: 1500,
    total: 4300
  },
  expenses: {
    administrative: 8500,
    marketing: 4200,
    personnel: 12000,
    other: 2300,
    total: 27000
  },
  financialResult: {
    financialIncome: 1800,
    financialExpenses: 650,
    net: 1150
  },
  grossProfit: 45400,
  operationalProfit: 18400,
  netProfit: 19550,
  margins: {
    gross: 91.3,
    operational: 37.0,
    net: 39.3
  }
};

export const mockCashFlowProjection: CashFlowProjection[] = [
  {
    date: '2024-12-19',
    openingBalance: 175000,
    inflows: {
      loanPayments: 15000,
      newLoans: 0,
      other: 500,
      total: 15500
    },
    outflows: {
      newLoanDisbursements: 25000,
      operationalExpenses: 3500,
      taxes: 1200,
      other: 800,
      total: 30500
    },
    netFlow: -15000,
    closingBalance: 160000
  },
  {
    date: '2024-12-20',
    openingBalance: 160000,
    inflows: {
      loanPayments: 8500,
      newLoans: 15000,
      other: 200,
      total: 23700
    },
    outflows: {
      newLoanDisbursements: 15000,
      operationalExpenses: 1200,
      taxes: 0,
      other: 300,
      total: 16500
    },
    netFlow: 7200,
    closingBalance: 167200
  },
  {
    date: '2024-12-21',
    openingBalance: 167200,
    inflows: {
      loanPayments: 12000,
      newLoans: 10000,
      other: 800,
      total: 22800
    },
    outflows: {
      newLoanDisbursements: 10000,
      operationalExpenses: 2800,
      taxes: 500,
      other: 600,
      total: 13900
    },
    netFlow: 8900,
    closingBalance: 176100
  }
];