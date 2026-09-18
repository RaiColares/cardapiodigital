import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Category, Product, OrderStatus, Order } from '../types';
import { LayoutDashboard, ShoppingBag, Package, FolderOpen, Settings, LogOut, Plus, Edit, Trash2, Eye, EyeOff, Bell, TrendingUp, DollarSign, Users, Clock, Check, X, ChevronDown } from 'lucide-react';

type AdminTab = 'dashboard' | 'orders' | 'products' | 'categories' | 'settings';

export default function AdminPanel() {
  const { logout, setView } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const handleLogout = () => { logout(); setView('menu'); };

  const tabs = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'orders' as AdminTab, label: 'Pedidos', icon: <ShoppingBag size={18} /> },
    { id: 'products' as AdminTab, label: 'Produtos', icon: <Package size={18} /> },
    { id: 'categories' as AdminTab, label: 'Categorias', icon: <FolderOpen size={18} /> },
    { id: 'settings' as AdminTab, label: 'Config', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            <h1 className="text-lg font-bold text-gray-800 hidden sm:block">Painel Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView('menu')} className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-100">
              Ver Cardápio
            </button>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 flex items-center gap-1">
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row">
        {/* Sidebar */}
        <div className="sm:w-56 bg-white sm:min-h-[calc(100vh-57px)] shadow-sm">
          <nav className="flex sm:flex-col overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium whitespace-nowrap transition ${activeTab === tab.id ? 'text-orange-600 bg-orange-50 border-r-2 border-orange-500' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'orders' && <OrdersPanel />}
          {activeTab === 'products' && <ProductsPanel />}
          {activeTab === 'categories' && <CategoriesPanel />}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { orders, products } = useApp();
  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const avgTicket = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<ShoppingBag className="text-blue-500" />} label="Pedidos Hoje" value={todayOrders.length.toString()} color="blue" />
        <StatCard icon={<DollarSign className="text-green-500" />} label="Faturamento" value={`R$ ${todayRevenue.toFixed(2)}`} color="green" />
        <StatCard icon={<Clock className="text-yellow-500" />} label="Em Andamento" value={activeOrders.length.toString()} color="yellow" />
        <StatCard icon={<TrendingUp className="text-purple-500" />} label="Ticket Médio" value={`R$ ${avgTicket.toFixed(2)}`} color="purple" />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border">
        <h3 className="font-bold text-gray-800 mb-4">Últimos Pedidos</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Pedido</th>
                <th className="pb-2">Cliente</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">#{order.number}</td>
                  <td className="py-3">{order.customer.name}</td>
                  <td className="py-3">R$ {order.total.toFixed(2)}</td>
                  <td className="py-3"><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-gray-500 text-center py-4">Nenhum pedido ainda</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border">
          <h3 className="font-bold text-gray-800 mb-3">Produtos Cadastrados</h3>
          <p className="text-3xl font-bold text-orange-600">{products.length}</p>
          <p className="text-sm text-gray-500">{products.filter(p => p.available).length} disponíveis</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border">
          <h3 className="font-bold text-gray-800 mb-3">Mais Vendidos</h3>
          <div className="space-y-2">
            {products.filter(p => p.featured).slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center gap-2 text-sm">
                <span>{p.image}</span>
                <span className="text-gray-700">{p.name}</span>
                <span className="ml-auto text-orange-600 font-medium">R$ {p.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersPanel() {
  const { orders, updateOrderStatus } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
    { value: 'pending', label: 'Novo', color: 'bg-blue-100 text-blue-700' },
    { value: 'confirmed', label: 'Confirmado', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'preparing', label: 'Preparando', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'ready', label: 'Pronto', color: 'bg-green-100 text-green-700' },
    { value: 'delivering', label: 'Em Entrega', color: 'bg-purple-100 text-purple-700' },
    { value: 'delivered', label: 'Entregue', color: 'bg-gray-100 text-gray-700' },
    { value: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-700' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pedidos</h2>
        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
          {orders.filter(o => o.status === 'pending').length} novos
        </span>
      </div>

      {selectedOrder ? (
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <button onClick={() => setSelectedOrder(null)} className="text-sm text-orange-600 mb-4 hover:underline">← Voltar</button>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Pedido #{selectedOrder.number}</h3>
            <StatusBadge status={selectedOrder.status} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Cliente</h4>
              <p className="text-sm text-gray-600">{selectedOrder.customer.name}</p>
              <p className="text-sm text-gray-600">{selectedOrder.customer.phone}</p>
              {selectedOrder.customer.address && (
                <p className="text-sm text-gray-600 mt-1">
                  {selectedOrder.customer.address.street}, {selectedOrder.customer.address.number} - {selectedOrder.customer.address.neighborhood}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">Tipo: {selectedOrder.orderType === 'delivery' ? '🛵 Entrega' : selectedOrder.orderType === 'pickup' ? '🏪 Retirada' : '🍽️ No local'}</p>
              <p className="text-sm text-gray-500">Pagamento: {selectedOrder.paymentMethod}</p>
              <p className="text-sm text-gray-500">Data: {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Itens</h4>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-gray-600 py-1">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span>R$ {item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>R$ {selectedOrder.subtotal.toFixed(2)}</span></div>
                {selectedOrder.deliveryFee > 0 && <div className="flex justify-between text-sm"><span>Entrega</span><span>R$ {selectedOrder.deliveryFee.toFixed(2)}</span></div>}
                <div className="flex justify-between font-bold text-lg mt-1"><span>Total</span><span className="text-orange-600">R$ {selectedOrder.total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold text-gray-700 mb-2">Alterar Status</h4>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateOrderStatus(selectedOrder.id, opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${selectedOrder.status === opt.value ? opt.color + ' ring-2 ring-offset-1 ring-current' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} onClick={() => setSelectedOrder(order)} className="bg-white rounded-xl shadow-sm border p-4 cursor-pointer hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {order.status === 'pending' && <Bell size={16} className="text-yellow-500 animate-pulse" />}
                  <div>
                    <p className="font-bold text-gray-800">#{order.number}</p>
                    <p className="text-sm text-gray-500">{order.customer.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">R$ {order.total.toFixed(2)}</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-gray-500 text-center py-8">Nenhum pedido recebido</p>}
        </div>
      )}
    </div>
  );
}

function ProductsPanel() {
  const { products, categories, setProducts } = useApp();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyProduct: Product = {
    id: '', name: '', categoryId: categories[0]?.id || '', description: '', price: 0,
    image: '🍽️', available: true, featured: false, isNew: false, tags: [],
    ingredients: '', prepTime: '', order: products.length + 1, complementGroups: []
  };

  const handleSave = (product: Product) => {
    if (product.id) {
      setProducts(products.map(p => p.id === product.id ? product : p));
    } else {
      setProducts([...products, { ...product, id: Date.now().toString() }]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Excluir este produto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const toggleAvailability = (id: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, available: !p.available } : p));
  };

  if (showForm || editingProduct) {
    return <ProductForm product={editingProduct || emptyProduct} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingProduct(null); }} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Produtos</h2>
        <button onClick={() => setShowForm(true)} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-1">
          <Plus size={16} /> Novo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3 hidden sm:table-cell">Categoria</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{product.image}</span>
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        {product.featured && <span className="text-xs text-yellow-600">⭐ Destaque</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-600">{categories.find(c => c.id === product.categoryId)?.name}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-orange-600">R$ {product.price.toFixed(2)}</span>
                    {product.promoPrice && <span className="text-xs text-green-600 ml-1">→ R$ {product.promoPrice.toFixed(2)}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleAvailability(product.id)} className={`px-2 py-1 rounded-full text-xs font-medium ${product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.available ? '✅ Disponível' : '🔴 Indisponível'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditingProduct(product); setShowForm(true); }} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProductForm({ product, onSave, onCancel }: { product: Product; onSave: (p: Product) => void; onCancel: () => void }) {
  const { categories } = useApp();
  const [form, setForm] = useState<Product>(product);

  return (
    <div>
      <button onClick={onCancel} className="text-sm text-orange-600 mb-4 hover:underline">← Voltar</button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{product.id ? 'Editar' : 'Novo'} Produto</h2>
      
      <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" rows={2} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço *</label>
            <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço Promo</label>
            <input type="number" step="0.01" value={form.promoPrice || ''} onChange={(e) => setForm({ ...form, promoPrice: parseFloat(e.target.value) || undefined })} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="Opcional" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ícone/Emoji</label>
            <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ingredientes</label>
            <input type="text" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tempo de preparo</label>
            <input type="text" value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="Ex: 15-20 min" />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="rounded" />
            Disponível
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
            Destaque
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="rounded" />
            Novidade
          </label>
        </div>
        <div className="flex gap-3 pt-4">
          <button onClick={() => onSave(form)} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition">
            Salvar
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoriesPanel() {
  const { categories, setCategories, products } = useApp();
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyCategory: Category = { id: '', name: '', icon: '🍽️', description: '', order: categories.length + 1, active: true };

  const handleSave = (cat: Category) => {
    if (cat.id) {
      setCategories(categories.map(c => c.id === cat.id ? cat : c));
    } else {
      setCategories([...categories, { ...cat, id: Date.now().toString() }]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    const hasProducts = products.some(p => p.categoryId === id);
    if (hasProducts) { alert('Existem produtos nesta categoria. Mova-os antes de excluir.'); return; }
    if (confirm('Excluir esta categoria?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  if (showForm || editing) {
    return (
      <div>
        <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-sm text-orange-600 mb-4 hover:underline">← Voltar</button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{editing ? 'Editar' : 'Nova'} Categoria</h2>
        <CategoryForm category={editing || emptyCategory} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categorias</h2>
        <button onClick={() => setShowForm(true)} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-1">
          <Plus size={16} /> Nova
        </button>
      </div>

      <div className="space-y-3">
        {categories.sort((a, b) => a.order - b.order).map(cat => (
          <div key={cat.id} className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <p className="font-medium text-gray-800">{cat.name}</p>
                <p className="text-xs text-gray-500">{products.filter(p => p.categoryId === cat.id).length} produtos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {cat.active ? 'Ativa' : 'Inativa'}
              </span>
              <button onClick={() => { setEditing(cat); setShowForm(true); }} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600">
                <Edit size={14} />
              </button>
              <button onClick={() => handleDelete(cat.id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryForm({ category, onSave, onCancel }: { category: Category; onSave: (c: Category) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Category>(category);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ícone (emoji)</label>
        <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
        <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded" />
        Categoria ativa
      </label>
      <div className="flex gap-3 pt-2">
        <button onClick={() => onSave(form)} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition">Salvar</button>
        <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition">Cancelar</button>
      </div>
    </div>
  );
}

function SettingsPanel() {
  const { settings, setSettings } = useApp();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configurações</h2>
      
      <div className="space-y-4">
        {/* Store Info */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h3 className="font-bold text-gray-800 mb-3">Dados do Estabelecimento</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nome</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Logo (emoji)</label>
              <input type="text" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Descrição</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Telefone</label>
              <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">WhatsApp (com código do país)</label>
              <input type="text" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Endereço</label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Instagram</label>
              <input type="text" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Facebook</label>
              <input type="text" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} className="w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h3 className="font-bold text-gray-800 mb-3">Entrega e Pedidos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <label className="flex items-center gap-2 text-sm p-3 bg-gray-50 rounded-lg">
              <input type="checkbox" checked={form.deliveryEnabled} onChange={(e) => setForm({ ...form, deliveryEnabled: e.target.checked })} />
              🛵 Entrega
            </label>
            <label className="flex items-center gap-2 text-sm p-3 bg-gray-50 rounded-lg">
              <input type="checkbox" checked={form.pickupEnabled} onChange={(e) => setForm({ ...form, pickupEnabled: e.target.checked })} />
              🏪 Retirada
            </label>
            <label className="flex items-center gap-2 text-sm p-3 bg-gray-50 rounded-lg">
              <input type="checkbox" checked={form.dineInEnabled} onChange={(e) => setForm({ ...form, dineInEnabled: e.target.checked })} />
              🍽️ No local
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Taxa de Entrega (R$)</label>
              <input type="number" step="0.50" value={form.deliveryFee} onChange={(e) => setForm({ ...form, deliveryFee: parseFloat(e.target.value) || 0 })} className="w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Pedido Mínimo (R$)</label>
              <input type="number" step="0.50" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: parseFloat(e.target.value) || 0 })} className="w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
          </div>
        </div>

        {/* Neighborhoods */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h3 className="font-bold text-gray-800 mb-3">Taxas por Bairro</h3>
          <div className="space-y-2">
            {form.neighborhoods.map((n, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="text" value={n.name} onChange={(e) => {
                  const updated = [...form.neighborhoods];
                  updated[i] = { ...updated[i], name: e.target.value };
                  setForm({ ...form, neighborhoods: updated });
                }} className="flex-1 p-2 border rounded-lg text-sm" placeholder="Bairro" />
                <input type="number" step="0.50" value={n.fee} onChange={(e) => {
                  const updated = [...form.neighborhoods];
                  updated[i] = { ...updated[i], fee: parseFloat(e.target.value) || 0 };
                  setForm({ ...form, neighborhoods: updated });
                }} className="w-24 p-2 border rounded-lg text-sm" placeholder="Taxa" />
                <button onClick={() => setForm({ ...form, neighborhoods: form.neighborhoods.filter((_, idx) => idx !== i) })} className="p-2 text-red-500 hover:bg-red-50 rounded">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button onClick={() => setForm({ ...form, neighborhoods: [...form.neighborhoods, { name: '', fee: 0 }] })} className="text-sm text-orange-600 hover:underline flex items-center gap-1">
              <Plus size={14} /> Adicionar bairro
            </button>
          </div>
        </div>

        <button onClick={handleSave} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition">
          {saved ? '✅ Salvo!' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
    yellow: 'bg-yellow-50 border-yellow-100',
    purple: 'bg-purple-50 border-purple-100',
  };
  return (
    <div className={`rounded-xl p-4 border ${colors[color] || 'bg-white border-gray-100'}`}>
      <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-gray-500">{label}</span></div>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<OrderStatus, { label: string; class: string }> = {
    pending: { label: '🔵 Novo', class: 'bg-blue-100 text-blue-700' },
    confirmed: { label: '✅ Confirmado', class: 'bg-indigo-100 text-indigo-700' },
    preparing: { label: '🟡 Preparando', class: 'bg-yellow-100 text-yellow-700' },
    ready: { label: '🟢 Pronto', class: 'bg-green-100 text-green-700' },
    delivering: { label: '🛵 Em Entrega', class: 'bg-purple-100 text-purple-700' },
    delivered: { label: '⚫ Entregue', class: 'bg-gray-100 text-gray-700' },
    cancelled: { label: '❌ Cancelado', class: 'bg-red-100 text-red-700' },
  };
  const c = config[status];
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.class}`}>{c.label}</span>;
}
