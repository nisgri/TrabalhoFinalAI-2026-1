import { useCallback, useEffect, useRef, useState } from 'react';
import { buscarPedido } from '../api/pedidos';

const POLLING_INTERVAL_MS = 3000;

function pedidoPossuiAnalise(pedido) {
  return Boolean(pedido?.perfilCliente);
}

export default function OrderResult({ pedidoInicial }) {
  const [pedido, setPedido] = useState(pedidoInicial);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const intervalRef = useRef(null);

  const analiseConcluida = pedidoPossuiAnalise(pedido);

  const atualizarStatus = useCallback(async () => {
    if (!pedido?.id) {
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const pedidoAtualizado = await buscarPedido(pedido.id);
      setPedido(pedidoAtualizado);
    } catch {
      setErro('Não foi possível atualizar o status do pedido.');
    } finally {
      setCarregando(false);
    }
  }, [pedido?.id]);

  useEffect(() => {
    if (!pedido?.id || analiseConcluida) {
      return undefined;
    }

    intervalRef.current = setInterval(async () => {
      try {
        const pedidoAtualizado = await buscarPedido(pedido.id);
        setPedido(pedidoAtualizado);
      } catch {
        setErro('Erro ao consultar a análise da IA.');
      }
    }, POLLING_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pedido?.id, analiseConcluida]);

  if (!pedido) {
    return null;
  }

  return (
    <section aria-labelledby="resultado-pedido-titulo" className="mt-10">
      <header className="mb-6">
        <h2 id="resultado-pedido-titulo" className="text-2xl font-semibold text-slate-900">
          Resultado do Pedido
        </h2>
      </header>

      {/* A11y: aria-live anuncia mudanças de status para leitores de tela */}
      <article
        aria-live="polite"
        aria-atomic="true"
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500">ID do pedido</dt>
            <dd className="text-base text-slate-900">{pedido.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Cliente</dt>
            <dd className="text-base text-slate-900">{pedido.cliente}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Cidade</dt>
            <dd className="text-base text-slate-900">{pedido.cidade}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Valor total</dt>
            <dd className="text-base text-slate-900">
              R$ {Number(pedido.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-slate-500">Produtos</dt>
            <dd className="text-base text-slate-900">{pedido.produtos?.join(', ')}</dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-slate-100 pt-6">
          {!analiseConcluida ? (
            <p
              role="status"
              className="flex items-center gap-2 text-base font-medium text-amber-800"
              aria-label="Analisando pedido com inteligência artificial"
            >
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-amber-700 border-t-transparent"
                aria-hidden="true"
              />
              Analisando pedido com IA...
            </p>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Análise da IA</h3>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-slate-500">Perfil do cliente</dt>
                  <dd className="text-base text-slate-900">{pedido.perfilCliente}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Cupom de desconto</dt>
                  <dd className="text-base font-semibold text-green-700">
                    {pedido.cupomDesconto || 'Nenhum cupom disponível'}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-slate-500">Recomendações</dt>
                  <dd className="text-base text-slate-900">{pedido.recomendacoes}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-slate-500">Mensagem personalizada</dt>
                  <dd className="rounded-lg bg-blue-50 px-4 py-3 text-base text-blue-900">
                    {pedido.mensagemIA}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        {erro && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {erro}
          </p>
        )}

        <button
          type="button"
          onClick={atualizarStatus}
          disabled={carregando}
          aria-label="Atualizar status do pedido manualmente"
          className="mt-6 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {carregando ? 'Atualizando...' : 'Atualizar Status'}
        </button>
      </article>
    </section>
  );
}
