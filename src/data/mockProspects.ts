import { Prospect } from '../types';

export const mockProspects: Prospect[] = [
  {
    id: '1',
    name: 'Ana Silva',
    phone: '(11) 99999-1001',
    email: 'ana.silva@email.com',
    cpf: '123.456.789-01',
    requestedAmount: 15000,
    stage: 'lead',
    priority: 'high',
    source: 'website',
    notes: 'Cliente interessada em empréstimo para expandir negócio. Tem loja de roupas há 3 anos.',
    documents: {},
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-12-20T10:00:00Z',
    assignedTo: 'João Vendedor',
    expectedCloseDate: '2024-12-25'
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    phone: '(11) 99999-1002',
    email: 'carlos@email.com',
    requestedAmount: 8000,
    stage: 'documents',
    priority: 'medium',
    source: 'referral',
    notes: 'Indicação de cliente atual. Precisa enviar comprovante de renda.',
    documents: {
      selfie: true,
      proofOfResidence: true,
      payStub: false
    },
    address: {
      street: 'Rua das Palmeiras',
      number: '456',
      neighborhood: 'Vila Nova',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    createdAt: '2024-12-18T14:30:00Z',
    updatedAt: '2024-12-20T09:15:00Z',
    assignedTo: 'Maria Analista'
  },
  {
    id: '3',
    name: 'Fernanda Costa',
    phone: '(11) 99999-1003',
    email: 'fernanda.costa@email.com',
    cpf: '987.654.321-00',
    requestedAmount: 25000,
    stage: 'analysis',
    priority: 'high',
    source: 'social_media',
    notes: 'Documentação completa. Aguardando análise de crédito.',
    documents: {
      selfie: true,
      cnh: true,
      proofOfResidence: true,
      payStub: true,
      workCard: true
    },
    address: {
      street: 'Av. Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    workInfo: {
      company: 'Tech Solutions Ltda',
      position: 'Gerente de Projetos',
      income: 8500
    },
    createdAt: '2024-12-15T11:20:00Z',
    updatedAt: '2024-12-19T16:45:00Z',
    assignedTo: 'Pedro Analista'
  },
  {
    id: '4',
    name: 'Roberto Santos',
    phone: '(11) 99999-1004',
    requestedAmount: 12000,
    stage: 'approved',
    priority: 'medium',
    source: 'phone',
    notes: 'Análise aprovada. Pronto para conversão em cliente.',
    documents: {
      selfie: true,
      cnh: true,
      proofOfResidence: true,
      payStub: true
    },
    address: {
      street: 'Rua do Comércio',
      number: '789',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01001-000'
    },
    workInfo: {
      company: 'Comércio ABC',
      position: 'Vendedor',
      income: 3500
    },
    createdAt: '2024-12-10T08:00:00Z',
    updatedAt: '2024-12-20T10:30:00Z',
    assignedTo: 'Ana Gerente'
  },
  {
    id: '5',
    name: 'Juliana Pereira',
    phone: '(11) 99999-1005',
    email: 'juliana@email.com',
    requestedAmount: 5000,
    stage: 'rejected',
    priority: 'low',
    source: 'walk_in',
    notes: 'Análise rejeitada por score baixo.',
    documents: {
      selfie: true,
      proofOfResidence: true
    },
    rejectionReason: 'Score de crédito insuficiente',
    createdAt: '2024-12-12T15:30:00Z',
    updatedAt: '2024-12-18T14:20:00Z',
    assignedTo: 'Carlos Analista'
  }
];