export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-900">
      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 shadow-lg">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7.5L12 4l8 3.5M4 7.5V17l8 3.5m-8-13L12 11m8-3.5V17L12 20.5m8-13L12 11m0 0v9.5"
              />
            </svg>
          </div>

          <span className="text-lg font-bold tracking-tight">
            Stock<span className="text-indigo-600">ly</span>
          </span>
        </div>

        {/* Login */}
        <a
          href="/sign-in"
          className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-lg"
        >
          Login
        </a>
      </nav>

      {/* Main */}
      <section className="relative flex min-h-[calc(100vh-88px)] items-center px-6 pb-16 sm:px-10 lg:px-16">
        
        {/* Background decoration */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-100/70 blur-3xl" />

        <div className="mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-2">
          
          {/* Left */}
          <div className="max-w-xl">
            
            {/* Small label */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-500 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Inventory made simple
            </div>

            <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl">
              Everything in
              <br />
              <span className="text-indigo-600">stock.</span>
              <br />
              One place.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-slate-500 sm:text-lg">
              Keep track of your products, stock levels and inventory
              operations without the clutter.
            </p>

            {/* Login */}
            <div className="mt-8 flex items-center gap-4">
              <a
                href="/sign-in"
                className="group flex items-center gap-3 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-200 transition-all duration-200 hover:-translate-y-1 hover:bg-indigo-600"
              >
                Go to Dashboard

                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </a>

              <span className="text-xs text-slate-400">
                Secure access
              </span>
            </div>
          </div>

          {/* Right - Inventory visual */}
          <div className="relative mx-auto w-full max-w-md">
            
            {/* Main card */}
            <div className="relative rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/80">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Inventory
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    Overview
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                  <svg
                    className="h-4 w-4 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h10"
                    />
                  </svg>
                </div>
              </div>

              {/* Total stock */}
              <div className="mt-5 rounded-2xl bg-slate-950 p-5">
                <p className="text-xs text-slate-400">Total Items</p>

                <div className="mt-2 flex items-end justify-between">
                  <p className="text-3xl font-bold text-white">2,486</p>

                  <span className="rounded-lg bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400">
                    +12.4%
                  </span>
                </div>
              </div>

              {/* Product list */}
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-700">
                    Recent Products
                  </p>

                  <span className="text-[10px] font-medium text-indigo-600">
                    View all
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    ["Wireless Mouse", "124", "In stock"],
                    ["Mechanical Keyboard", "58", "In stock"],
                    ["USB-C Hub", "12", "Low stock"],
                  ].map(([product, quantity, status]) => (
                    <div
                      key={product}
                      className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                          <div className="h-3 w-3 rounded-md bg-indigo-500" />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-slate-700">
                            {product}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {quantity} units
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-semibold ${
                          status === "Low stock"
                            ? "text-orange-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating notification */}
            <div className="absolute -right-5 top-16 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
                  <span className="text-sm">!</span>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Low Stock
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    3 items need attention
                  </p>
                </div>
              </div>
            </div>

            {/* Floating stock card */}
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl sm:block">
              <p className="text-[10px] text-slate-400">
                Stock value
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                ₹12.8L
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}