import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ImageTools from './pages/ImageTools';
import PdfTools from './pages/PdfTools';
import Pomodoro from './pages/Pomodoro';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex flex-col lg:flex-row h-screen bg-gray-50 text-gray-900 overflow-hidden">
        
        {/* Mobile Navbar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Edulix</h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg active:bg-gray-200 focus:outline-none transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* Sidebar backdrop for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Responsive Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64 flex-shrink-0
        `}>
          <Sidebar closeSidebar={() => setSidebarOpen(false)} />
        </div>

        <main className="flex-1 overflow-y-auto w-full">
          <div className="px-4 py-6 sm:p-8 lg:p-10 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 min-h-full">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/image" element={<ImageTools />} />
                <Route path="/pdf" element={<PdfTools />} />
                <Route path="/pomodoro" element={<Pomodoro />} />
              </Routes>
            </div>
          </div>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;