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

export interface TrafficAnalyticsData {
  totalSessions: CountMetric[];
  activeUsers: CountMetric[];
  pageViewsByPage: PageViewsByPage[];
  sessionsOverTime: SessionsOverTime[];
}

export interface SearchAnalyticsData {
  totalSearches: CountMetric[];
  topQueries: TopQuery[];
  zeroResultQueries: TopQuery[];
}

export interface Product {
  name: string;
  productId: string;
  quantity: number;
}

export interface CartActions {
  eventType: string;
  count: number;
}

export interface ProductAndCartAnalyticsData {
  cartActions: CartActions[];
  topProducts: Product[];
}


export interface RevenueAndConversionAnalyticsData {
  ordersOverTime: OrdersOverTime[];
  revenueStats: {
    orders: number;
    revenue: number;
    avgOrderValue: number;
  }[];
}

export interface UserBehaviorAndFunnelAnalyticsData {
  devices: DeviceItem[];
  funnel: FunnelItem[];
}

export interface FunnelItem {
  eventType: 'ORDER_PLACED' | 'ADD_TO_CART' | 'PAGE_VIEW_OR_SEARCH';
  uniqueUsersCount: number;
}

export interface DeviceItem {
  device: 'mobile' | 'desktop' | 'tablet';
  uniqueUsersCount: number;
}
