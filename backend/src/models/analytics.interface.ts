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
