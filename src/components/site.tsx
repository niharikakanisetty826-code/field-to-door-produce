import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  IMAGE_LIBRARY,
  freshnessLabel,
  harvestLabel,
  rupees,
  useStore,
  type Order,
  type OrderStatus,
  type Product,
} from "@/lib/store";

export function Leaf({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 4c0 9-5.5 14-12 14H5c0-8 5-12 12-12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 21c1.5-5 5-8.5 9.5-10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          light ? "bg-primary-foreground/15 text-primary-foreground" : "bg-primary text-primary-foreground"
        }`}
      >
        <Leaf />
      </span>
      <span className="leading-tight">
        <span className={`block font-display text-lg font-semibold ${light ? "text-primary-foreground" : "text-foreground"}`}>
          CropConnect
        </span>
        <span className={`block text-[10px] uppercase tracking-[0.18em] ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          Farmer Direct
        </span>
      </span>
    </Link>
  );
}

export function Stars({ value, size = "text-sm" }: { value: number; size?: string }) {
  return (
    <span className={`${size} tracking-tight text-harvest`} aria-label={`${value} out of 5 stars`}>
      {"★★★★★".slice(0, Math.round(value))}
      <span className="text-muted-foreground/40">{"★★★★★".slice(0, 5 - Math.round(value))}</span>
    </span>
  );
}

export function StatusPill({ status }: { status: OrderStatus }) {
  const tone: Record<OrderStatus, string> = {
    Pending: "bg-harvest/20 text-harvest-foreground",
    Accepted: "bg-primary-soft text-primary",
    Preparing: "bg-primary-soft text-primary",
    Packed: "bg-accent text-accent-foreground",
    "Out for Delivery": "bg-earth/20 text-earth",
    Delivered: "bg-primary text-primary-foreground",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone[status]}`}>{status}</span>;
}

export function FreshnessTag({ offset }: { offset: number }) {
  const f = freshnessLabel(offset);
  const tone = f.tone === "fresh" ? "bg-primary text-primary-foreground" : f.tone === "good" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground";
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone}`}>{f.label}</span>;
}

export function CustomerHeader() {
  const { cartCount, session, location, setLocation, notices } = useStore();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const unread = notices.filter((n) => n.audience === "customer" && !n.read).length;

  const links = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Vegetables" },
    { to: "/orders", label: "Orders" },
    { to: "/profile", label: "Profile" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                pathname === l.to ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="Delivery location"
            className="hidden rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground sm:block"
          >
            <option>Pune, Maharashtra</option>
            <option>Mumbai, Maharashtra</option>
            <option>Bengaluru, Karnataka</option>
            <option>Jaipur, Rajasthan</option>
            <option>Delhi NCR</option>
          </select>
          <Link
            to="/notifications"
            className="relative rounded-full border border-border p-2 text-muted-foreground hover:text-foreground"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z" strokeLinejoin="round" />
              <path d="M10 20a2 2 0 004 0" strokeLinecap="round" />
            </svg>
            {unread > 0 && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-destructive" />}
          </Link>
          <Link to="/cart" className="relative rounded-full border border-border p-2 text-muted-foreground hover:text-foreground" aria-label="Cart">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 4h2l2.5 11h10L20 7H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9.5" cy="19" r="1.4" />
              <circle cx="17" cy="19" r="1.4" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>
          {session.role === "customer" ? (
            <Link
              to="/profile"
              className="hidden items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-semibold text-primary sm:flex"
            >
              {session.name.split(" ")[0]}
            </Link>
          ) : (
            <Link to="/login" className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground sm:block">
              Sign in
            </Link>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-full border border-border p-2 text-muted-foreground md:hidden"
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
              {l.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
            Sign in
          </Link>
          <Link to="/farmer" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
            Farmer portal
          </Link>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            A direct farmer-to-customer marketplace for freshly harvested produce. Fewer intermediaries, better prices on both sides.
          </p>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold">For Customers</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-primary">Browse vegetables</Link></li>
            <li><Link to="/orders" className="hover:text-primary">My orders</Link></li>
            <li><Link to="/cart" className="hover:text-primary">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold">For Farmers</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/farmer" className="hover:text-primary">Farmer login</Link></li>
            <li><Link to="/farmer/register" className="hover:text-primary">Register your farm</Link></li>
            <li><Link to="/farmer/dashboard" className="hover:text-primary">Farmer dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold">Platform</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/admin" className="hover:text-primary">Admin panel</Link></li>
            <li><Link to="/notifications" className="hover:text-primary">Notifications</Link></li>
            <li>Smart India Hackathon prototype</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CropConnect · Fresh from Farmers, Direct to You.
      </div>
    </footer>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { getFarmer, addToCart } = useStore();
  const farmer = getFarmer(product.farmerId);
  const [added, setAdded] = useState(false);

  return (
    <article className="surface group flex flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]">
      <Link to="/product/$productId" params={{ productId: product.id }} className="relative block aspect-square overflow-hidden bg-muted">
        <img
          src={IMAGE_LIBRARY[product.image] ?? IMAGE_LIBRARY.tomato}
          alt={`Fresh ${product.name} from ${farmer.name}'s farm in ${farmer.location}`}
          loading="lazy"
          width={768}
          height={768}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 flex gap-1.5">
          <FreshnessTag offset={product.harvestOffset} />
          {product.organic && <span className="rounded-full bg-card px-2.5 py-1 text-[11px] font-semibold text-primary">Organic</span>}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold">
            <Link to="/product/$productId" params={{ productId: product.id }} className="hover:text-primary">
              {product.name}
            </Link>
          </h3>
          <p className="whitespace-nowrap font-semibold text-primary">
            {rupees(product.price)}
            <span className="text-xs font-medium text-muted-foreground">/{product.unit}</span>
          </p>
        </div>
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-soft text-[10px] font-bold text-primary">
              {farmer.name.charAt(0)}
            </span>
            {farmer.name} · {farmer.location}
          </p>
          <p>
            Harvested {harvestLabel(product.harvestOffset).toLowerCase()} · {product.stock} {product.unit} available
          </p>
        </div>
        <button
          onClick={() => {
            addToCart(product.id, 1);
            setAdded(true);
            setTimeout(() => setAdded(false), 1200);
          }}
          disabled={product.stock === 0}
          className="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
        >
          {product.stock === 0 ? "Sold out" : added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}

export function CustomerShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

const FARMER_NAV = [
  { to: "/farmer/dashboard", label: "Dashboard" },
  { to: "/farmer/products", label: "My Products" },
  { to: "/farmer/add-product", label: "Add Produce" },
  { to: "/farmer/orders", label: "Orders" },
  { to: "/farmer/earnings", label: "Earnings" },
] as const;

export function FarmerShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { session, signOut, notices } = useStore();
  const navigate = useNavigate();
  const farmerName = session.role === "farmer" ? session.name : "Ramesh Kumar";
  const unread = notices.filter((n) => n.audience === "farmer" && !n.read).length;

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="hero-gradient lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0">
        <div className="p-5">
          <Logo light />
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-primary-foreground/60">Farmer Portal</p>
          <nav className="mt-3 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {FARMER_NAV.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  pathname === l.to
                    ? "bg-primary-foreground text-primary"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/15"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 hidden rounded-xl bg-primary-foreground/10 p-3 lg:block">
            <p className="text-sm font-semibold text-primary-foreground">{farmerName}</p>
            <p className="text-xs text-primary-foreground/70">Verified farmer · Nashik</p>
            <button
              onClick={() => {
                signOut();
                navigate({ to: "/farmer" });
              }}
              className="mt-3 w-full rounded-lg bg-primary-foreground/15 px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-foreground/25"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card px-5 py-4">
          <div>
            <h1 className="font-display text-xl font-semibold">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/notifications" className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
              Notifications{unread > 0 ? ` · ${unread}` : ""}
            </Link>
            <Link to="/shop" className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
              View marketplace
            </Link>
          </div>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function StatCard({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className={`surface p-4 ${accent ? "bg-primary text-primary-foreground" : ""}`}>
      <p className={`text-xs font-medium uppercase tracking-wide ${accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
      {hint && <p className={`mt-1 text-xs ${accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{hint}</p>}
    </div>
  );
}

export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/25"
      />
    </label>
  );
}

export function orderProgress(status: OrderStatus) {
  const flow: OrderStatus[] = ["Pending", "Accepted", "Preparing", "Packed", "Out for Delivery", "Delivered"];
  return flow.indexOf(status);
}

export function OrderSummaryLine({ order }: { order: Order }) {
  return (
    <p className="text-sm text-muted-foreground">
      {order.items.map((i) => `${i.name} ${i.qty} ${i.unit}`).join(" · ")} — {rupees(order.total)}
    </p>
  );
}
