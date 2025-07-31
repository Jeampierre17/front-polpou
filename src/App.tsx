import { PageTitleProvider, usePageTitle } from './hooks/usePageTitle';
import React, { Suspense, useEffect } from 'react';
import Layout from './components/Layout';
import Kanban from './pages/Kanban';
import Products from './pages/Products';
import ThemeDemo from './components/ThemeDemo';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './hooks/useTheme';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import Home from './pages/Home';




function App() {
  return (
    <ThemeProvider>
      <PageTitleProvider>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home onNavigate={() => {}} />} />
              <Route path="/kanban" element={<Kanban />} />
              <Route path="/products" element={<Products />} />
              <Route path="/theme" element={<ThemeDemo />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </PageTitleProvider>
    </ThemeProvider>
  );
}

export default App;
