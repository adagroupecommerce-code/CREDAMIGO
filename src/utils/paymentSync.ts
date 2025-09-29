import { Loan, Payment } from '../types';
import { supabase } from '../lib/supabase';

// Função para sincronizar pagamentos com base no installmentPlan do empréstimo
export const syncPaymentsFromLoan = async (loan: Loan): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔄 Sincronizando pagamentos para empréstimo:', loan.id);

    // 1. Buscar pagamentos existentes
    const { data: existingPayments, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('loan_id', loan.id);

    if (fetchError) throw fetchError;

    // 2. Gerar plano de parcelas se não existir
    let installmentPlan = loan.installmentPlan;
    if (!installmentPlan || installmentPlan.length === 0) {
      installmentPlan = generateDefaultInstallmentPlan(loan);
    }

    // 3. Criar/atualizar pagamentos baseado no installmentPlan
    const paymentsToUpsert = installmentPlan.map(installment => {
      const existingPayment = existingPayments?.find(
        p => p.installment_number === installment.installmentNumber
      );

      return {
        id: existingPayment?.id,
        loan_id: loan.id,
        installment_number: installment.installmentNumber,
        amount: installment.remainingAmountForThisInstallment || installment.totalAmount,
        principal_amount: installment.principalAmount,
        interest_amount: installment.interestAmount,
        penalty: 0, // Será calculado dinamicamente
        due_date: installment.dueDate,
        payment_date: installment.paymentDate,
        status: installment.status === 'paid' ? 'paid' : 
                installment.status === 'partially_paid' ? 'pending' :
                new Date(installment.dueDate) < new Date() ? 'overdue' : 'pending',
        original_amount: installment.totalAmount,
        payment_type: installment.status === 'paid' ? 'full' : 
                     installment.status === 'partially_paid' ? 'partial' : 'full',
        excess_amount: 0,
        notes: null
      };
    });

    // 4. Fazer upsert dos pagamentos
    const { error: upsertError } = await supabase
      .from('payments')
      .upsert(paymentsToUpsert, { 
        onConflict: 'loan_id,installment_number',
        ignoreDuplicates: false 
      });

    if (upsertError) throw upsertError;

    // 5. Remover pagamentos órfãos (parcelas que não existem mais no plano)
    const validInstallmentNumbers = installmentPlan.map(i => i.installmentNumber);
    const { error: deleteError } = await supabase
      .from('payments')
      .delete()
      .eq('loan_id', loan.id)
      .not('installment_number', 'in', `(${validInstallmentNumbers.join(',')})`);

    if (deleteError) throw deleteError;

    console.log('✅ Pagamentos sincronizados com sucesso');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao sincronizar pagamentos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

// Função para gerar plano de parcelas padrão (Tabela Price)
const generateDefaultInstallmentPlan = (loan: Loan) => {
  const startDate = new Date(loan.startDate);
  const monthlyRate = loan.interestRate / 100;
  let remainingBalance = loan.amount;
  const installmentPlan = [];

  for (let i = 1; i <= loan.installments; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);
    
    const interestAmount = remainingBalance * monthlyRate;
    const principalAmount = loan.installmentValue - interestAmount;
    remainingBalance -= principalAmount;

    // Determinar status baseado em paidInstallments
    let status: 'pending' | 'paid' | 'overdue' | 'partially_paid' = 'pending';
    if (i <= loan.paidInstallments) {
      status = 'paid';
    } else if (dueDate < new Date()) {
      status = 'overdue';
    }

    installmentPlan.push({
      installmentNumber: i,
      dueDate: dueDate.toISOString().split('T')[0],
      principalAmount: Math.round(principalAmount * 100) / 100,
      interestAmount: Math.round(interestAmount * 100) / 100,
      totalAmount: loan.installmentValue,
      remainingBalance: Math.max(0, Math.round(remainingBalance * 100) / 100),
      status,
      paymentDate: status === 'paid' ? dueDate.toISOString().split('T')[0] : undefined,
      paidAmountForThisInstallment: status === 'paid' ? loan.installmentValue : 0,
      remainingAmountForThisInstallment: status === 'paid' ? 0 : loan.installmentValue
    });
  }

  return installmentPlan;
};

// Função para calcular multa por atraso
export const calculatePenalty = (
  originalAmount: number, 
  dueDate: string, 
  currentDate: string = new Date().toISOString().split('T')[0]
): number => {
  const due = new Date(dueDate);
  const current = new Date(currentDate);
  
  if (current <= due) return 0;
  
  const daysOverdue = Math.floor((current.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  
  // 2% de multa + 0.1% por dia de atraso
  const penaltyRate = 0.02 + (daysOverdue * 0.001);
  return Math.round(originalAmount * penaltyRate * 100) / 100;
};

// Função para gerar pagamentos em tempo real a partir dos empréstimos
export const generateRealTimePayments = (loans: Loan[]): Payment[] => {
  const payments: Payment[] = [];
  
  loans.forEach(loan => {
    // Usar installmentPlan se existir, senão gerar padrão
    const installmentPlan = loan.installmentPlan || generateDefaultInstallmentPlan(loan);
    
    installmentPlan.forEach(installment => {
      // Calcular multa para parcelas vencidas
      const penalty = installment.status === 'overdue' || 
        (installment.status === 'partially_paid' && new Date(installment.dueDate) < new Date())
        ? calculatePenalty(installment.totalAmount, installment.dueDate)
        : 0;

      payments.push({
        id: `${loan.id}-${installment.installmentNumber}`,
        loanId: loan.id,
        installmentNumber: installment.installmentNumber,
        amount: installment.remainingAmountForThisInstallment || installment.totalAmount,
        principalAmount: installment.principalAmount,
        interestAmount: installment.interestAmount,
        penalty,
        dueDate: installment.dueDate,
        paymentDate: installment.paymentDate,
        status: installment.status === 'paid' ? 'paid' :
                installment.status === 'partially_paid' ? 'pending' :
                new Date(installment.dueDate) < new Date() ? 'overdue' : 'pending',
        originalAmount: installment.totalAmount,
        paymentType: installment.status === 'paid' ? 'full' :
                    installment.status === 'partially_paid' ? 'partial' : 'full',
        excessAmount: 0,
        clientName: loan.clientName,
        clientId: loan.clientId
      });
    });
  });

  return payments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
};

// Função para atualizar pagamento e propagar mudanças
export const updatePaymentAndPropagate = async (
  paymentId: string,
  paymentData: {
    paymentDate: string;
    totalPaid: number;
    capitalPaid: number;
    interestPaid: number;
    penalty?: number;
  },
  onLoanUpdate: (loan: Loan) => void
): Promise<{ success: boolean; error?: string }> => {
  try {
    // 1. Buscar o pagamento e empréstimo relacionado
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payments')
      .select(`
        *,
        loans!inner(*)
      `)
      .eq('id', paymentId)
      .single();

    if (paymentError) throw paymentError;

    const loan = paymentRecord.loans;
    
    // 2. Atualizar o pagamento
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        amount: paymentData.totalPaid,
        principal_amount: paymentData.capitalPaid,
        interest_amount: paymentData.interestPaid,
        penalty: paymentData.penalty || 0,
        payment_date: paymentData.paymentDate,
        status: 'paid',
        payment_type: paymentData.totalPaid >= paymentRecord.original_amount ? 'full' : 'partial',
        excess_amount: Math.max(0, paymentData.totalPaid - paymentRecord.original_amount),
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId);

    if (updateError) throw updateError;

    // 3. Atualizar installmentPlan do empréstimo
    let installmentPlan = loan.installment_plan || [];
    const installmentIndex = installmentPlan.findIndex(
      (inst: any) => inst.installmentNumber === paymentRecord.installment_number
    );

    if (installmentIndex !== -1) {
      const installment = installmentPlan[installmentIndex];
      const newPaidAmount = (installment.paidAmountForThisInstallment || 0) + paymentData.totalPaid;
      const newRemainingAmount = Math.max(0, installment.totalAmount - newPaidAmount);

      installmentPlan[installmentIndex] = {
        ...installment,
        status: newRemainingAmount <= 0.01 ? 'paid' : 'partially_paid',
        paymentDate: paymentData.paymentDate,
        paidAmountForThisInstallment: newPaidAmount,
        remainingAmountForThisInstallment: newRemainingAmount
      };

      // 4. Recalcular métricas do empréstimo
      const fullyPaidInstallments = installmentPlan.filter((inst: any) => inst.status === 'paid').length;
      const totalRemainingAmount = installmentPlan.reduce(
        (sum: number, inst: any) => sum + (inst.remainingAmountForThisInstallment || 0), 0
      );

      const updatedLoan = {
        ...loan,
        paid_installments: fullyPaidInstallments,
        remaining_amount: Math.round(totalRemainingAmount * 100) / 100,
        status: totalRemainingAmount <= 0.01 ? 'completed' : loan.status,
        installment_plan: installmentPlan
      };

      // 5. Atualizar empréstimo no banco
      const { error: loanUpdateError } = await supabase
        .from('loans')
        .update({
          paid_installments: updatedLoan.paid_installments,
          remaining_amount: updatedLoan.remaining_amount,
          status: updatedLoan.status,
          installment_plan: updatedLoan.installment_plan,
          updated_at: new Date().toISOString()
        })
        .eq('id', loan.id);

      if (loanUpdateError) throw loanUpdateError;

      // 6. Propagar mudanças para o frontend
      onLoanUpdate({
        id: loan.id,
        clientId: loan.client_id,
        clientName: '', // Será preenchido pelo componente
        amount: loan.amount,
        interestRate: loan.interest_rate,
        installments: loan.installments,
        installmentValue: loan.installment_value,
        totalAmount: loan.total_amount,
        startDate: loan.start_date,
        endDate: loan.end_date,
        status: updatedLoan.status,
        paidInstallments: updatedLoan.paid_installments,
        remainingAmount: updatedLoan.remaining_amount,
        notes: loan.notes,
        installmentPlan: updatedLoan.installment_plan,
        createdAt: loan.created_at,
        updatedAt: updatedLoan.updated_at
      });
    }

    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao atualizar pagamento:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};