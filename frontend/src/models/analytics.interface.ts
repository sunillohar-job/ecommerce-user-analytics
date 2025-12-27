export interface CountMetric {
  count: number;
}

export interface PageViewsByPage {
  page: string;
  views: number;
}

export interface SessionsOverTime {
  date: string;
  sessions: number;
}

export interface OrdersOverTime {
  date: string;
  orders: number;
}

export interface TopQuery {
  query: string;
  searches: number;
}

export interface DateRange {
  start?: string;
  end?: string;
}

export interface TrafficAnalyticsData extends DateRange {
  totalSessions?: CountMetric[];
  activeUsers?: CountMetric[];
  pageViewsByPage?: PageViewsByPage[];
  sessionsOverTime?: SessionsOverTime[];
}

export interface SearchAnalyticsData extends DateRange {
  totalSearches?: CountMetric[];
  topQueries?: TopQuery[];
  zeroResultQueries?: TopQuery[];
  start?: string;
  end?: string;
}

export interface Product {
  name: string;
  productId: string;
  quantity: number;
}

export interface CartActions {
  eventType?: string;
  count?: number;
}

export interface ProductAndCartAnalyticsData extends DateRange {
  cartActions?: CartActions[];
  topProducts?: Product[];
}

export interface RevenueAndConversionAnalyticsData extends DateRange {
  ordersOverTime?: OrdersOverTime[];
  revenueStats?: {
    orders: number;
    revenue: number;
    avgOrderValue: number;
  }[];
}
