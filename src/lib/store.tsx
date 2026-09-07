import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import tomato from "@/assets/veg-tomato.jpg";
import potato from "@/assets/veg-potato.jpg";
import onion from "@/assets/veg-onion.jpg";
import carrot from "@/assets/veg-carrot.jpg";
import spinach from "@/assets/veg-spinach.jpg";
import brinjal from "@/assets/veg-brinjal.jpg";
import cauliflower from "@/assets/veg-cauliflower.jpg";
import cabbage from "@/assets/veg-cabbage.jpg";
import okra from "@/assets/veg-okra.jpg";
import chilli from "@/assets/veg-chilli.jpg";

export const IMAGE_LIBRARY: Record<string, string> = {
  tomato,
  potato,
  onion,
  carrot,
  spinach,
  brinjal,
  cauliflower,
  cabbage,
  okra,
  chilli,
};

export type Category = "Vegetables" | "Leafy Greens" | "Fruits" | "Organic";

export type Farmer = {
  id: string;
  name: string;
  location: string;
  state: string;
  farmSize: string;
  crops: string;
  since: number;
  rating: number;
  verified: boolean;
  about: string;
};

export type Product = {
  id: string;
  name: string;
  image: string;
  category: Category;
  price: number;
  unit: string;
  stock: number;
  harvestOffset: number; // 0 = today, 1 = yesterday
  grade: string;
  organic: boolean;
  farmerId: string;
  description: string;
};

export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Preparing"
  | "Packed"
  | "Out for Delivery"
  | "Delivered";

export const ORDER_FLOW: OrderStatus[] = [
  "Pending",
  "Accepted",
  "Preparing",
  "Packed",
  "Out for Delivery",
  "Delivered",
];

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  unit: string;
  price: number;
  qty: number;
  farmerId: string;
  farmerName: string;
};

export type Review = {
  id: string;
  productId: string;
  orderId?: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

export type Order = {
  id: string;
  createdAt: string;
  customerName: string;
  mobile: string;
  address: string;
  city: string;
  pin: string;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  paymentMethod: string;
  deliverySpeed: string;
  slot: string;
  status: OrderStatus;
  deliveryPartner: string;
  rated?: number;
  feedback?: string;
};

export type Notice = {
  id: string;
  audience: "customer" | "farmer";
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export type Session =
  | { role: "guest" }
  | { role: "customer"; name: string; email: string; mobile: string; location: string }
  | { role: "farmer"; farmerId: string; name: string; email: string; mobile: string }
  | { role: "admin"; name: string };

export const FARMERS: Farmer[] = [
  {
    id: "f1",
    name: "Ramesh Kumar",
    location: "Nashik",
    state: "Maharashtra",
    farmSize: "4.5 acres",
    crops: "Tomato, Onion, Grapes",
    since: 2016,
    rating: 4.8,
    verified: true,
    about:
      "Third-generation farmer growing tomatoes on the black soil belt of Nashik. Harvests at dawn and packs the same morning, with no cold-storage layover.",
  },
  {
    id: "f2",
    name: "Sunita Devi",
    location: "Agra",
    state: "Uttar Pradesh",
    farmSize: "3 acres",
    crops: "Potato, Cauliflower",
    since: 2018,
    rating: 4.6,
    verified: true,
    about:
      "Runs a family potato farm near Agra and leads a 12-woman farming self-help group that shares seed and grading equipment.",
  },
  {
    id: "f3",
    name: "Mahesh Patil",
    location: "Pune",
    state: "Maharashtra",
    farmSize: "6 acres",
    crops: "Onion, Brinjal, Chilli",
    since: 2014,
    rating: 4.7,
    verified: true,
    about:
      "Grows red onion and brinjal on drip irrigation near Junnar, Pune. Sells direct to households to skip the mandi commission chain.",
  },
  {
    id: "f4",
    name: "Anita Devi",
    location: "Jaipur",
    state: "Rajasthan",
    farmSize: "2 acres",
    crops: "Spinach, Coriander, Fenugreek",
    since: 2019,
    rating: 4.9,
    verified: true,
    about:
      "Certified organic leafy-green grower. Bunches are cut before sunrise and reach customers within eight hours of harvest.",
  },
  {
    id: "f5",
    name: "Ravi Sharma",
    location: "Karnal",
    state: "Haryana",
    farmSize: "8 acres",
    crops: "Carrot, Cabbage, Lady Finger",
    since: 2012,
    rating: 4.5,
    verified: true,
    about:
      "Large-format vegetable farm in Karnal supplying carrots and cabbage. Uses soil-testing based fertiliser planning.",
  },
];

const seedProducts: Product[] = [
  {
    id: "p1",
    name: "Tomato",
    image: "tomato",
    category: "Vegetables",
    price: 30,
    unit: "kg",
    stock: 50,
    harvestOffset: 0,
    grade: "Grade A",
    organic: false,
    farmerId: "f1",
    description:
      "Firm, deep-red Nashik tomatoes picked this morning. Thick pulp and low seed content, ideal for gravies and salads.",
  },
  {
    id: "p2",
    name: "Potato",
    image: "potato",
    category: "Vegetables",
    price: 25,
    unit: "kg",
    stock: 120,
    harvestOffset: 1,
    grade: "Grade A",
    organic: false,
    farmerId: "f2",
    description:
      "Agra table potatoes with thin skin and even size. Field-fresh, brushed clean but never washed, so they store longer.",
  },
  {
    id: "p3",
    name: "Onion",
    image: "onion",
    category: "Vegetables",
    price: 35,
    unit: "kg",
    stock: 80,
    harvestOffset: 0,
    grade: "Grade A",
    organic: false,
    farmerId: "f3",
    description:
      "Pungent red onions from Junnar with tight skin and long shelf life. Graded by hand into medium and large sizes.",
  },
  {
    id: "p4",
    name: "Carrot",
    image: "carrot",
    category: "Vegetables",
    price: 40,
    unit: "kg",
    stock: 45,
    harvestOffset: 0,
    grade: "Grade A",
    organic: false,
    farmerId: "f5",
    description:
      "Sweet, crunchy Karnal carrots with tops still attached, a reliable sign they left the soil today.",
  },
  {
    id: "p5",
    name: "Spinach",
    image: "spinach",
    category: "Leafy Greens",
    price: 20,
    unit: "bunch",
    stock: 60,
    harvestOffset: 0,
    grade: "Organic",
    organic: true,
    farmerId: "f4",
    description:
      "Tender organic palak cut before sunrise and bundled in the field. No chemical sprays used through the crop cycle.",
  },
  {
    id: "p6",
    name: "Brinjal",
    image: "brinjal",
    category: "Vegetables",
    price: 32,
    unit: "kg",
    stock: 38,
    harvestOffset: 0,
    grade: "Grade A",
    organic: false,
    farmerId: "f3",
    description:
      "Glossy purple long brinjal, tender with very few seeds. Best used within three days of harvest.",
  },
  {
    id: "p7",
    name: "Cauliflower",
    image: "cauliflower",
    category: "Vegetables",
    price: 28,
    unit: "piece",
    stock: 40,
    harvestOffset: 1,
    grade: "Grade A",
    organic: false,
    farmerId: "f2",
    description:
      "Compact snow-white curds with protective green leaves left on to keep the head fresh in transit.",
  },
  {
    id: "p8",
    name: "Cabbage",
    image: "cabbage",
    category: "Vegetables",
    price: 22,
    unit: "kg",
    stock: 55,
    harvestOffset: 0,
    grade: "Grade B",
    organic: false,
    farmerId: "f5",
    description:
      "Dense, heavy cabbage heads with crisp outer leaves. Excellent for stir fry, sabzi and salads.",
  },
  {
    id: "p9",
    name: "Lady Finger",
    image: "okra",
    category: "Vegetables",
    price: 45,
    unit: "kg",
    stock: 25,
    harvestOffset: 0,
    grade: "Grade A",
    organic: true,
    farmerId: "f5",
    description:
      "Young organic bhindi, hand-picked at 8 cm length so every pod snaps clean instead of turning fibrous.",
  },
  {
    id: "p10",
    name: "Green Chilli",
    image: "chilli",
    category: "Vegetables",
    price: 60,
    unit: "kg",
    stock: 18,
    harvestOffset: 0,
    grade: "Grade A",
    organic: false,
    farmerId: "f3",
    description:
      "Medium-hot green chillies with a bright, glossy skin. Sorted for uniform length and free of blemishes.",
  },
];

const seedReviews: Review[] = [
  {
    id: "r1",
    productId: "p1",
    author: "Rahul Sharma",
    rating: 5,
    text: "Very fresh vegetables and excellent quality. The tomatoes still had the smell of the vine.",
    date: "2 days ago",
  },
  {
    id: "r2",
    productId: "p1",
    author: "Meera Iyer",
    rating: 4,
    text: "Good weight and no damaged pieces. Delivery came within the promised slot.",
    date: "5 days ago",
  },
  {
    id: "r3",
    productId: "p5",
    author: "Kavita Nair",
    rating: 5,
    text: "Palak was crisp even the next morning. Nice to know exactly which farm it came from.",
    date: "1 day ago",
  },
  {
    id: "r4",
    productId: "p3",
    author: "Arjun Reddy",
    rating: 5,
    text: "Onions were dry and well graded, much better than what I get at the local shop.",
    date: "3 days ago",
  },
];

function isoDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const seedOrders: Order[] = [
  {
    id: "CC10241",
    createdAt: isoDaysAgo(6),
    customerName: "Rahul Sharma",
    mobile: "98450 11223",
    address: "B-402, Green Meadows, Baner Road",
    city: "Pune",
    pin: "411045",
    items: [
      { productId: "p1", name: "Tomato", image: "tomato", unit: "kg", price: 30, qty: 3, farmerId: "f1", farmerName: "Ramesh Kumar" },
      { productId: "p3", name: "Onion", image: "onion", unit: "kg", price: 35, qty: 2, farmerId: "f3", farmerName: "Mahesh Patil" },
    ],
    subtotal: 160,
    delivery: 20,
    total: 180,
    paymentMethod: "UPI",
    deliverySpeed: "Standard Delivery",
    slot: "Delivered on time",
    status: "Delivered",
    deliveryPartner: "Imran Khan · CropConnect Fleet",
    rated: 5,
    feedback: "Very fresh vegetables and excellent quality.",
  },
  {
    id: "CC10243",
    createdAt: isoDaysAgo(2),
    customerName: "Meera Iyer",
    mobile: "99201 44556",
    address: "12, Lakeview Apartments, Koregaon Park",
    city: "Pune",
    pin: "411001",
    items: [
      { productId: "p5", name: "Spinach", image: "spinach", unit: "bunch", price: 20, qty: 4, farmerId: "f4", farmerName: "Anita Devi" },
      { productId: "p4", name: "Carrot", image: "carrot", unit: "kg", price: 40, qty: 1, farmerId: "f5", farmerName: "Ravi Sharma" },
    ],
    subtotal: 120,
    delivery: 20,
    total: 140,
    paymentMethod: "Cash on Delivery",
    deliverySpeed: "Standard Delivery",
    slot: "Today, 6:00 PM – 8:00 PM",
    status: "Out for Delivery",
    deliveryPartner: "Suresh Yadav · CropConnect Fleet",
  },
  {
    id: "CC10244",
    createdAt: isoDaysAgo(0),
    customerName: "Arjun Reddy",
    mobile: "90080 77341",
    address: "7th Cross, Indiranagar",
    city: "Bengaluru",
    pin: "560038",
    items: [
      { productId: "p1", name: "Tomato", image: "tomato", unit: "kg", price: 30, qty: 2, farmerId: "f1", farmerName: "Ramesh Kumar" },
      { productId: "p9", name: "Lady Finger", image: "okra", unit: "kg", price: 45, qty: 1, farmerId: "f5", farmerName: "Ravi Sharma" },
    ],
    subtotal: 105,
    delivery: 20,
    total: 125,
    paymentMethod: "UPI",
    deliverySpeed: "Same Day Delivery",
    slot: "Today, 6:00 PM – 8:00 PM",
    status: "Pending",
    deliveryPartner: "Assigning partner",
  },
];

const seedNotices: Notice[] = [
  { id: "n1", audience: "farmer", title: "New order received", body: "Order CC10244 · Tomato 2 kg from Arjun Reddy", time: "12 min ago", read: false },
  { id: "n2", audience: "farmer", title: "Payment received", body: "₹180 settled for order CC10241", time: "Yesterday", read: true },
  { id: "n3", audience: "customer", title: "Order out for delivery", body: "CC10243 is on the way, arriving 6:00 PM – 8:00 PM", time: "40 min ago", read: false },
  { id: "n4", audience: "customer", title: "Order delivered", body: "CC10241 was delivered. Rate your produce.", time: "6 days ago", read: true },
];

export type CartLine = { productId: string; qty: number };

type StoreValue = {
  products: Product[];
  farmers: Farmer[];
  orders: Order[];
  reviews: Review[];
  notices: Notice[];
  cart: CartLine[];
  session: Session;
  location: string;
  setLocation: (l: string) => void;
  signIn: (s: Session) => void;
  signOut: () => void;
  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  placeOrder: (input: {
    customerName: string;
    mobile: string;
    address: string;
    city: string;
    pin: string;
    paymentMethod: string;
    deliverySpeed: string;
  }) => Order;
  advanceOrder: (orderId: string, status: OrderStatus) => void;
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  addReview: (r: Omit<Review, "id" | "date">) => void;
  markNoticesRead: (audience: "customer" | "farmer") => void;
  getFarmer: (id: string) => Farmer;
  getProduct: (id: string) => Product | undefined;
};

const StoreContext = createContext<StoreValue | null>(null);

const KEY = "cropconnect-state-v1";

type Persisted = {
  products: Product[];
  orders: Order[];
  reviews: Review[];
  notices: Notice[];
  cart: CartLine[];
  session: Session;
  location: string;
};

const initial: Persisted = {
  products: seedProducts,
  orders: seedOrders,
  reviews: seedReviews,
  notices: seedNotices,
  cart: [],
  session: { role: "guest" },
  location: "Pune, Maharashtra",
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...(JSON.parse(raw) as Persisted) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const patch = useCallback((fn: (s: Persisted) => Persisted) => setState((s) => fn(s)), []);

  const notify = (s: Persisted, audience: "customer" | "farmer", title: string, body: string): Persisted => ({
    ...s,
    notices: [
      { id: `n${Math.random().toString(36).slice(2, 8)}`, audience, title, body, time: "Just now", read: false },
      ...s.notices,
    ],
  });

  const value = useMemo<StoreValue>(() => {
    const getProduct = (id: string) => state.products.find((p) => p.id === id);
    const getFarmer = (id: string) => FARMERS.find((f) => f.id === id) ?? FARMERS[0];

    const cartSubtotal = state.cart.reduce((sum, line) => {
      const p = getProduct(line.productId);
      return sum + (p ? p.price * line.qty : 0);
    }, 0);

    return {
      products: state.products,
      farmers: FARMERS,
      orders: state.orders,
      reviews: state.reviews,
      notices: state.notices,
      cart: state.cart,
      session: state.session,
      location: state.location,
      getProduct,
      getFarmer,
      cartCount: state.cart.reduce((n, l) => n + l.qty, 0),
      cartSubtotal,
      setLocation: (l) => patch((s) => ({ ...s, location: l })),
      signIn: (session) => patch((s) => ({ ...s, session })),
      signOut: () => patch((s) => ({ ...s, session: { role: "guest" } })),
      addToCart: (productId, qty = 1) =>
        patch((s) => {
          const existing = s.cart.find((l) => l.productId === productId);
          return {
            ...s,
            cart: existing
              ? s.cart.map((l) => (l.productId === productId ? { ...l, qty: l.qty + qty } : l))
              : [...s.cart, { productId, qty }],
          };
        }),
      setQty: (productId, qty) =>
        patch((s) => ({
          ...s,
          cart: qty <= 0 ? s.cart.filter((l) => l.productId !== productId) : s.cart.map((l) => (l.productId === productId ? { ...l, qty } : l)),
        })),
      removeFromCart: (productId) => patch((s) => ({ ...s, cart: s.cart.filter((l) => l.productId !== productId) })),
      clearCart: () => patch((s) => ({ ...s, cart: [] })),
      placeOrder: (input) => {
        const items: OrderItem[] = state.cart.flatMap((line) => {
          const p = getProduct(line.productId);
          if (!p) return [];
          return [
            {
              productId: p.id,
              name: p.name,
              image: p.image,
              unit: p.unit,
              price: p.price,
              qty: line.qty,
              farmerId: p.farmerId,
              farmerName: getFarmer(p.farmerId).name,
            },
          ];
        });
        const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
        const delivery = input.deliverySpeed === "Same Day Delivery" ? 40 : subtotal > 500 ? 0 : 20;
        const order: Order = {
          id: `CC${10245 + state.orders.length}`,
          createdAt: new Date().toISOString(),
          customerName: input.customerName,
          mobile: input.mobile,
          address: input.address,
          city: input.city,
          pin: input.pin,
          items,
          subtotal,
          delivery,
          total: subtotal + delivery,
          paymentMethod: input.paymentMethod,
          deliverySpeed: input.deliverySpeed,
          slot: input.deliverySpeed === "Same Day Delivery" ? "Today, 6:00 PM – 8:00 PM" : "Tomorrow, 7:00 AM – 10:00 AM",
          status: "Pending",
          deliveryPartner: "Imran Khan · CropConnect Fleet",
        };
        patch((s) => {
          let next: Persisted = {
            ...s,
            orders: [order, ...s.orders],
            cart: [],
            products: s.products.map((p) => {
              const line = items.find((i) => i.productId === p.id);
              return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p;
            }),
          };
          next = notify(next, "farmer", "New order received", `${order.id} · ${items.map((i) => `${i.name} ${i.qty} ${i.unit}`).join(", ")}`);
          next = notify(next, "customer", "Order confirmed", `${order.id} placed successfully. Total ₹${order.total}.`);
          return next;
        });
        return order;
      },
      advanceOrder: (orderId, status) =>
        patch((s) => {
          let next: Persisted = {
            ...s,
            orders: s.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
          };
          const messages: Record<OrderStatus, string> = {
            Pending: "Order is awaiting farmer confirmation.",
            Accepted: "The farmer confirmed your order.",
            Preparing: "Your produce is being harvested and prepared.",
            Packed: "Your order has been packed at the farm.",
            "Out for Delivery": "Your order is out for delivery.",
            Delivered: "Your order has been delivered. Rate your produce!",
          };
          next = notify(next, "customer", `Order ${orderId}: ${status}`, messages[status]);
          if (status === "Delivered") next = notify(next, "farmer", "Payment received", `Payment for ${orderId} has been settled to your account.`);
          return next;
        }),
      addProduct: (p) =>
        patch((s) => ({
          ...s,
          products: [{ ...p, id: `p${Math.random().toString(36).slice(2, 7)}` }, ...s.products],
        })),
      updateProduct: (id, upd) =>
        patch((s) => ({ ...s, products: s.products.map((p) => (p.id === id ? { ...p, ...upd } : p)) })),
      removeProduct: (id) => patch((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) })),
      addReview: (r) =>
        patch((s) => ({
          ...s,
          reviews: [{ ...r, id: `r${Math.random().toString(36).slice(2, 7)}`, date: "Just now" }, ...s.reviews],
          orders: r.orderId ? s.orders.map((o) => (o.id === r.orderId ? { ...o, rated: r.rating, feedback: r.text } : o)) : s.orders,
        })),
      markNoticesRead: (audience) =>
        patch((s) => ({ ...s, notices: s.notices.map((n) => (n.audience === audience ? { ...n, read: true } : n)) })),
    };
  }, [state, patch]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function rupees(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function harvestLabel(offset: number) {
  if (offset === 0) return "Today";
  if (offset === 1) return "Yesterday";
  return `${offset} days ago`;
}

export function freshnessLabel(offset: number) {
  if (offset === 0) return { label: "Just harvested", tone: "fresh" as const };
  if (offset === 1) return { label: "1 day old", tone: "good" as const };
  return { label: "Stored", tone: "fair" as const };
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
