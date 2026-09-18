import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ComplementGroup } from '../types';
import { Search, ShoppingCart, X, Plus, Minus, Star, Clock, MapPin, Phone, Instagram, ChevronRight } from 'lucide-react';

export default function ClientMenu() {
  const { categories, products, settings, selectedCategory, setSelectedCategory, selectedProduct, setSelectedProduct, addToCart, getCartTotal, getCartCount, setView, currentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplements, setSelectedComplements] = useState<{ [groupId: string]: string[] }>({});
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState('');

  const activeCategories = categories.filter(c => c.active).sort((a, b) => a.order - b.order);
  const availableProducts = products.filter(p => p.available);
  
  const filteredProducts = selectedCategory
    ? availableProducts.filter(p => p.categoryId === selectedCategory)
    : availableProducts;

  const searchResults = searchTerm
    ? availableProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    : null;

  const featuredProducts = availableProducts.filter(p => p.featured);

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setSelectedComplements({});
    setQuantity(1);
    setObservations('');
  };

  const toggleComplement = (group: ComplementGroup, itemId: string) => {
    setSelectedComplements(prev => {
      const current = prev[group.id] || [];
      if (group.type === 'single') {
        return { ...prev, [group.id]: current.includes(itemId) ? [] : [itemId] };
      } else {
        if (current.includes(itemId)) {
          return { ...prev, [group.id]: current.filter(id => id !== itemId) };
        }
        if (current.length >= group.maxItems) return prev;
        return { ...prev, [group.id]: [...current, itemId] };
      }
    });
  };

  const calculateProductTotal = (product: Product): number => {
    let total = product.promoPrice || product.price;
    product.complementGroups.forEach(group => {
      const selected = selectedComplements[group.id] || [];
      selected.forEach(itemId => {
        const item = group.items.find(i => i.id === itemId);
        if (item) total += item.price;
      });
    });
    return total * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const unitPrice = calculateProductTotal(selectedProduct) / quantity;
    addToCart({
      product: selectedProduct,
      quantity,
      observations,
      selectedComplements,
      totalPrice: unitPrice * quantity,
    });
    setSelectedProduct(null);
  };

  const currentCategoryName = activeCategories.find(c => c.id === selectedCategory)?.name || 'Cardápio';

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{settings.logo}</span>
              <div>
                <h1 className="text-xl font-bold">{settings.name}</h1>
                <p className="text-orange-100 text-sm">{settings.description.substring(0, 50)}...</p>
              </div>
            </div>
            <button onClick={() => setView('admin-login')} className="text-xs bg-white/20 px-2 py-1 rounded">
              Admin
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-orange-100 mb-4">
            <span className="flex items-center gap-1"><Clock size={12} /> 11h - 23h</span>
            <span className="flex items-center gap-1"><MapPin size={12} /> Centro</span>
            <span className="flex items-center gap-1"><Phone size={12} /> {settings.phone}</span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="O que você está procurando?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 text-sm bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={18} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="max-w-lg mx-auto px-4 py-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            Resultados para "{searchTerm}" ({searchResults.length})
          </h2>
          <div className="space-y-3">
            {searchResults.map(product => (
              <ProductCard key={product.id} product={product} onClick={() => openProductDetail(product)} />
            ))}
            {searchResults.length === 0 && (
              <p className="text-gray-500 text-center py-8">Nenhum produto encontrado</p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      {!searchTerm && !selectedProduct && (
        <div className="max-w-lg mx-auto">
          {/* Featured */}
          {!selectedCategory && (
            <div className="px-4 py-4">
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Star size={18} className="text-yellow-500" /> Destaques
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {featuredProducts.map(product => (
                  <div key={product.id} onClick={() => openProductDetail(product)}
                    className="min-w-[140px] bg-white rounded-xl shadow-sm p-3 cursor-pointer hover:shadow-md transition border border-orange-100">
                    <div className="text-3xl text-center mb-2">{product.image}</div>
                    <h3 className="font-semibold text-sm text-gray-800 truncate">{product.name}</h3>
                    <p className="text-orange-600 font-bold text-sm">
                      {product.promoPrice ? `R$ ${product.promoPrice.toFixed(2)}` : `R$ ${product.price.toFixed(2)}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          <div className="px-4 py-2">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${!selectedCategory ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border'}`}
              >
                Todos
              </button>
              {activeCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition flex items-center gap-1 ${selectedCategory === cat.id ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border'}`}
                >
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products List */}
          <div className="px-4 py-2">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              {selectedCategory ? currentCategoryName : 'Cardápio Completo'}
            </h2>
            <div className="space-y-3">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onClick={() => openProductDetail(product)} />
              ))}
              {filteredProducts.length === 0 && (
                <p className="text-gray-500 text-center py-8">Nenhum produto disponível nesta categoria</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl">
            <div className="sticky top-0 bg-white z-10 p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">{selectedProduct.name}</h2>
              <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="text-center text-6xl mb-4">{selectedProduct.image}</div>
              
              <div className="flex items-center gap-2 mb-2">
                {selectedProduct.tags.map(tag => (
                  <span key={tag} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>

              <p className="text-gray-600 text-sm mb-3">{selectedProduct.description}</p>
              
              {selectedProduct.ingredients && (
                <p className="text-gray-500 text-xs mb-3">📋 {selectedProduct.ingredients}</p>
              )}
              
              {selectedProduct.prepTime && (
                <p className="text-gray-500 text-xs mb-4 flex items-center gap-1">
                  <Clock size={12} /> {selectedProduct.prepTime}
                </p>
              )}

              <div className="flex items-center gap-2 mb-4">
                {selectedProduct.promoPrice ? (
                  <>
                    <span className="text-2xl font-bold text-orange-600">R$ {selectedProduct.promoPrice.toFixed(2)}</span>
                    <span className="text-sm text-gray-400 line-through">R$ {selectedProduct.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-orange-600">R$ {selectedProduct.price.toFixed(2)}</span>
                )}
              </div>

              {/* Complement Groups */}
              {selectedProduct.complementGroups.map(group => (
                <div key={group.id} className="mb-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {group.name}
                    <span className="text-xs text-gray-500 font-normal ml-2">
                      ({group.type === 'single' ? 'Escolha 1' : `Até ${group.maxItems}`})
                    </span>
                  </h3>
                  {group.items.map(item => {
                    const isSelected = (selectedComplements[group.id] || []).includes(item.id);
                    return (
                      <label key={item.id} className={`flex items-center justify-between p-3 rounded-lg mb-2 cursor-pointer transition ${isSelected ? 'bg-orange-50 border-2 border-orange-300' : 'bg-gray-50 border-2 border-transparent'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span className="text-sm text-gray-700">{item.name}</span>
                        </div>
                        <span className={`text-sm font-medium ${item.price > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                          {item.price > 0 ? `+ R$ ${item.price.toFixed(2)}` : 'Grátis'}
                        </span>
                        <input
                          type={group.type === 'single' ? 'radio' : 'checkbox'}
                          checked={isSelected}
                          onChange={() => toggleComplement(group, item.id)}
                          className="hidden"
                        />
                      </label>
                    );
                  })}
                </div>
              ))}

              {/* Observations */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Ex: Sem cebola, bem passado..."
                  className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                  rows={2}
                />
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-gray-700">Quantidade</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
              >
                Adicionar — R$ {calculateProductTotal(selectedProduct).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {getCartCount() > 0 && currentView === 'menu' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent z-40">
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => setView('cart')}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition flex items-center justify-between px-6"
            >
              <div className="flex items-center gap-2">
                <div className="bg-white/20 rounded-full w-7 h-7 flex items-center justify-center text-sm">
                  {getCartCount()}
                </div>
                <span>Ver meu pedido</span>
              </div>
              <div className="flex items-center gap-1">
                <span>R$ {getCartTotal().toFixed(2)}</span>
                <ChevronRight size={18} />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow-sm p-4 flex gap-4 cursor-pointer hover:shadow-md transition border border-gray-100">
      <div className="text-4xl flex-shrink-0">{product.image}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-800 text-sm">{product.name}</h3>
          <div className="flex flex-col items-end">
            {product.promoPrice ? (
              <>
                <span className="text-orange-600 font-bold text-sm">R$ {product.promoPrice.toFixed(2)}</span>
                <span className="text-gray-400 text-xs line-through">R$ {product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-orange-600 font-bold text-sm">R$ {product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mt-2">
          {product.tags.map(tag => (
            <span key={tag} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
          {!product.available && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Indisponível</span>}
        </div>
      </div>
    </div>
  );
}
