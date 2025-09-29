import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Payment, Loan } from '../types';

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          loans!inner(
            client_id,
            clients!inner(name)
          )
        `)
        .order('due_date', { ascending: true });

      if (error) throw error;

      const formattedPayments: Payment[] = data.map(payment => ({
        id: payment.id,
        loanId: payment.loan_id,
        installmentNumber: payment.installment_number,
        amount: payment.amount,
        principalAmount: payment.principal_amount,
        interestAmount: payment.interest_amount,
        penalty: payment.penalty,
        dueDate: payment.due_date,
        paymentDate: payment.payment_date,
        status: payment.status,
        originalAmount: payment.original_amount,
        paymentType: payment.payment_type,
        excessAmount: payment.excess_amount,
        notes: payment.notes,
        clientName: payment.loans.clients.name,
        clientId: payment.loans.client_id
      }));

      setPayments(formattedPayments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pagamentos');
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: Partial<Payment>) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert({
          loan_id: paymentData.loanId!,
          installment_number: paymentData.installmentNumber!,
          amount: paymentData.amount!,
          principal_amount: paymentData.principalAmount,
          interest_amount: paymentData.interestAmount,
          penalty: paymentData.penalty || 0,
          due_date: paymentData.dueDate!,
          payment_date: paymentData.paymentDate,
          status: paymentData.status || 'pending',
          original_amount: paymentData.originalAmount,
          payment_type: paymentData.paymentType || 'full',
          excess_amount: paymentData.excessAmount || 0,
          notes: paymentData.notes
        })
        .select()
        .single();

      if (error) throw error;

      await fetchPayments(); // Recarregar lista
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar pagamento');
      throw err;
    }
  };

  const updatePayment = async (id: string, paymentData: Partial<Payment>) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({
          amount: paymentData.amount,
          principal_amount: paymentData.principalAmount,
          interest_amount: paymentData.interestAmount,
          penalty: paymentData.penalty,
          payment_date: paymentData.paymentDate,
          status: paymentData.status,
          original_amount: paymentData.originalAmount,
          payment_type: paymentData.paymentType,
          excess_amount: paymentData.excessAmount,
          notes: paymentData.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchPayments(); // Recarregar lista
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar pagamento');
      throw err;
    }
  };

  const deletePayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchPayments(); // Recarregar lista
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir pagamento');
      throw err;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    error,
    createPayment,
    updatePayment,
    deletePayment,
    refetch: fetchPayments
  };
};