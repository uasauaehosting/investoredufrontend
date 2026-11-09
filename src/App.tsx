import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import WelcomeSection from './components/WelcomeSection';
import NewsSection from './components/NewsSection';
import MembersSection from './components/MembersSection';
import PortalSection from './components/PortalSection';
import Footer from './components/Footer';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import { useAuth } from './lib/useAuth';

// Pages — lazy loaded so each route is a separate chunk
const NewsList                   = lazy(() => import('./pages/NewsList'));
const NewsDetail                 = lazy(() => import('./pages/NewsDetail'));
const Glossary                   = lazy(() => import('./pages/Glossary'));
const About                      = lazy(() => import('./pages/About'));
const Feedback                   = lazy(() => import('./pages/Feedback'));
const MembersStrategiesProjects  = lazy(() => import('./pages/MembersStrategiesProjects'));
const EducationSectionList       = lazy(() => import('./pages/EducationSectionList'));
const EducationItemDetail        = lazy(() => import('./pages/EducationItemDetail'));
const Principles                 = lazy(() => import('./pages/Principles'));
const PrincipleDetail            = lazy(() => import('./pages/PrincipleDetail'));
const Framework                  = lazy(() => import('./pages/Framework'));
const FrameworkDetail            = lazy(() => import('./pages/FrameworkDetail'));
const InvestmentProductsLiterature = lazy(() => import('./pages/InvestmentProductsLiterature'));
const InvestmentProductDetail    = lazy(() => import('./pages/InvestmentProductDetail'));
const TheIndex                   = lazy(() => import('./pages/TheIndex'));
const MembersBenchmarking        = lazy(() => import('./pages/MembersBenchmarking'));
const Portals                    = lazy(() => import('./pages/Portals'));
const Publications               = lazy(() => import('./pages/Publications'));
const Programs                   = lazy(() => import('./pages/Programs'));
const AlertsBulletins            = lazy(() => import('./pages/AlertsBulletins'));
const GlobalPolicyAreas          = lazy(() => import('./pages/GlobalPolicyAreas'));
const AdditionalResources        = lazy(() => import('./pages/AdditionalResources'));

function PageLoader() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#009900]/20 border-t-[#009900] rounded-full animate-spin" />
    </div>
  );
}

function Home() {
  return (
    <>
      <HeroSlider />
      <WelcomeSection />
      <NewsSection />
      <MembersSection />
      <PortalSection />
    </>
  );
}

function AdminRouter() {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#009900] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/20 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }
  return session ? <AdminDashboard /> : <AdminLogin />;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRouter />} />

        {/* Public Routes */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/news" element={<NewsList />} />
                    <Route path="/news/:id" element={<NewsDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/education" element={<Navigate to="/" replace />} />
                    <Route path="/education/reading-materials/principles" element={<Principles />} />
                    <Route path="/education/reading-materials/principles/:id" element={<PrincipleDetail />} />
                    <Route path="/education/reading-materials/framework" element={<Framework />} />
                    <Route path="/education/reading-materials/framework/:id" element={<FrameworkDetail />} />
                    <Route
                      path="/education/reading-materials/products"
                      element={<InvestmentProductsLiterature />}
                    />
                    <Route
                      path="/education/reading-materials/products/:id"
                      element={<InvestmentProductDetail />}
                    />
                    <Route path="/education/members-activities/portals" element={<Portals />} />
                    <Route path="/education/members-activities/publications" element={<Publications />} />
                    <Route path="/education/members-activities/programs" element={<Programs />} />
                    <Route path="/education/alerts" element={<AlertsBulletins />} />
                    <Route path="/education/:section" element={<EducationSectionList />} />
                    <Route path="/education/:section/:id" element={<EducationItemDetail />} />
                    <Route path="/inclusion" element={<Navigate to="/" replace />} />
                    <Route path="/inclusion/projects" element={<MembersStrategiesProjects />} />
                    <Route path="/inclusion/policies" element={<GlobalPolicyAreas />} />
                    <Route path="/inclusion/index/the-index" element={<TheIndex />} />
                    <Route path="/inclusion/index/benchmarking" element={<MembersBenchmarking />} />
                    <Route path="/inclusion/index/resources" element={<AdditionalResources />} />
                    <Route path="/glossary" element={<Glossary />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
