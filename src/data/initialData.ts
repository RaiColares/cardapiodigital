import { Category, Product, StoreSettings, Order } from '../types';

export const initialCategories: Category[] = [
  { id: '1', name: 'Hambúrgueres', icon: '🍔', description: 'Nossos deliciosos hambúrgueres artesanais', order: 1, active: true },
  { id: '2', name: 'Porções', icon: '🍟', description: 'Porções para compartilhar', order: 2, active: true },
  { id: '3', name: 'Combos', icon: '🌭', description: 'Combos especiais com desconto', order: 3, active: true },
  { id: '4', name: 'Bebidas', icon: '🥤', description: 'Bebidas geladas e sucos', order: 4, active: true },
  { id: '5', name: 'Sobremesas', icon: '🍰', description: 'Doces irresistíveis', order: 5, active: true },
  { id: '6', name: 'Drinks', icon: '🍹', description: 'Drinks e coquetéis', order: 6, active: true },
];

export const initialProducts: Product[] = [
  {
    id: '1', name: 'X-Bacon', categoryId: '1', description: 'Pão brioche, hambúrguer 180g, queijo cheddar, bacon crocante, alface, tomate e molho especial',
    price: 28.90, promoPrice: 24.90, image: '🍔', available: true, featured: true, isNew: false,
    tags: ['⭐ Mais vendido'], ingredients: 'Pão, carne, bacon, queijo, alface, tomate', prepTime: '15-20 min', order: 1,
    complementGroups: [{
      id: 'g1', name: 'Escolha o molho', type: 'single', minItems: 0, maxItems: 1,
      items: [{ id: 'c1', name: 'Ketchup', price: 0 }, { id: 'c2', name: 'Barbecue', price: 0 }, { id: 'c3', name: 'Molho Especial', price: 0 }]
    }, {
      id: 'g2', name: 'Adicionais', type: 'multiple', minItems: 0, maxItems: 5,
      items: [{ id: 'c4', name: 'Bacon extra', price: 5 }, { id: 'c5', name: 'Queijo extra', price: 3 }, { id: 'c6', name: 'Ovo', price: 2 }]
    }]
  },
  {
    id: '2', name: 'X-Tudo', categoryId: '1', description: 'Pão, hambúrguer 180g, presunto, ovo, bacon, queijo, alface, tomate, milho, batata palha e molho',
    price: 32.90, image: '🍔', available: true, featured: true, isNew: false,
    tags: ['🔥 Grande'], ingredients: 'Pão, carne, presunto, ovo, bacon, queijo, salada completa', prepTime: '20-25 min', order: 2,
    complementGroups: [{
      id: 'g3', name: 'Escolha o molho', type: 'single', minItems: 0, maxItems: 1,
      items: [{ id: 'c7', name: 'Ketchup', price: 0 }, { id: 'c8', name: 'Maionese', price: 0 }, { id: 'c9', name: 'Barbecue', price: 0 }]
    }]
  },
  {
    id: '3', name: 'X-Salada', categoryId: '1', description: 'Pão, hambúrguer 150g, queijo, alface, tomate e maionese',
    price: 19.90, image: '🥬', available: true, featured: false, isNew: false,
    tags: ['🥬 Leve'], ingredients: 'Pão, carne, queijo, alface, tomate', prepTime: '10-15 min', order: 3,
    complementGroups: []
  },
  {
    id: '4', name: 'Smash Burger Duplo', categoryId: '1', description: 'Dois smash burgers 90g, queijo cheddar derretido, cebola caramelizada e pickles',
    price: 35.90, image: '🍔', available: true, featured: true, isNew: true,
    tags: ['🆕 Novidade', '⭐ Mais vendido'], ingredients: 'Pão brioche, 2x carne smash, cheddar, cebola, pickles', prepTime: '15-20 min', order: 4,
    complementGroups: []
  },
  {
    id: '5', name: 'Batata Frita Grande', categoryId: '2', description: 'Porção de batata frita crocante com 400g',
    price: 22.90, image: '🍟', available: true, featured: false, isNew: false,
    tags: [], ingredients: 'Batata, óleo, sal', prepTime: '10-15 min', order: 1,
    complementGroups: [{
      id: 'g4', name: 'Molhos', type: 'multiple', minItems: 0, maxItems: 3,
      items: [{ id: 'c10', name: 'Ketchup', price: 0 }, { id: 'c11', name: 'Maionese', price: 0 }, { id: 'c12', name: 'Cheddar', price: 3 }]
    }]
  },
  {
    id: '6', name: 'Onion Rings', categoryId: '2', description: 'Anéis de cebola empanados e fritos - 300g',
    price: 19.90, image: '🧅', available: true, featured: false, isNew: true,
    tags: ['🆕 Novidade'], ingredients: 'Cebola, empanado, óleo', prepTime: '10-15 min', order: 2,
    complementGroups: []
  },
  {
    id: '7', name: 'Combo Família', categoryId: '3', description: '4 X-Bacon + 2 Batatas Grandes + 4 Refrigerantes',
    price: 129.90, promoPrice: 99.90, image: '🎉', available: true, featured: true, isNew: false,
    tags: ['🔥 Promoção'], ingredients: '4 hambúrgueres, 2 batatas, 4 refrigerantes', prepTime: '25-30 min', order: 1,
    complementGroups: []
  },
  {
    id: '8', name: 'Combo Individual', categoryId: '3', description: '1 X-Bacon + 1 Batata Média + 1 Refrigerante',
    price: 42.90, promoPrice: 34.90, image: '🍔', available: true, featured: true, isNew: false,
    tags: ['🔥 Promoção'], ingredients: '1 hambúrguer, 1 batata, 1 refrigerante', prepTime: '15-20 min', order: 2,
    complementGroups: []
  },
  {
    id: '9', name: 'Coca-Cola 350ml', categoryId: '4', description: 'Coca-Cola lata gelada',
    price: 6.00, image: '🥤', available: true, featured: false, isNew: false,
    tags: [], ingredients: '', prepTime: '1 min', order: 1,
    complementGroups: []
  },
  {
    id: '10', name: 'Suco Natural 500ml', categoryId: '4', description: 'Suco natural da fruta - Laranja, Limão, Maracujá ou Abacaxi',
    price: 10.00, image: '🧃', available: true, featured: false, isNew: false,
    tags: ['🥬 Natural'], ingredients: 'Fruta natural', prepTime: '5 min', order: 2,
    complementGroups: []
  },
  {
    id: '11', name: 'Pudim', categoryId: '5', description: 'Pudim de leite condensado caseiro',
    price: 12.00, image: '🍮', available: true, featured: false, isNew: false,
    tags: ['⭐ Mais vendido'], ingredients: 'Leite condensado, leite, ovos, açúcar', prepTime: '5 min', order: 1,
    complementGroups: []
  },
  {
    id: '12', name: 'Brownie com Sorvete', categoryId: '5', description: 'Brownie de chocolate quente com sorvete de creme',
    price: 18.00, image: '🍫', available: true, featured: true, isNew: true,
    tags: ['🆕 Novidade'], ingredients: 'Chocolate, manteiga, ovos, farinha, sorvete', prepTime: '5 min', order: 2,
    complementGroups: []
  },
  {
    id: '13', name: 'Caipirinha', categoryId: '6', description: 'Caipirinha tradicional de limão',
    price: 16.00, image: '🍹', available: true, featured: false, isNew: false,
    tags: [], ingredients: 'Cachaça, limão, açúcar, gelo', prepTime: '5 min', order: 1,
    complementGroups: []
  },
  {
    id: '14', name: 'Gin Tônica', categoryId: '6', description: 'Gin tônica com frutas vermelhas',
    price: 22.00, image: '🥂', available: true, featured: false, isNew: true,
    tags: ['🆕 Novidade'], ingredients: 'Gin, água tônica, frutas vermelhas', prepTime: '5 min', order: 2,
    complementGroups: []
  },
];

export const initialSettings: StoreSettings = {
  name: 'Hamburgueria do Raimundo',
  logo: '🍔',
  banner: '',
  description: 'Os melhores hambúrgueres da cidade! Feitos com ingredientes selecionados e muito amor.',
  phone: '(91) 3232-1234',
  whatsapp: '5591999991234',
  address: 'Rua dos Hambúrgueres, 123 - Centro, Belém - PA',
  instagram: '@hamburgueria.raimundo',
  facebook: 'hamburgueria.raimundo',
  openingHours: [
    { day: 'Segunda', open: '11:00', close: '23:00', closed: false },
    { day: 'Terça', open: '11:00', close: '23:00', closed: false },
    { day: 'Quarta', open: '11:00', close: '23:00', closed: false },
    { day: 'Quinta', open: '11:00', close: '23:00', closed: false },
    { day: 'Sexta', open: '11:00', close: '00:00', closed: false },
    { day: 'Sábado', open: '11:00', close: '00:00', closed: false },
    { day: 'Domingo', open: '11:00', close: '22:00', closed: false },
  ],
  deliveryEnabled: true,
  pickupEnabled: true,
  dineInEnabled: true,
  deliveryFee: 5.00,
  minOrder: 15.00,
  neighborhoods: [
    { name: 'Centro', fee: 5.00 },
    { name: 'Umarizal', fee: 7.00 },
    { name: 'Marco', fee: 8.00 },
    { name: 'Pedreira', fee: 6.00 },
    { name: 'Nazaré', fee: 5.50 },
    { name: 'Batista Campos', fee: 6.00 },
  ],
};

export const initialOrders: Order[] = [
  {
    id: '1', number: 1048, customer: { name: 'João Silva', phone: '(91) 99999-1111', address: { cep: '66000-000', street: 'Rua Exemplo', number: '45', complement: 'Apto 201', neighborhood: 'Centro', reference: 'Próximo à praça' } },
    items: [
      { product: initialProducts[0], quantity: 2, observations: 'Sem cebola', selectedComplements: { 'g1': ['c2'] }, totalPrice: 49.80 },
      { product: initialProducts[8], quantity: 2, observations: '', selectedComplements: {}, totalPrice: 12.00 },
    ],
    subtotal: 61.80, deliveryFee: 5.00, total: 66.80,
    paymentMethod: 'pix', orderType: 'delivery', status: 'preparing', createdAt: new Date().toISOString()
  },
  {
    id: '2', number: 1047, customer: { name: 'Maria Santos', phone: '(91) 99999-2222' },
    items: [
      { product: initialProducts[6], quantity: 1, observations: '', selectedComplements: {}, totalPrice: 99.90 },
    ],
    subtotal: 99.90, deliveryFee: 0, total: 99.90,
    paymentMethod: 'card_credit', orderType: 'pickup', status: 'delivered', createdAt: new Date(Date.now() - 3600000).toISOString()
  },
];
