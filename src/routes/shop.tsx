import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CustomerShell, ProductCard } from "@/components/site";
import { useStore, type Category } from "@/lib/store";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Fresh Vegetables — CropConnect" },
      {
        name: "description",
        content: "Browse freshly harvested vegetables from named Indian farmers. Filter by category, price, freshness and location.",
      },
      { property: "og:title", content: "Shop Fresh Vegetables — CropConnect" },
      { property: "og:description", content: "Freshly harvested vegetables listed directly by farmers." },
    ],
  }),
  component: Shop,
});

const CATEGORIES: ("All" | Category)[] = ["All", "Vegetables", "Leafy Greens", "Fruits", "Organic"];

function Shop() {
  const { products, farmers, getFarmer, location } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | Category>("All");
  const [farmerId, setFarmerId] = useState("all");
  const [place, setPlace] = useState("all");
  const [maxPrice, setMaxPrice] = useState(80);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [freshOnly, setFreshOnly] = useState(false);
  const [sort, setSort] = useState("fresh");

  const list = useMemo(() => {
    let out = products.filter((p) => {
      const farmer = getFarmer(p.farmerId);
      if (query && !`${p.name} ${farmer.name} ${farmer.location}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (category === "Organic" ? !p.organic : category !== "All" && p.category !== category) return false;
      if (farmerId !== "all" && p.farmerId !== farmerId) return false;
      if (place !== "all" && farmer.location !== place) return false;
      if (p.price > maxPrice) return false;
      if (organicOnly && !p.organic) return false;
      if (freshOnly && p.harvestOffset !== 0) return false;
      return true;
    });
    out = [...out].sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "near") return getFarmer(a.farmerId).location.localeCompare(getFarmer(b.farmerId).location);
      return a.harvestOffset - b.harvestOffset;
    });
    return out;
  }, [products, query, category, farmerId, place, maxPrice, organicOnly, freshOnly, sort, getFarmer]);

  const places = Array.from(new Set(farmers.map((f) => f.location)));

  return (
    <CustomerShell>
      <div className="hero-gradient">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">Delivering to {location}</p>
          <h1 className="mt-2 text-3xl text-primary-foreground sm:text-4xl">Fresh vegetables delivered to your doorstep.</h1>
          <p className="mt-2 max-w-2xl text-primary-foreground/80">
            Every listing shows the farmer, the farm and the exact harvest date.
          </p>
          <div className="mt-6 flex max-w-xl items-center gap-2 rounded-2xl bg-card p-2 shadow-[var(--shadow-card)]">
            <svg viewBox="0 0 24 24" className="ml-2 h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fresh vegetables..."
              aria-label="Search fresh vegetables"
              className="w-full bg-transparent px-1 py-2 text-sm outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === c ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[16rem_1fr]">
          <aside className="surface h-fit p-5">
            <h2 className="font-display text-base">Filters</h2>

            <label className="mt-4 block text-sm font-medium">
              Farmer
              <select
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All farmers</option>
                {farmers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block text-sm font-medium">
              Location
              <select
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All locations</option>
                {places.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>

            <label className="mt-4 block text-sm font-medium">
              Max price: ₹{maxPrice}
              <input
                type="range"
                min={15}
                max={80}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-2 w-full accent-[var(--primary)]"
              />
            </label>

            <label className="mt-4 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={organicOnly} onChange={(e) => setOrganicOnly(e.target.checked)} className="accent-[var(--primary)]" />
              Organic only
            </label>
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={freshOnly} onChange={(e) => setFreshOnly(e.target.checked)} className="accent-[var(--primary)]" />
              Harvested today
            </label>

            <button
              onClick={() => {
                setQuery("");
                setCategory("All");
                setFarmerId("all");
                setPlace("all");
                setMaxPrice(80);
                setOrganicOnly(false);
                setFreshOnly(false);
              }}
              className="mt-5 w-full rounded-xl border border-border py-2 text-sm font-semibold hover:bg-muted"
            >
              Reset filters
            </button>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl">
                {category === "All" ? "Freshly Harvested Today" : category} <span className="text-sm font-normal text-muted-foreground">({list.length} items)</span>
              </h2>
              <label className="text-sm text-muted-foreground">
                Sort by{" "}
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground">
                  <option value="fresh">Freshest</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                  <option value="near">Nearest farmer</option>
                </select>
              </label>
            </div>

            {list.length === 0 ? (
              <p className="surface mt-6 p-8 text-center text-muted-foreground">
                No produce matched those filters. Try widening the price range or clearing the search.
              </p>
            ) : (
              <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerShell>
  );
}
