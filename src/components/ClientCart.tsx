import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CartItem, Order, CustomerData } from '../types';
import { ArrowLeft, Plus, Minus, Trash2, MapPin, Store, UtensilsCrossed, CreditCard, Banknote, QrCode, CheckCircle, MessageCircle, X } from 'lucide-react';

export default function ClientCart() {
  const { cart, removeFromCart, updateCartItem, clearCart, getCartTotal, settings, addOrder, setView, setCurrentOrder } = useApp();
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup' | 'dine-in'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [changeFor, setChangeFor] = useState('');
  const [customer, setCustomer] = useState<CustomerData>({ name: '', phone: '', address: { cep: '', street: '', number: '', complement: '', neighborhood: '', reference: '' } });
  const [orderNumber, setOrderNumber] = useState(0);

  const subtotal = getCartTotal();
  const deliveryFee = orderType === 'delivery' ? settings.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) { removeFromCart(index); return; }
    const item = cart[index];
    const unitPrice = item.totalPrice / item.quantity;
    updateCartItem(index, { ...item, quantity: newQty, totalPrice: unitPrice * newQty });
  };

  const handleConfirmOrder = () => {
    if (!customer.name || !customer.phone) { alert('Preencha nome e telefone'); return; }
    if (orderType === 'delivery' && (!customer.address?.street || !customer.address?.neighborhood)) {
      alert('Preencha o endereço de entrega'); return;
    }

    const order: Order = {
      id: Date.now().toString(),
      number: Math.floor(Math.random() * 9000) + 1000,
      customer: { ...customer, address: orderType === 'delivery' ? customer.address : undefined },
      items: cart,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      changeFor: paymentMethod === 'cash' && changeFor ? parseFloat(changeFor) : undefined,
      orderType,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    addOrder(order);
    setOrderNumber(order.number);
    setCurrentOrder(order);
    clearCart();
    setStep('confirmation');
  };

  const sendWhatsApp = () => {
    const items = cart.map(item => `${item.quantity}x ${item.product.name} — R$ ${item.totalPrice.toFixed(2)}`).join('\n');
    const msg = `Olá! Gostaria de fazer um pedido.\n\nPedido #${orderNumber}\n\n${items}\n\n${orderType === 'delivery' ? `Entrega: R$ ${deliveryFee.toFixed(2)}` : 'Retirada no local'}\n\nTotal: R$ ${total.toFixed(2)}\n\nCliente: ${customer.name}\nTelefone: ${customer.phone}${customer.address ? `\nEndereço: ${customer.address.street}, ${customer.address.number} - ${customer.address.neighborhood}` : ''}`;
    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido #{orderNumber}</h2>
          <p className="text-green-600 font-medium mb-4">✅ Pedido recebido!</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-700 mb-2">Resumo</h3>
            <p className="text-sm text-gray-600 mb-1">Total: <span className="font-bold text-orange-600">R$ {total.toFixed(2)}</span></p>
            <p className="text-sm text-gray-600">Pagamento: <span className="font-medium">{getPaymentLabel(paymentMethod)}</span></p>
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm text-gray-500">Status:</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-yellow-600">Aguardando confirmação</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <button onClick={sendWhatsApp} className="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition flex items-center justify-center gap-2">
              <MessageCircle size={18} /> Enviar pelo WhatsApp
            </button>
            <button onClick={() => { setView('menu'); setStep('cart'); }} className="w-full bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition">
              Voltar ao Cardápio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => step === 'checkout' ? setStep('cart') : setView('menu')} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">
            {step === 'cart' ? 'Meu Pedido' : 'Finalizar Pedido'}
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        {step === 'cart' && (
          <>
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🛒</div>
                <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
                <button onClick={() => setView('menu')} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition">
                  Ver Cardápio
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3 mb-4">
                  {cart.map((item, index) => (
                    <CartItemCard key={index} item={item} index={index} updateQuantity={updateQuantity} removeItem={removeFromCart} />
                  ))}
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-xl p-4 shadow-sm border">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                    <span>Total</span>
                    <span className="text-orange-600">R$ {subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep('checkout')}
                  className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg mt-4 hover:bg-orange-600 transition"
                >
                  Continuar
                </button>
              </>
            )}
          </>
        )}

        {step === 'checkout' && (
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <h3 className="font-bold text-gray-800 mb-3">Seus dados</h3>
              <input
                type="text" placeholder="Nome completo *" value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                className="w-full p-3 border rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <input
                type="tel" placeholder="Telefone *" value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            {/* Order Type */}
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <h3 className="font-bold text-gray-800 mb-3">Tipo do pedido</h3>
              <div className="grid grid-cols-3 gap-2">
                {settings.deliveryEnabled && (
                  <button onClick={() => setOrderType('delivery')} className={`p-3 rounded-xl text-center text-xs font-medium transition ${orderType === 'delivery' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <MapPin size={20} className="mx-auto mb-1" /> Entrega
                  </button>
                )}
                {settings.pickupEnabled && (
                  <button onClick={() => setOrderType('pickup')} className={`p-3 rounded-xl text-center text-xs font-medium transition ${orderType === 'pickup' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Store size={20} className="mx-auto mb-1" /> Retirada
                  </button>
                )}
                {settings.dineInEnabled && (
                  <button onClick={() => setOrderType('dine-in')} className={`p-3 rounded-xl text-center text-xs font-medium transition ${orderType === 'dine-in' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <UtensilsCrossed size={20} className="mx-auto mb-1" /> No local
                  </button>
                )}
              </div>
            </div>

            {/* Address (if delivery) */}
            {orderType === 'delivery' && customer.address && (
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="font-bold text-gray-800 mb-3">Endereço de entrega</h3>
                <div className="space-y-2">
                  <input type="text" placeholder="CEP" value={customer.address.cep} onChange={(e) => setCustomer({ ...customer, address: { ...customer.address!, cep: e.target.value } })} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  <input type="text" placeholder="Rua *" value={customer.address.street} onChange={(e) => setCustomer({ ...customer, address: { ...customer.address!, street: e.target.value } })} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  <div className="flex gap-2">
                    <input type="text" placeholder="Número" value={customer.address.number} onChange={(e) => setCustomer({ ...customer, address: { ...customer.address!, number: e.target.value } })} className="flex-1 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                    <input type="text" placeholder="Complemento" value={customer.address.complement} onChange={(e) => setCustomer({ ...customer, address: { ...customer.address!, complement: e.target.value } })} className="flex-1 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  </div>
                  <input type="text" placeholder="Bairro *" value={customer.address.neighborhood} onChange={(e) => setCustomer({ ...customer, address: { ...customer.address!, neighborhood: e.target.value } })} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  <input type="text" placeholder="Referência" value={customer.address.reference} onChange={(e) => setCustomer({ ...customer, address: { ...customer.address!, reference: e.target.value } })} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <h3 className="font-bold text-gray-800 mb-3">Forma de pagamento</h3>
              <div className="space-y-2">
                {[
                  { value: 'pix', label: 'PIX', icon: <QrCode size={18} /> },
                  { value: 'card_credit', label: 'Cartão de Crédito', icon: <CreditCard size={18} /> },
                  { value: 'card_debit', label: 'Cartão de Débito', icon: <CreditCard size={18} /> },
                  { value: 'cash', label: 'Dinheiro', icon: <Banknote size={18} /> },
                ].map(method => (
                  <label key={method.value} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${paymentMethod === method.value ? 'bg-orange-50 border-2 border-orange-300' : 'bg-gray-50 border-2 border-transparent'}`}>
                    <input type="radio" name="payment" value={method.value} checked={paymentMethod === method.value} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.value ? 'border-orange-500' : 'border-gray-300'}`}>
                      {paymentMethod === method.value && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                    </div>
                    <span className="text-gray-700 flex items-center gap-2">{method.icon} {method.label}</span>
                  </label>
                ))}
              </div>
              {paymentMethod === 'cash' && (
                <div className="mt-3">
                  <label className="text-sm text-gray-600 mb-1 block">Precisa de troco? Para quanto?</label>
                  <input type="number" placeholder="Ex: 100" value={changeFor} onChange={(e) => setChangeFor(e.target.value)} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <h3 className="font-bold text-gray-800 mb-3">Resumo do pedido</h3>
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span>R$ {item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Taxa de entrega</span><span>R$ {deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-800 mt-2">
                  <span>Total</span><span className="text-orange-600">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button onClick={handleConfirmOrder} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition">
              Confirmar Pedido — R$ {total.toFixed(2)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CartItemCard({ item, index, updateQuantity, removeItem }: { item: CartItem; index: number; updateQuantity: (i: number, q: number) => void; removeItem: (i: number) => void }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border flex gap-3">
      <div className="text-2xl">{item.product.image}</div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-800 text-sm">{item.product.name}</h3>
          <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 p-1">
            <Trash2 size={14} />
          </button>
        </div>
        {item.observations && <p className="text-xs text-gray-500 mt-0.5">Obs: {item.observations}</p>}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button onClick={() => updateQuantity(index, item.quantity - 1)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <Minus size={12} />
            </button>
            <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
            <button onClick={() => updateQuantity(index, item.quantity + 1)} className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200">
              <Plus size={12} />
            </button>
          </div>
          <span className="font-bold text-orange-600 text-sm">R$ {item.totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function getPaymentLabel(method: string): string {
  const labels: Record<string, string> = { pix: 'PIX', card_credit: 'Cartão de Crédito', card_debit: 'Cartão de Débito', cash: 'Dinheiro' };
  return labels[method] || method;
}
