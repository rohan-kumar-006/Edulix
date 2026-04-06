import { Link } from 'react-router-dom';

const tools = [
  {
    name: 'Image Tools',
    path: '/image',
    desc: 'Remove backgrounds and compress images',
    features: ['Background Remover', 'Image Compressor'],
  },
  {
    name: 'PDF Tools',
    path: '/pdf',
    desc: 'Merge, split, and compress PDF files',
    features: ['PDF Merger', 'PDF Splitter', 'PDF Compressor'],
  },
  {
    name: 'Pomodoro Timer',
    path: '/pomodoro',
    desc: 'Stay focused with timed work sessions',
    features: ['Custom Timer', 'Start, Pause, Reset'],
  },
];

function Dashboard() {
  return (
    <div>

      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900">
          Welcome to Edulix
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Your all-in-one student toolkit for productivity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {tools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
          >

            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition">
              {tool.name}
            </h2>

            <p className="text-sm text-gray-500 mt-2 mb-5 leading-relaxed">
              {tool.desc}
            </p>

            <ul className="space-y-2">
              {tool.features.map((f) => (
                <li
                  key={f}
                  className="text-xs text-gray-500 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-6 text-xs text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition">
              Open →
            </div>

          </Link>
        ))}

      </div>
    </div>
  );
}

export default Dashboard;