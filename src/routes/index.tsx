import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-farm.jpg";
import { CustomerShell, Leaf, ProductCard } from "@/components/site";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CropConnect — Fresh from Farmers, Direct to You" },
      {
        name: "description",
        content:
          "Buy fresh, locally grown vegetables directly from Indian farmers. Transparent pricing, farmer visibility and doorstep delivery.",
      },
      { property: "og:title", content: "CropConnect — Fresh from Farmers, Direct to You" },
      {
        property: "og:description",
        content: "A direct farmer-to-customer marketplace for freshly harvested vegetables.",
      },
    ],
  }),
  component: Landing,
});

const WHY = [
  {
    title: "Fresh Produce",
    body: "Vegetables listed only after harvest, with the harvest date shown on every single product card.",
    icon: "🌾",
  },
  {
    title: "Direct from Farmers",
    body: "Every item names the farmer and the farm, so you always know who grew your food.",
    icon: "🧑‍🌾",
  },
  {
    title: "Transparent Pricing",
    body: "The farmer sets the price. No mandi commission chain quietly inflating what you pay.",
    icon: "₹",
  },
  {
    title: "Convenient Delivery",
    body: "Same-day or next-morning slots, with live order tracking from farm to doorstep.",
    icon: "🚚",
  },
];

const STEPS = [
  { n: "01", title: "Farmer Lists Produce", body: "Harvest, weigh, photograph and publish in under two minutes." },
  { n: "02", title: "Customer Orders", body: "Browse by freshness, farmer or locality and place the order." },
  { n: "03", title: "Farmer Prepares", body: "The order lands on the farmer's dashboard and gets packed." },
  { n: "04", title: "Delivery", body: "A delivery partner picks up from the farm collection point." },
  { n: "05", title: "Fresh Produce Received", body: "Customer receives, rates the produce and the farmer gets paid." },
];

function Landing() {
  const { products } = useStore();
  const featured = products.slice(0, 4);

  return (
    <CustomerShell>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3.5 py-1.5 text-xs font-semibold text-primary">
              <Leaf className="h-4 w-4" /> Direct Farmer-to-Customer Marketplace
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Fresh from Farmers,
              <span className="block text-primary">Direct to You.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Buy fresh, locally grown vegetables directly from farmers and support the people who grow your food.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition-colors hover:bg-primary/90"
              >
                Shop Fresh Vegetables
              </Link>
              <Link
                to="/farmer/register"
                className="rounded-xl border border-primary/30 bg-card px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
              >
                Sell Your Produce
              </Link>
            </div>
            <dl className="mt-9 grid max-w-lg grid-cols-3 gap-4">
              {[
                ["1,240+", "Farmers onboarded"],
                ["18,600+", "Orders delivered"],
                ["32%", "Higher farmer margin"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-semibold text-primary">{v}</dt>
                  <dd className="text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <img
              src={heroImg}
              alt="Indian farmers holding a crate of freshly harvested tomatoes and greens in their field"
              width={1600}
              height={1100}
              className="w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]"
            />
            <div className="surface absolute -bottom-6 left-4 hidden max-w-[15rem] p-4 sm:block">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Harvested today</p>
              <p className="mt-1 font-display text-lg font-semibold">Tomato · ₹30/kg</p>
              <p className="text-xs text-muted-foreground">Ramesh Kumar · Nashik</p>
            </div>
          </div>
        </div>
      </section>

      <section className="soft-gradient border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <h2 className="text-3xl">The problem we are solving</h2>
              <p className="mt-3 text-muted-foreground">
                Farmers depend on layers of intermediaries to sell fresh vegetables, which cuts their profit and hides them from the
                people who eat their produce. Customers rarely know where their vegetables came from or how long ago they were picked.
              </p>
              <p className="mt-3 text-muted-foreground">
                CropConnect is a digital marketplace that removes that gap:
                <span className="font-semibold text-foreground"> Farmer → CropConnect → Customer → Delivery.</span>
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="surface p-5">
                <h3 className="text-base">Farmer benefits</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>✓ Direct access to customers</li>
                  <li>✓ Better price transparency</li>
                  <li>✓ Digital product listing in minutes</li>
                  <li>✓ Wider customer reach beyond the mandi</li>
                </ul>
              </div>
              <div className="surface p-5">
                <h3 className="text-base">Customer benefits</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>✓ Genuinely fresh vegetables</li>
                  <li>✓ Farmer name and farm visible</li>
                  <li>✓ Transparent, honest pricing</li>
                  <li>✓ Convenient doorstep delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl">Why CropConnect?</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          CropConnect is not another grocery delivery app. It is a marketplace where the farmer is visible, named and paid fairly.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w) => (
            <div key={w.title} className="surface p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-xl">{w.icon}</span>
              <h3 className="mt-4 text-lg">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl">How it works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {STEPS.map((s) => (
              <div key={s.n} className="surface relative p-5">
                <span className="font-display text-sm font-bold text-primary">{s.n}</span>
                <h3 className="mt-2 text-base">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl">Freshly harvested today</h2>
            <p className="mt-2 text-muted-foreground">Straight from farms in Nashik, Pune, Agra, Jaipur and Karnal.</p>
          </div>
          <Link to="/shop" className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted">
            View all produce
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="hero-gradient overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12">
          <h2 className="text-3xl text-primary-foreground">Join the CropConnect community</h2>
          <p className="mx-auto mt-3 max-w-2xl text-primary-foreground/80">
            Whether you grow vegetables or cook with them, CropConnect puts you one step away from the other side of the field.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="rounded-xl bg-primary-foreground px-6 py-3.5 text-sm font-semibold text-primary">
              Shop Now
            </Link>
            <Link
              to="/farmer/register"
              className="rounded-xl border border-primary-foreground/40 px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10"
            >
              Become a Farmer
            </Link>
          </div>
        </div>
      </section>
    </CustomerShell>
  );
}
