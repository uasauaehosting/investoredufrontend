import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Pages
import NewsDetail from './pages/NewsDetail';
import Glossary from './pages/Glossary';
import About from './pages/About';
import Feedback from './pages/Feedback';
import MembersStrategiesProjects from './pages/MembersStrategiesProjects';
import EducationSectionList from './pages/EducationSectionList';
import EducationItemDetail from './pages/EducationItemDetail';
import Principles from './pages/Principles';
import PrincipleDetail from './pages/PrincipleDetail';
import Framework from './pages/Framework';
import FrameworkDetail from './pages/FrameworkDetail';
import InvestmentProductsLiterature from './pages/InvestmentProductsLiterature';
import InvestmentProductDetail from './pages/InvestmentProductDetail';
import TheIndex from './pages/TheIndex';
import MembersBenchmarking from './pages/MembersBenchmarking';
import Portals from './pages/Portals';
import Publications from './pages/Publications';
import Programs from './pages/Programs';
import AlertsBulletins from './pages/AlertsBulletins';
import GlobalPolicyAreas from './pages/GlobalPolicyAreas';
import AdditionalResources from './pages/AdditionalResources';

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
                <Routes>
                  <Route path="/" element={<Home />} />
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
                    path="/education/reading-materials/products/:slug"
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
                  {/* Redirect old # links if necessary or handle 404 */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
