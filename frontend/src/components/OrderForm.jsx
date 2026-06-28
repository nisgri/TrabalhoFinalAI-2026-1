import { useState } from 'react';
import { criarPedido } from '../api/pedidos';

const PRODUTOS_DISPONIVEIS = [
  { id: 'notebook', nome: 'Notebook', preco: 4500 },
  { id: 'mouse', nome: 'Mouse Gamer', preco: 250 },
  { id: 'teclado', nome: 'Teclado Mecânico', preco: 420 },
  { id: 'monitor', nome: 'Monitor 27"', preco: 1800 },
  { id: 'headset', nome: 'Headset Gamer', preco: 380 },
  { id: 'ssd', nome: 'SSD 1TB', preco: 520 },
];

export default function OrderForm({ onPedidoCriado }) {
  const [cliente, setCliente] = useState('');
  const [cidade, setCidade] = useState('');
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const valorTotal = produtosSelecionados.reduce((total, id) => {
    const produto = PRODUTOS_DISPONIVEIS.find((item) => item.id === id);
    return total + (produto?.preco ?? 0);
  }, 0);

  function alternarProduto(produtoId) {
    setProdutosSelecionados((atual) =>
      atual.includes(produtoId)
        ? atual.filter((id) => id !== produtoId)
        : [...atual, produtoId],
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');

    if (produtosSelecionados.length === 0) {
      setErro('Selecione ao menos um produto.');
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
    } catch (error) {
      const mensagem =
        error.response?.data?.erros
          ? Object.values(error.response.data.erros).join(' ')
          : 'Não foi possível enviar o pedido. Tente novamente.';
      setErro(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section aria-labelledby="formulario-pedido-titulo">
      <header className="mb-6">
        <h2 id="formulario-pedido-titulo" className="text-2xl font-semibold text-slate-900">
          Novo Pedido
        </h2>
        <p className="mt-1 text-slate-600">
          Preencha seus dados e selecione os produtos desejados.
        </p>
      </header>

      {/* A11y: formulário semântico com labels associados via htmlFor */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="cliente" className="mb-1 block text-sm font-medium text-slate-800">
            Nome do cliente
          </label>
          <input
            id="cliente"
            name="cliente"
            type="text"
            required
            autoComplete="name"
            value={cliente}
            onChange={(event) => setCliente(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm"
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="cidade" className="mb-1 block text-sm font-medium text-slate-800">
            Cidade
          </label>
          <input
            id="cidade"
            name="cidade"
            type="text"
            required
            autoComplete="address-level2"
            value={cidade}
            onChange={(event) => setCidade(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm"
            aria-required="true"
          />
        </div>

        <fieldset>
          <legend className="mb-3 text-sm font-medium text-slate-800">Produtos</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {PRODUTOS_DISPONIVEIS.map((produto) => (
              <label
                key={produto.id}
                htmlFor={`produto-${produto.id}`}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:border-blue-400"
              >
                <input
                  id={`produto-${produto.id}`}
                  type="checkbox"
                  checked={produtosSelecionados.includes(produto.id)}
                  onChange={() => alternarProduto(produto.id)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm text-slate-800">
                  {produto.nome}{' '}
                  <span className="text-slate-500">
                    (R$ {produto.preco.toLocaleString('pt-BR')})
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <p className="text-base font-semibold text-slate-900" aria-live="polite">
          Valor total: R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>

        {erro && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          aria-busy={enviando}
          className="rounded-lg bg-blue-700 px-4 py-2 font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {enviando ? 'Enviando pedido...' : 'Enviar pedido'}
        </button>
      </form>
    </section>
  );
}
