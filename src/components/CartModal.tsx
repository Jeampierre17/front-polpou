import React, { Suspense, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'sonner';
import { useCart } from '../hooks/useCart';

interface CartModalProps {
  show: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ show, onClose }) => {
  const { cart, incrementCartItem, decrementCartItem, clearCart } = useCart();
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300); // Duración igual a la animación
  };

  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 text-white text-xl">
        <svg className="animate-spin h-12 w-12 text-pink-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8" strokeWidth="4" className="opacity-75" /></svg>
        <span className="text-pink-200 font-semibold text-2xl flex items-center gap-2">✅ Cargando carrito...</span>
      </div>
    }>
      <Transition
        show={show}
        as={React.Fragment}
        enter="transition-all duration-700 ease-in-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-all duration-600 ease-in-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >

        <Dialog as="div" className="fixed inset-0 z-[100] overflow-y-auto"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.10) 100%)',
            backdropFilter: 'blur(2px)',
            transition: 'background 0.7s cubic-bezier(.28,.84,.42,1)'
          }}
          onClose={onClose}>
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Fondo oscuro */}
            <Transition
              show={show}
              as={React.Fragment}
              enter="transition-opacity duration-900 ease-[cubic-bezier(.28,.84,.42,1)]"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-700 ease-[cubic-bezier(.55,0,.1,1)]"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
            </Transition>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            {/* Contenido del modal */}
            <Transition
              show={show}
              as={React.Fragment}
              enter="transition-all duration-900 ease-[cubic-bezier(.28,.84,.42,1)]"
              enterFrom="opacity-0 translate-y-12 sm:scale-95 blur-sm"
              enterTo="opacity-100 translate-y-0 sm:scale-100 blur-0"
              leave="transition-all duration-700 ease-[cubic-bezier(.55,0,.1,1)]"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100 blur-0"
              leaveTo="opacity-0 translate-y-12 sm:scale-95 blur-sm"
            >
              <div
                className={`inline-block align-bottom bg-white dark:bg-gray-700 rounded-3xl px-6 pt-8 pb-6 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full max-w-lg md:max-w-xl
                  ${closing ? 'animate-[zoomOut_0.3s_ease-in_forwards]' : 'animate-[zoomIn_0.3s_ease-out_forwards]'}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl md:text-4xl text-pink-600">🛒</span>
                    <Dialog.Title as="h3" className="text-2xl md:text-3xl font-bold leading-7 text-gray-900 dark:text-white">Carrito</Dialog.Title>
                  </div>
                  <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <span className="text-2xl">×</span>
                  </button>
                </div>
                {cart.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-12 text-lg">El carrito está vacío.</div>
                ) : (
                  <>
                    <div className="flex flex-col gap-5 max-h-[340px] md:max-h-[420px] overflow-y-auto pr-1">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-3 last:border-b-0">
                          <img src={item.thumbnail} alt={item.title} className="w-20 h-20 object-cover rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 font-quicksand dark:text-white text-base md:text-lg leading-tight line-clamp-2">{item.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-bold text-lg flex items-center justify-center transition"
                                onClick={() => {
                                  decrementCartItem(item.id);
                                  toast.success(`Quitaste una unidad de ${item.title}`);
                                }}
                                aria-label="Disminuir cantidad"
                                disabled={item.quantity <= 1}
                              >-</button>
                              <span className="px-2 text-base font-semibold text-gray-900 dark:text-white select-none">{item.quantity}</span>
                              <button
                                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-bold text-lg flex items-center justify-center transition"
                                onClick={() => {
                                  incrementCartItem(item.id);
                                  toast.success(`Agregaste una unidad de ${item.title}`);
                                }}
                                aria-label="Aumentar cantidad"
                              >+</button>
                            </div>

                          </div><div className="text-pink-800 font-quicksand dark:text-pink-400 font-bold text-lg md:text-xl mt-1">
                            {(item.price * item.quantity).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Total y acciones */}
                    <div className="mt-8 flex flex-col gap-4">
                      <div className="flex justify-between items-center text-lg md:text-xl font-bold border-t border-gray-200 dark:border-gray-800 pt-4">
                        <span>Total</span>
                        <span className="text-pink-600 text-xl font-quicksand dark:text-pink-400">{cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={clearCart}
                          className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200 rounded-xl px-4 py-3 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition text-base md:text-lg"
                          disabled={cart.length === 0}
                        >
                          Vaciar carrito
                        </button>
                        <button
                          onClick={onClose}
                          className="flex-1 bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-4 py-3 font-bold text-base md:text-lg transition"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Transition>
          </div>
        </Dialog>
      </Transition>
    </Suspense>
  );
};

export default CartModal;
