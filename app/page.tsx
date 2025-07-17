import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
          BuildCost NG Pro
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Get instant ±10% accurate construction cost estimates for any residential building in Nigeria. 
          Powered by live 2025 market data and AI-driven predictions.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/calculate"
            className="btn-primary text-lg px-8 py-3"
          >
            Calculate Cost
          </Link>
          <Link
            href="/projects"
            className="btn-secondary text-lg px-8 py-3"
          >
            View Projects
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card text-center">
          <div className="text-3xl mb-4">🏗️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Instant Estimates
          </h3>
          <p className="text-gray-600">
            Get construction costs within ±10% accuracy using advanced AI algorithms and live market data.
          </p>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            2025 Market Data
          </h3>
          <p className="text-gray-600">
            Updated material prices, location multipliers, and construction rates for all Nigerian regions.
          </p>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            AI-Powered
          </h3>
          <p className="text-gray-600">
            Random Forest machine learning with Monte Carlo simulation for precise cost predictions.
          </p>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-4">🌍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Multi-Location
          </h3>
          <p className="text-gray-600">
            Accurate pricing for Lagos, Abuja, Port Harcourt, Enugu, and rural areas.
          </p>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            PDF Reports
          </h3>
          <p className="text-gray-600">
            Professional cost breakdown reports ready for clients and stakeholders.
          </p>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-4">🌐</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Multi-Language
          </h3>
          <p className="text-gray-600">
            Available in English, Hausa, and Nigerian Pidgin for wider accessibility.
          </p>
        </div>
      </div>
    </div>
  )
}