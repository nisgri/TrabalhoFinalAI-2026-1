import { useState } from 'react';
import { criarPedido } from '../api/pedidos';

const PRODUTOS_DISPONIVEIS = [
  { id: 'notebook', nome: 'Notebook', preco: 4500, emoji: '💻' },
  { id: 'mouse', nome: 'Mouse Gamer', preco: 250, emoji: '🖱️' },
  { id: 'teclado', nome: 'Teclado Mecânico', preco: 420, emoji: '⌨️' },
  { id: 'monitor', nome: 'Monitor 27"', preco: 1800, emoji: '🖥️' },
  { id: 'headset', nome: 'Headset Gamer', preco: 380, emoji: '🎧' },
  { id: 'ssd', nome: 'SSD 1TB', preco: 520, emoji: '💾' },
];

export default function OrderForm({ onPedidoCriado }) {
  const [cliente, setCliente] = useState('');
  const [cidade, setCidade] = useState('');
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [erroCampo, setErroCampo] = useState('');

  const valorTotal = produtosSelecionados.reduce((total, id) => {
    const produto = PRODUTOS_DISPONIVEIS.find((item) => item.id === id);
    return total + (produto?.preco ?? 0);
  }, 0);

  function alternarProduto(produtoId) {
    if (erroCampo === 'produtos') {
      setErroCampo('');
      setErro('');
    }

    setProdutosSelecionados((atual) =>
      atual.includes(produtoId)
        ? atual.filter((id) => id !== produtoId)
        : [...atual, produtoId],
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');
    setErroCampo('');

    if (!cliente.trim()) {
      setErro('Informe seu nome para continuar.');
      setErroCampo('cliente');
      return;
    }

    if (!cidade.trim()) {
      setErro('Informe sua cidade para continuar.');
      setErroCampo('cidade');
      return;
    }

    if (produtosSelecionados.length === 0) {
      setErro('Selecione ao menos um produto.');
      setErroCampo('produtos');
      return;
    }

    const produtos = produtosSelecionados.map((id) => {
      const produto = PRODUTOS_DISPONIVEIS.find((item) => item.id === id);
      return produto.nome;
    });

    setEnviando(true);

    try {
      const pedido = await criarPedido({
        cliente: cliente.trim(),
        cidade: cidade.trim(),
        valorTotal,
        produtos,
      });

      onPedidoCriado(pedido);
      setCliente('');
      setCidade('');
      setProdutosSelecionados([]);
    } catch (error) {
      const mensagem =
        error.response?.data?.mensagem ||
        (error.response?.data?.erros
          ? Object.values(error.response.data.erros).join(' ')
          : 'Não foi possível enviar o pedido. Tente novamente.');
      setErro(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section aria-labelledby="formulario-pedido-titulo" className="card p-6 sm:p-8">
      <header className="mb-6">
        <h2 id="formulario-pedido-titulo" className="text-xl font-bold text-slate-900">
          Novo Pedido
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Preencha seus dados e selecione os produtos desejados.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cliente" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Nome do cliente
            </label>
            <input
              id="cliente"
              name="cliente"
              type="text"
              required
              autoComplete="name"
              placeholder="Ex: Maria Silva"
              value={cliente}
              onChange={(event) => {
                setCliente(event.target.value);
                if (erroCampo === 'cliente') {
                  setErroCampo('');
                  setErro('');
                }
              }}
              className="input-field"
              aria-required="true"
              aria-invalid={erroCampo === 'cliente'}
              aria-describedby="cliente-ajuda"
            />
            <p id="cliente-ajuda" className="mt-1 text-xs text-slate-500">
              Digite seu nome completo para identificação do pedido.
            </p>
          </div>

          <div>
            <label htmlFor="cidade" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Cidade
            </label>
            <input
              id="cidade"
              name="cidade"
              type="text"
              required
              autoComplete="address-level2"
              placeholder="Ex: Petrópolis"
              value={cidade}
              onChange={(event) => {
                setCidade(event.target.value);
                if (erroCampo === 'cidade') {
                  setErroCampo('');
                  setErro('');
                }
              }}
              className="input-field"
              aria-required="true"
              aria-invalid={erroCampo === 'cidade'}
              aria-describedby="cidade-ajuda"
            />
            <p id="cidade-ajuda" className="mt-1 text-xs text-slate-500">
              Informe a cidade onde o pedido deve ser entregue.
            </p>
          </div>
        </div>

        <fieldset aria-describedby="produtos-ajuda">
          <legend className="mb-3 text-sm font-semibold text-slate-700">
            Produtos disponíveis
          </legend>
          <p id="produtos-ajuda" className="sr-only">
            Selecione um ou mais produtos. Use a tecla Espaço para alternar a seleção.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {PRODUTOS_DISPONIVEIS.map((produto) => {
              const selecionado = produtosSelecionados.includes(produto.id);
              return (
                <label
                  key={produto.id}
                  htmlFor={`produto-${produto.id}`}
                  className={`produto-card ${selecionado ? 'selecionado' : ''}`}
                >
                  <input
                    id={`produto-${produto.id}`}
                    type="checkbox"
                    checked={selecionado}
                    onChange={() => alternarProduto(produto.id)}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xl
                      ${selecionado ? 'bg-blue-100' : 'bg-slate-100'}`}
                    aria-hidden="true"
                  >
                    {produto.emoji}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`block text-sm font-semibold ${selecionado ? 'text-blue-800' : 'text-slate-800'}`}>
                      {produto.nome}
                    </span>
                    <span className="block text-xs text-slate-500">
                      R$ {produto.preco.toLocaleString('pt-BR')}
                    </span>
                  </span>
                  <span
                    className={`ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2
                      ${selecionado
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-slate-300 bg-white'}`}
                    aria-hidden="true"
                  >
                    {selecionado && (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div
          className="flex items-center justify-between rounded-xl bg-slate-50 border-2 border-slate-200 px-5 py-4"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="text-sm font-medium text-slate-600">
            {produtosSelecionados.length} produto{produtosSelecionados.length !== 1 ? 's' : ''} selecionado{produtosSelecionados.length !== 1 ? 's' : ''}
          </span>
          <span className="text-xl font-bold text-slate-900">
            R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {erro && (
          <p role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700">
            <span aria-hidden="true">⚠️</span>
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          aria-busy={enviando}
          className="btn-primary"
        >
          {enviando ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner" aria-hidden="true" />
              Enviando pedido...
            </span>
          ) : (
            'Finalizar Pedido'
          )}
        </button>
      </form>
    </section>
  );
}
