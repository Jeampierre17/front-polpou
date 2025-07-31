// import { Toaster } from 'sonner';
import { PageTitleProvider } from './hooks/usePageTitle';
import  {Suspense}  from 'react';
import Layout from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import Kanban from './pages/Kanban';
import Products from './pages/Products';
import ThemeDemo from './components/ThemeDemo';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './hooks/useTheme';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoadingSpinner from './components/LoadingSpinner';
import Home from './pages/Home';



function App() {
  const location = useLocation();
  return (
    <ThemeProvider>
      <PageTitleProvider>
        <ErrorBoundary fallback={<Layout><ErrorFallback /></Layout>}>
          <Layout>
            <AnimatePresence mode="wait" initial={false}>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Home onNavigate={() => {}} />} />
                  <Route path="/kanban" element={<Kanban />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/theme" element={<ThemeDemo />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AnimatePresence>
          </Layout>
        </ErrorBoundary>
      </PageTitleProvider>
    </ThemeProvider>
  );
}

function ErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
      <h2 className="text-2xl font-bold text-red-600 mb-2">¡Algo salió mal!</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">Ocurrió un error inesperado. Por favor, recarga la página o intenta más tarde.</p>
      <button className="mt-4 px-5 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow transition" onClick={() => window.location.reload()}>
        Recargar página
      </button>
    </div>
  );
}

export default App;
