import { useState } from 'react';
import OrderForm from './components/OrderForm';
import OrderResult from './components/OrderResult';

export default function App() {
  const [pedidoAtual, setPedidoAtual] = useState(null);

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 shadow-lg">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-2xl shadow-inner"
              aria-hidden="true"
            >
              🛒
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                TechStore <span className="font-normal opacity-75">com IA</span>
              </h1>
              <p className="text-sm text-blue-100">
                Recomendações personalizadas via inteligência artificial
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        <OrderForm onPedidoCriado={setPedidoAtual} />
        <OrderResult pedidoInicial={pedidoAtual} />
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-400">
        TechStore &copy; {new Date().getFullYear()} &mdash; Powered by n8n &amp; IA
      </footer>
    </div>
  );
}
