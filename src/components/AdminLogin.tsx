import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, User, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const { login, setView } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      setView('admin');
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <button onClick={() => setView('menu')} className="flex items-center gap-1 text-gray-500 text-sm mb-6 hover:text-gray-700">
          <ArrowLeft size={16} /> Voltar ao cardápio
        </button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Painel Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Faça login para acessar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text" placeholder="Usuário" value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password" placeholder="Senha" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition">
            Entrar
          </button>
        </form>

        <div className="mt-6 bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500">Demo: <strong>admin</strong> / <strong>admin123</strong></p>
        </div>
      </div>
    </div>
  );
}
