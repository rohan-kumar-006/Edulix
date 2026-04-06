import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ImageTools from './pages/ImageTools';
import PdfTools from './pages/PdfTools';
import Pomodoro from './pages/Pomodoro';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50 text-gray-900">

        <Sidebar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[calc(100vh-4rem)]">

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