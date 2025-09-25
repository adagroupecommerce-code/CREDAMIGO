import { Client, Loan, Payment, Dashboard } from '../types';

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    cpf: '123.456.789-00',
    email: 'joao@email.com',
    phone: '(11) 99999-0001',
    residentialAddress: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    workAddress: {
      company: 'Empresa ABC Ltda',
      street: 'Av. Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    documents: {
      selfie: 'selfie_joao.jpg',
      cnh: 'cnh_joao.jpg',
      proofOfResidence: 'comprovante_joao.pdf',
      payStub: 'holerite_joao.pdf',
      workCard: 'carteira_joao.jpg'
    },
    createdAt: '2024-01-15',
    status: 'active',
    creditScore: 750,
    creditRating: 'good',
    totalLoans: 2,
    activeLoans: 1,
    completedLoans: 1,
    defaultedLoans: 0,
    totalBorrowed: 25000,
    totalPaid: 15000,
    onTimePayments: 8,
    latePayments: 1,
    averagePaymentDelay: 2,
    observations: [
      {
        id: '1',
        content: 'Cliente muito pontual nos pagamentos. Sempre entra em contato quando há algum imprevisto.',
        createdAt: '2024-01-20T10:30:00Z',
        createdBy: 'Ana Gerente',
        type: 'payment',
        isImportant: true
      },
      {
        id: '2',
        content: 'Solicitou aumento do limite de crédito. Empresa em crescimento.',
        createdAt: '2024-02-15T14:20:00Z',
        createdBy: 'Carlos Analista',
        type: 'credit',
        isImportant: false
      }
    ]
  },
  {
    id: '2',
    name: 'Maria Santos',
    cpf: '987.654.321-00',
    email: 'maria@email.com',
    phone: '(11) 99999-0002',
    residentialAddress: {
      street: 'Av. Paulista',
      number: '456',
      complement: 'Apto 101',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    workAddress: {
      company: 'Consultoria XYZ',
      street: 'Rua Augusta',
      number: '789',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01305-000'
    },
    documents: {
      selfie: 'selfie_maria.jpg',
      cnh: 'cnh_maria.jpg',
      proofOfResidence: 'comprovante_maria.pdf',
      payStub: 'holerite_maria.pdf'
    },
    createdAt: '2024-02-10',
    status: 'active',
    creditScore: 820,
    creditRating: 'excellent',
    totalLoans: 1,
    activeLoans: 1,
    completedLoans: 0,
    defaultedLoans: 0,
    totalBorrowed: 15000,
    totalPaid: 6000,
    onTimePayments: 6,
    latePayments: 0,
    averagePaymentDelay: 0,
    observations: [
      {
        id: '3',
        content: 'Cliente modelo. Documentação sempre em ordem e pagamentos antecipados.',
        createdAt: '2024-02-12T09:15:00Z',
        createdBy: 'Pedro Analista',
        type: 'general',
        isImportant: true
      }
    ]
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    cpf: '456.789.123-00',
    email: 'pedro@email.com',
    phone: '(11) 99999-0003',
    residentialAddress: {
      street: 'Rua do Comércio',
      number: '789',
      neighborhood: 'República',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-000'
    },
    workAddress: {
      company: 'Loja do Pedro',
      street: 'Rua 25 de Março',
      number: '500',
      neighborhood: 'Sé',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01021-000'
    },
    documents: {
      selfie: 'selfie_pedro.jpg',
      proofOfResidence: 'comprovante_pedro.pdf',
      payStub: 'holerite_pedro.pdf',
      workCard: 'carteira_pedro.jpg'
    },
    createdAt: '2024-03-05',
    status: 'blocked',
    creditScore: 680,
    creditRating: 'fair',
    totalLoans: 1,
    activeLoans: 0,
    completedLoans: 1,
    defaultedLoans: 0,
    totalBorrowed: 5000,
    totalPaid: 5305,
    onTimePayments: 6,
    latePayments: 0,
    averagePaymentDelay: 0,
    observations: [
      {
        id: '4',
        content: 'Cliente quitou empréstimo antes do prazo. Demonstrou interesse em novos produtos.',
        createdAt: '2024-03-10T16:45:00Z',
        createdBy: 'Maria Analista',
        type: 'payment',
        isImportant: false
      },
      {
        id: '5',
        content: 'ATENÇÃO: Cliente mudou de endereço. Atualizar dados cadastrais.',
        createdAt: '2024-03-15T11:30:00Z',
        createdBy: 'João Operador',
        type: 'warning',
        isImportant: true
      }
    ]
  }
];

export const mockLoans: Loan[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'João Silva',
    amount: 10000,
    interestRate: 2.5,
    installments: 12,
    installmentValue: 946.25,
    totalAmount: 11355,
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    status: 'active',
    paidInstallments: 4,
    remainingAmount: 7570,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'Maria Santos',
    amount: 15000,
    interestRate: 3.0,
    installments: 18,
    installmentValue: 1028.33,
    totalAmount: 18510,
    startDate: '2024-02-10',
    endDate: '2025-08-10',
    status: 'active',
    paidInstallments: 6,
    remainingAmount: 12340,
    createdAt: '2024-02-10T14:30:00Z'
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'Pedro Oliveira',
    amount: 5000,
    interestRate: 2.0,
    installments: 6,
    installmentValue: 884.17,
    totalAmount: 5305,
    startDate: '2024-03-05',
    endDate: '2024-09-05',
    status: 'completed',
    paidInstallments: 6,
    remainingAmount: 0,
    createdAt: '2024-03-05T09:15:00Z'
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    loanId: '1',
    installmentNumber: 5,
    amount: 946.25,
    dueDate: '2024-05-15',
    status: 'pending'
  },
  {
    id: '2',
    loanId: '2',
    installmentNumber: 7,
    amount: 1028.33,
    dueDate: '2024-08-10',
    status: 'pending'
  },
  {
    id: '3',
    loanId: '1',
    installmentNumber: 4,
    amount: 946.25,
    dueDate: '2024-04-15',
    paymentDate: '2024-04-16',
    status: 'paid'
  }
];

export const mockDashboard: Dashboard = {
  totalLoans: 3,
  activeLoans: 2,
  totalLent: 30000,
  totalReceived: 8645,
  pendingAmount: 19910,
  overdueAmount: 0,
  monthlyRevenue: 2874.58,
  defaultRate: 0
};