import { getBrandById } from "@/lib/data";

const BRAND_ID = "brand-1";

export default async function BrandSettingsPage() {
  const brand = await getBrandById(BRAND_ID);

  if (!brand) {
    return <p className="p-8 text-gray-500">Brand not found.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your brand profile and preferences.
        </p>
      </div>

      {/* Brand Profile */}
      <div className="rounded-card bg-white p-6 shadow-card">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Brand Profile
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Brand Name
            </label>
            <input
              type="text"
              defaultValue={brand.name}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Category
            </label>
            <input
              type="text"
              defaultValue={brand.category ?? ""}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Description
            </label>
            <textarea
              defaultValue={brand.description ?? ""}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* Target Audience */}
      <div className="rounded-card bg-white p-6 shadow-card">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Target Audience
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Age Range
            </label>
            <input
              type="text"
              defaultValue={brand.target_age_range ?? ""}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Gender
            </label>
            <input
              type="text"
              defaultValue={brand.target_gender}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {brand.target_interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-3 py-1 text-sm text-gray-700"
                >
                  {interest}
                  <button className="ml-1 text-gray-400 hover:text-gray-600">
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Locations
            </label>
            <div className="flex flex-wrap gap-2">
              {brand.target_locations.map((loc) => (
                <span
                  key={loc}
                  className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-3 py-1 text-sm text-gray-700"
                >
                  {loc}
                  <button className="ml-1 text-gray-400 hover:text-gray-600">
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Account Stats (read-only) */}
      <div className="rounded-card bg-white p-6 shadow-card">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Account
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-surface-50 p-4">
            <p className="text-xs text-gray-500">Completed Deals</p>
            <p className="text-2xl font-bold text-gray-800">
              {brand.completed_deals}
            </p>
          </div>
          <div className="rounded-xl bg-surface-50 p-4">
            <p className="text-xs text-gray-500">Reliability Score</p>
            <p className="text-2xl font-bold text-gray-800">
              {brand.reliability_score ?? "N/A"}
            </p>
          </div>
          <div className="rounded-xl bg-surface-50 p-4">
            <p className="text-xs text-gray-500">Member Since</p>
            <p className="text-2xl font-bold text-gray-800">
              {new Date(brand.created_at).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end gap-3">
        <button className="rounded-button border border-surface-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-surface-50">
          Cancel
        </button>
        <button className="rounded-button bg-brand-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-500">
          Save Changes
        </button>
      </div>
    </div>
  );
}
