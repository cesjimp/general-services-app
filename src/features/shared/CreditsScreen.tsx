import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingDown, TrendingUp, Wallet, Clock, Info } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useRoleStore } from '../../store/useRoleStore';

interface Transaction {
  id: string;
  amount: number;
  transaction_type: 'recharge' | 'lead_purchase' | 'bonus' | 'refund';
  description: string;
  created_at: string;
}

export default function CreditsScreen() {
  const navigate = useNavigate();
  const { userId, profile } = useRoleStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('profile_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string, amount: number) => {
    if (amount > 0) return <TrendingUp className="w-5 h-5 text-emerald-500" />;
    return <TrendingDown className="w-5 h-5 text-orange-500" />;
  };

  const formatType = (type: string) => {
    const types: Record<string, string> = {
      'recharge': 'Recarga',
      'lead_purchase': 'Compra de Contacto',
      'bonus': 'Regalo / Bono',
      'refund': 'Reembolso'
    };
    return types[type] || type;
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-10">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 px-4 h-16 flex items-center border-b border-slate-200">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="ml-4 font-bold text-slate-900 text-lg">Estado de Cuenta</h1>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        {/* Card de Saldo */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Wallet className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Saldo Disponible</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black text-white">{profile?.credits || 0}</span>
              <span className="text-slate-400 font-bold mb-2">Créditos</span>
            </div>
          </div>
        </div>

        {/* Historial */}
        <h2 className="text-slate-900 font-black text-xl mb-4 px-1">Movimientos Recientes</h2>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-brand rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium text-sm">Consultando transacciones...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-10 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold">No tienes movimientos aún.</p>
            <p className="text-slate-400 text-xs mt-1">Tus compras y recargas aparecerán aquí.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((t) => (
              <div 
                key={t.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-brand"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    t.amount > 0 ? 'bg-emerald-50' : 'bg-orange-50'
                  }`}>
                    {getIcon(t.transaction_type, t.amount)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{formatType(t.transaction_type)}</p>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(t.created_at).toLocaleDateString()} • {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-lg ${
                    t.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                  }`}>
                    {t.amount > 0 ? '+' : ''}{t.amount}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">CRÉDITOS</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
