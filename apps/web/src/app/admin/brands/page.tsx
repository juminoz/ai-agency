"use client";

import brands from "@/data/mock/brands.json";

export default function AdminBrandsPage() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-card bg-white p-6 shadow-card">
          <p className="text-3xl font-bold text-gray-800">{brands.length}</p>
          <p className="mt-1 text-sm text-gray-500">Total Brands</p>
        </div>
        <div className="rounded-card bg-white p-6 shadow-card">
          <p className="text-3xl font-bold text-brand-primary">
            {brands.reduce((sum, b) => sum + b.activeBriefs.length, 0)}
          </p>
          <p className="mt-1 text-sm text-gray-500">Active Briefs</p>
        </div>
        <div className="rounded-card bg-white p-6 shadow-card">
          <p className="text-3xl font-bold text-gray-800">
            {brands.reduce((sum, b) => sum + b.completedDeals, 0)}
          </p>
          <p className="mt-1 text-sm text-gray-500">Completed Deals</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-card bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-4 py-4 font-medium">Category</th>
                <th className="px-4 py-4 font-medium">Active Briefs</th>
                <th className="px-4 py-4 font-medium">Completed Deals</th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id} className="border-b border-gray-50 hover:bg-surface-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{brand.name}</p>
                      <p className="max-w-xs truncate text-xs text-gray-400">{brand.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {brand.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-gray-800">{brand.activeBriefs.length}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-gray-800">{brand.completedDeals}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1.5">
                      <button className="rounded-button border border-brand-primary px-3 py-1 text-xs font-medium text-brand-primary hover:bg-brand-50">
                        View
                      </button>
                      <button className="rounded-button border border-orange-300 px-3 py-1 text-xs font-medium text-orange-700 hover:bg-orange-50">
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
