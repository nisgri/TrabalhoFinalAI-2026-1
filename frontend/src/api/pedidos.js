import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function criarPedido(pedido) {
  const { data } = await api.post('/pedidos', pedido);
  return data;
}

export async function buscarPedido(id) {
  const { data } = await api.get(`/pedidos/${id}`);
  return data;
}

export default api;
