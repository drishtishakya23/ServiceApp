import { useEffect, useState } from "react";
import type { Service } from "./types/service";
import type { Category } from "./types/category";
import FilterPill from "./components/filterPill";
import ServiceGrid from "./components/ServiceGrid";

const RATING_OPTIONS = ["Any", "4.5+", "4.0+", "3.5+"];

function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRating, setSelectedRating] = useState("Any");

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:3000/services");

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data: Service[] = await response.json();

      setServices(data);
    } catch {
      setError("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      setCategoryError("");

      const response = await fetch("http://localhost:3000/categories");

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data: Category[] = await response.json();

      setCategories(data);
    } catch {
      setCategoryError("Failed to load categories.");
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const getMinimumRating = () => {
    if (selectedRating === "Any") {
      return 0;
    }

    return Number.parseFloat(selectedRating);
  };

  const minimumRating = getMinimumRating();

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === "All" ||
      service.category === selectedCategory;

    const matchesRating =
      selectedRating === "Any" ||
      service.rating >= minimumRating;

    return matchesCategory && matchesRating;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Local services
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            ServiceApp
          </h1>

          <p className="mt-2 max-w-2xl text-gray-600">
            Find trusted local professionals for your home and business needs.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          {/* Category filters */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Service category
              </h2>

              {categoryLoading && (
                <span className="text-sm text-gray-500">
                  Loading categories...
                </span>
              )}
            </div>

            {categoryError && (
              <p className="mb-3 text-sm text-red-600">
                {categoryError}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <FilterPill
                label="All"
                selected={selectedCategory === "All"}
                onClick={() => setSelectedCategory("All")}
              />

              {categories.map((category) => (
                <FilterPill
                  key={category.id}
                  label={category.label}
                  selected={selectedCategory === category.value}
                  onClick={() => setSelectedCategory(category.value)}
                />
              ))}
            </div>
          </div>

          {/* Rating filters */}
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h2 className="mb-3 font-semibold text-gray-900">
              Minimum rating
            </h2>

            <div className="flex flex-wrap gap-2">
              {RATING_OPTIONS.map((rating) => (
                <FilterPill
                  key={rating}
                  label={rating}
                  selected={selectedRating === rating}
                  onClick={() => setSelectedRating(rating)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Results heading */}
        <section className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Local service providers
            </h2>

            <p className="text-sm text-gray-500">
              Showing {filteredServices.length} of {services.length} services
            </p>
          </div>

          {(selectedCategory !== "All" || selectedRating !== "Any") && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSelectedRating("Any");
              }}
              className="w-fit text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          )}
        </section>

        {/* Loading state */}
        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="mt-4 text-gray-600">
              Loading services...
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="font-semibold text-red-800">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchServices}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {/* Services */}
        {!loading && !error && (
          <ServiceGrid services={filteredServices} />
        )}
      </main>
    </div>
  );
}

export default App;