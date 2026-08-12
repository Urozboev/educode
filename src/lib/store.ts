import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

/**
 * Do'kon uchun umumiy ma'lumotnoma — o'quvchi sahifasi, admin paneli va
 * o'qituvchi paneli shu yerdan foydalanadi. Holat nomlari va yetkazib
 * berish turlari uch joyda alohida yozilsa, ular albatta bir-biridan
 * uzilib qoladi.
 */

export type StoreDeliveryType = "delivery" | "pickup" | "digital";
export type StoreAudience = "everyone" | "my_students";
export type StoreOrderStatus =
  | "pending" | "approved" | "shipped" | "delivered" | "rejected" | "cancelled";

export interface StoreItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price_coins: number;
  category: string;
  stock: number;
  is_active: boolean;
  order_index: number;
  owner_id: string | null;
  audience: StoreAudience;
  delivery_type: StoreDeliveryType;
}

export interface StoreOrder {
  id: string;
  user_id: string;
  item_id: string | null;
  item_title: string;
  price_coins: number;
  status: StoreOrderStatus;
  seller_id: string | null;
  delivery_type: StoreDeliveryType;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  region: string | null;
  district: string | null;
  address: string | null;
  landmark: string | null;
  note: string | null;
  tracking_note: string | null;
  reject_reason: string | null;
  refunded: boolean;
  handled_at: string | null;
  delivered_at: string | null;
  created_at: string;
}

export const DELIVERY_TYPES: {
  value: StoreDeliveryType;
  label: string;
  hint: string;
  /** Manzil maydonlari so'raladimi */
  needsAddress: boolean;
}[] = [
  {
    value: "delivery",
    label: "Yetkazib berish",
    hint: "Pochta yoki kuryer orqali. Manzil so'raladi.",
    needsAddress: true,
  },
  {
    value: "pickup",
    label: "Qo'lda topshiriladi",
    hint: "Darsda yoki institutda beriladi. Manzil kerak emas.",
    needsAddress: false,
  },
  {
    value: "digital",
    label: "Raqamli",
    hint: "Havola, kod yoki tizim ichidagi imtiyoz. Faqat aloqa kerak.",
    needsAddress: false,
  },
];

/**
 * Matnlar lug'atda, RANG va IKONKA kodda qoladi — tarjimon Tailwind
 * klassiga tegmasligi kerak. `dict` berilmasa o'zbekchaga tushadi,
 * shu sababli hali ko'chirilmagan panellar ishlayveradi.
 */
export const deliveryLabel = (t: StoreDeliveryType, dict?: Dictionary) => {
  if (dict) {
    switch (t) {
      case "delivery": return dict.store.delivery.deliveryLabel;
      case "pickup": return dict.store.delivery.pickupLabel;
      case "digital": return dict.store.delivery.digitalLabel;
    }
  }
  return DELIVERY_TYPES.find(d => d.value === t)?.label ?? t;
};

export const deliveryHint = (t: StoreDeliveryType, dict?: Dictionary) => {
  if (dict) {
    switch (t) {
      case "delivery": return dict.store.delivery.deliveryHint;
      case "pickup": return dict.store.delivery.pickupHint;
      case "digital": return dict.store.delivery.digitalHint;
    }
  }
  return DELIVERY_TYPES.find(d => d.value === t)?.hint ?? "";
};

export const needsAddress = (t: StoreDeliveryType) =>
  DELIVERY_TYPES.find(d => d.value === t)?.needsAddress ?? false;

/**
 * Buyurtma bosqichlari. `next` — shu holatdan keyin qo'yish mumkin bo'lgan
 * holatlar; UI shundan tugmalarni yasaydi, admin bilan o'qituvchi bir xil
 * oqimni ko'radi.
 */
export const ORDER_STATUS: Record<StoreOrderStatus, {
  label: string;
  hint: string;
  color: string;
  next: StoreOrderStatus[];
}> = {
  pending: {
    label: "Kutilmoqda",
    hint: "Buyurtma qabul qilindi, ko'rib chiqilmoqda",
    color: "text-neon-yellow bg-neon-yellow/10 border-neon-yellow/30",
    next: ["approved", "rejected"],
  },
  approved: {
    label: "Tasdiqlandi",
    hint: "Tasdiqlandi, tayyorlanmoqda",
    color: "text-neon-blue bg-neon-blue/10 border-neon-blue/30",
    next: ["shipped", "delivered", "rejected"],
  },
  shipped: {
    label: "Jo'natildi",
    hint: "Yo'lda — yetkazib berilmoqda",
    color: "text-neon-purple bg-neon-purple/10 border-neon-purple/30",
    next: ["delivered", "rejected"],
  },
  delivered: {
    label: "Topshirildi",
    hint: "Egasiga yetib bordi",
    color: "text-neon-green bg-neon-green/10 border-neon-green/30",
    next: [],
  },
  rejected: {
    label: "Rad etildi",
    hint: "Rad etildi, coin qaytarildi",
    color: "text-neon-red bg-neon-red/10 border-neon-red/30",
    next: [],
  },
  cancelled: {
    label: "Bekor qilindi",
    hint: "Bekor qilindi, coin qaytarildi",
    color: "text-muted-foreground bg-surface border-border",
    next: [],
  },
};

export const ORDER_FLOW: StoreOrderStatus[] = ["pending", "approved", "shipped", "delivered"];

/** Raqamli va qo'lda topshiriladigan sovg'alar "jo'natish" bosqichini o'tkazib yuboradi */
export function nextStatuses(order: Pick<StoreOrder, "status" | "delivery_type">): StoreOrderStatus[] {
  const all = ORDER_STATUS[order.status]?.next ?? [];
  if (order.delivery_type !== "delivery") return all.filter(s => s !== "shipped");
  return all;
}

export const STORE_CATEGORIES = [
  { value: "accessory", label: "Aksessuar" },
  { value: "clothing", label: "Kiyim" },
  { value: "book", label: "Kitob" },
  { value: "tech", label: "Texnika" },
  { value: "service", label: "Xizmat" },
  { value: "digital", label: "Raqamli" },
  { value: "other", label: "Boshqa" },
];

export const categoryLabel = (c: string, dict?: Dictionary) => {
  if (dict && c in dict.store.category) {
    return dict.store.category[c as keyof Dictionary["store"]["category"]];
  }
  return STORE_CATEGORIES.find(x => x.value === c)?.label ?? c;
};

/** Buyurtma formasi — RPC ga yuboriladigan maydonlar */
export interface OrderForm {
  full_name: string;
  phone: string;
  email: string;
  region: string;
  district: string;
  address: string;
  landmark: string;
  note: string;
}

export const emptyOrderForm = (): OrderForm => ({
  full_name: "", phone: "", email: "", region: "",
  district: "", address: "", landmark: "", note: "",
});

/**
 * Formani yuborishdan oldingi tekshiruv. Server ham aynan shu qoidalarni
 * qayta tekshiradi — bu faqat foydalanuvchiga tezroq javob berish uchun.
 */
export function validateOrderForm(
  f: OrderForm,
  delivery: StoreDeliveryType,
  dict?: Dictionary,
): string | null {
  const v = dict?.store.validate;
  if (!f.full_name.trim()) return v?.nameRequired ?? "To'liq ismingizni kiriting";
  if (f.full_name.trim().length < 3) return v?.nameShort ?? "Ism juda qisqa";
  if (!f.phone.trim()) return v?.phoneRequired ?? "Telefon raqamini kiriting";
  // O'zbekiston raqami: +998 XX XXX XX XX yoki 9 ta raqamli qisqa shakl
  const digits = f.phone.replace(/\D/g, "");
  if (digits.length < 9) return v?.phoneShort ?? "Telefon raqami to'liq emas";
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) {
    return v?.emailBad ?? "Pochta manzili noto'g'ri";
  }
  if (needsAddress(delivery)) {
    if (!f.region.trim()) return v?.regionRequired ?? "Viloyatni tanlang";
    if (!f.address.trim()) return v?.addressRequired ?? "Manzilni kiriting";
    if (f.address.trim().length < 10) {
      return v?.addressShort ?? "Manzilni to'liqroq yozing (ko'cha, uy raqami)";
    }
  }
  return null;
}

export const UZ_REGIONS = [
  "Toshkent shahri", "Toshkent viloyati", "Andijon", "Buxoro", "Farg'ona",
  "Jizzax", "Xorazm", "Namangan", "Navoiy", "Qashqadaryo",
  "Qoraqalpog'iston Respublikasi", "Samarqand", "Sirdaryo", "Surxondaryo",
];

/** Buyurtma holatining tarjima qilingan nomi */
export function orderStatusLabel(st: StoreOrderStatus, dict?: Dictionary): string {
  if (!dict) return ORDER_STATUS[st]?.label ?? st;
  const m: Record<StoreOrderStatus, string> = {
    pending: dict.store.status.pendingLabel,
    approved: dict.store.status.approvedLabel,
    shipped: dict.store.status.shippedLabel,
    delivered: dict.store.status.deliveredLabel,
    rejected: dict.store.status.rejectedLabel,
    cancelled: dict.store.status.cancelledLabel,
  };
  return m[st] ?? st;
}

/** Buyurtma holatining tarjima qilingan izohi */
export function orderStatusHint(st: StoreOrderStatus, dict?: Dictionary): string {
  if (!dict) return ORDER_STATUS[st]?.hint ?? "";
  const m: Record<StoreOrderStatus, string> = {
    pending: dict.store.status.pendingHint,
    approved: dict.store.status.approvedHint,
    shipped: dict.store.status.shippedHint,
    delivered: dict.store.status.deliveredHint,
    rejected: dict.store.status.rejectedHint,
    cancelled: dict.store.status.cancelledHint,
  };
  return m[st] ?? "";
}
