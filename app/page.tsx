import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-yellow-400 mb-4">
            VEXL
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-8">
            Ambassador Portal
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
            Create and manage your Vexl workshop presentations. 
            Share the vision of peer-to-peer Bitcoin trading with your community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-gray-800 text-white font-bold rounded hover:bg-gray-700 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Create Workshops</h3>
            <p className="text-gray-400">
              Build custom presentations tailored to your audience
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">Present Live</h3>
            <p className="text-gray-400">
              Engage your community with interactive demonstrations
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-2">Track Impact</h3>
            <p className="text-gray-400">
              Monitor engagement and grow your network
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
