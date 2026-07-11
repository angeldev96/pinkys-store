import Link from 'next/link';
import { Home, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-pink-600" />
        </div>
        <h1 className="font-display text-6xl font-bold text-pink-600 mb-2">404</h1>
        <p className="text-xl text-gray-700 font-medium mb-2">Página no encontrada</p>
        <p className="text-gray-500 mb-8">
          Lo sentimos, la página que buscas no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
        >
          <Home className="w-4 h-4" />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
