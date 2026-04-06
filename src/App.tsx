import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cloud, 
  BookOpen, 
  GraduationCap, 
  LayoutGrid, 
  ChevronRight,
  ExternalLink,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { ServiceCard } from './components/ServiceCard';
import { Quiz } from './components/Quiz';
import { awsServices } from './data/awsData';
import { cn } from './lib/utils';

type Tab = 'catalog' | 'quiz';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('catalog');

  const tabs = [
    { id: 'catalog', label: 'Service Catalog', icon: LayoutGrid },
    { id: 'quiz', label: 'Knowledge Check', icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                <Cloud className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">CloudQuest</h1>
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest leading-none">AWS Learning Path</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeTab === tab.id 
                      ? "bg-slate-900 text-white shadow-md" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-lg text-sm font-semibold border border-orange-100 hover:bg-orange-100 transition-colors">
                <BookOpen className="w-4 h-4" />
                Docs
              </button>
              <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AWS" alt="User" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <AnimatePresence mode="wait">
          {activeTab === 'catalog' && (
            <motion.div
              key="catalog-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-2xl">
                  <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Master the <span className="text-orange-600">AWS Cloud</span>
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Explore the most popular AWS services. Learn their core functions, 
                    common use cases, and how they fit into modern architectures.
                  </p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-right px-4">
                    <p className="text-xs font-bold text-slate-400 uppercase">Your Progress</p>
                    <p className="text-xl font-bold text-slate-900">12 / 84 Services</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === 'catalog' && (
              <motion.div
                key="catalog"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {awsServices.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </motion.div>
            )}

            {activeTab === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Quiz />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Links / Resources */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-200 pt-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Official Documentation</h4>
            <p className="text-sm text-slate-600 mb-4">The ultimate source of truth for all AWS services and features.</p>
            <a href="https://docs.aws.amazon.com" target="_blank" className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline">
              Visit AWS Docs <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Certification Paths</h4>
            <p className="text-sm text-slate-600 mb-4">Explore Cloud Practitioner, Solutions Architect, and more.</p>
            <a href="https://aws.amazon.com/certification" target="_blank" className="text-sm font-bold text-orange-600 flex items-center gap-1 hover:underline">
              View Certifications <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <LayoutGrid className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Architecture Center</h4>
            <p className="text-sm text-slate-600 mb-4">Reference architectures and design patterns for the cloud.</p>
            <a href="https://aws.amazon.com/architecture" target="_blank" className="text-sm font-bold text-purple-600 flex items-center gap-1 hover:underline">
              Explore Patterns <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-800 pb-12 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">CloudQuest</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium uppercase tracking-widest">
            <p>&copy; 2026 CloudQuest AWS Learning Path. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
