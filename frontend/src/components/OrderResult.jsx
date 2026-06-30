import { useCallback, useEffect, useRef, useState } from 'react';
import { buscarPedido } from '../api/pedidos';

const POLLING_INTERVAL_MS = 3000;

function pedidoPossuiAnalise(pedido) {
  return Boolean(pedido?.perfilCliente);
}

function PerfilBadge({ perfil }) {
  const isPremium = perfil?.toLowerCase().includes('premium');
  return (
    <span
      className={`badge ${
        isPremium
          ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
          : 'bg-blue-100 text-blue-800 ring-1 ring-blue-300'
      }`}
    >
      {isPremium ? '⭐ ' : ''}{perfil}
    </span>
  );
}

export default function OrderResult({ pedidoInicial }) {
  const [pedido, setPedido] = useState(pedidoInicial);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const intervalRef = useRef(null);

  const analiseConcluida = pedidoPossuiAnalise(pedido);

  const atualizarStatus = useCallback(async () => {
    if (!pedido?.id) return;
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
    if (!pedido?.id || analiseConcluida) return undefined;

    intervalRef.current = setInterval(async () => {
      try {
        const pedidoAtualizado = await buscarPedido(pedido.id);
        setPedido(pedidoAtualizado);
      } catch {
        setErro('Erro ao consultar a análise da IA.');
      }
    }, POLLING_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pedido?.id, analiseConcluida]);

  useEffect(() => {
    setPedido(pedidoInicial);
  }, [pedidoInicial]);

  if (!pedido) {
    return (
      <section aria-labelledby="resultado-pedido-titulo">
        <h2 id="resultado-pedido-titulo" className="mb-4 text-xl font-bold text-slate-900">
          Resultado do Pedido
        </h2>
        <div className="card flex flex-col items-center gap-4 px-6 py-14 text-center">
          <span className="text-5xl" aria-hidden="true">🛍️</span>
          <div>
            <p className="text-base font-semibold text-slate-700">Nenhum pedido realizado ainda</p>
            <p className="mt-1 text-sm text-slate-400">
              Preencha o formulário acima e finalize seu pedido para receber análise personalizada da IA.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const recomendacoesList = pedido.recomendacoes
    ? pedido.recomendacoes.split(',').map((r) => r.trim()).filter(Boolean)
    : [];

  return (
    <section aria-labelledby="resultado-pedido-titulo">
      <h2 id="resultado-pedido-titulo" className="mb-4 text-xl font-bold text-slate-900">
        Resultado do Pedido
      </h2>

      <article
        aria-live="polite"
        aria-atomic="true"
        className="card overflow-hidden"
      >
        {/* Resumo do pedido */}
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pedido #{pedido.id}
            </span>
            <span
              className={`badge ${analiseConcluida ? 'bg-green-100 text-green-700 ring-1 ring-green-300' : 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'}`}
            >
              {analiseConcluida ? '✓ Analisado' : '⏳ Aguardando IA'}
            </span>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cliente</dt>
              <dd className="mt-0.5 text-base font-semibold text-slate-900">{pedido.cliente}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cidade</dt>
              <dd className="mt-0.5 text-base text-slate-900">{pedido.cidade}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Valor total</dt>
              <dd className="mt-0.5 text-lg font-bold text-blue-700">
                R$ {Number(pedido.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Produtos</dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {pedido.produtos?.map((p) => (
                  <span key={p} className="badge bg-slate-200 text-slate-700">
                    {p}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        {/* Resultado da IA */}
        <div className="px-6 py-6">
          {!analiseConcluida ? (
            <div
              role="status"
              className="flex flex-col items-center justify-center gap-3 py-8 text-center"
              aria-label="Analisando pedido com inteligência artificial"
            >
              <span
                className="spinner h-8 w-8 text-blue-500"
                aria-hidden="true"
              />
              <p className="text-sm font-semibold text-slate-600">Analisando pedido com IA...</p>
              <p className="text-xs text-slate-400">Isso pode levar alguns segundos</p>
            </div>
          ) : (
            <div className="space-y-5">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <span aria-hidden="true">🤖</span>
                Análise da Inteligência Artificial
              </h3>

              {/* Perfil do cliente */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                <span className="text-sm font-medium text-slate-600">Perfil do cliente</span>
                <PerfilBadge perfil={pedido.perfilCliente} />
              </div>

              {/* Cupom de desconto */}
              {pedido.cupomDesconto && (
                <div className="flex items-center justify-between rounded-xl border-2 border-dashed border-green-300 bg-green-50 px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                      Cupom de desconto
                    </p>
                    <p className="mt-0.5 text-lg font-bold tracking-widest text-green-800">
                      {pedido.cupomDesconto}
                    </p>
                  </div>
                  <span className="text-3xl" aria-hidden="true">🎟️</span>
                </div>
              )}

              {/* Recomendações */}
              {recomendacoesList.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700">Produtos recomendados</p>
                  <div className="flex flex-wrap gap-2">
                    {recomendacoesList.map((rec) => (
                      <span
                        key={rec}
                        className="badge bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200"
                      >
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mensagem personalizada */}
              {pedido.mensagemIA && (
                <blockquote className="rounded-xl bg-blue-50 border-l-4 border-blue-500 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-1">
                    Mensagem personalizada
                  </p>
                  <p className="text-sm text-blue-900 leading-relaxed">{pedido.mensagemIA}</p>
                </blockquote>
              )}
            </div>
          )}
        </div>

        {/* Footer do card */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
          {erro && (
            <p role="alert" className="text-sm font-medium text-red-600">
              ⚠️ {erro}
            </p>
          )}
          {!erro && <span />}
          <button
            type="button"
            onClick={atualizarStatus}
            disabled={carregando}
            aria-label="Atualizar status do pedido manualmente"
            className="btn-secondary text-sm"
          >
            {carregando ? (
              <span className="flex items-center gap-1.5">
                <span className="spinner h-3.5 w-3.5" aria-hidden="true" />
                Atualizando...
              </span>
            ) : (
              '↻ Atualizar Status'
            )}
          </button>
        </div>
      </article>
    </section>
  );
}
