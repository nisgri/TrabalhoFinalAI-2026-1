import { useState } from 'react';
import OrderForm from './components/OrderForm';
import OrderResult from './components/OrderResult';

export default function App() {
  const [pedidoAtual, setPedidoAtual] = useState(null);

  return (
    <div className="min-h-screen">
      {/* A11y: estrutura semântica com main e header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900">E-commerce com IA</h1>
          <p className="mt-2 text-slate-600">
            Faça seu pedido e receba recomendações personalizadas via n8n.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <OrderForm onPedidoCriado={setPedidoAtual} />
        <OrderResult pedidoInicial={pedidoAtual} />
      </main>
    </div>
  );
}
