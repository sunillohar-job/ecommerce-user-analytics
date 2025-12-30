// src/swagger/components.ts

/**
 * @swagger
 * components:
 *   parameters:
 *     XRequestIdHeader:
 *       name: x-request-id
 *       in: header
 *       required: false
 *       description: Unique request id for request tracing
 *       schema:
 *         type: string
 *         example: "req-123e4567-e89b-12d3-a456-426614174000"
 *     PeriodQueryParam:
 *       name: period
 *       in: query
 *       required: true
 *       description: Journey Period
 *       schema:
 *         type: string
 *         enum:
 *           - today
 *           - yesterday
 *           - last_7_days
 *           - this_week
 *           - last_week
 *           - this_month
 *           - last_month
 *           - this_year
 *           - last_year
 *
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 'The required fields is missing from the request payload'
 *         status:
 *           type: integer
 *           example: 400
 *       required:
 *         - message
 *         - status
 *
 *     TrafficAnalyticsDataResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/TrafficAnalyticsData'
 *       required:
 *         - data
 *
 *     TrafficAnalyticsData:
 *       type: object
 *       properties:
 *         totalSessions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CountMetric'
 *         activeUsers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CountMetric'
 *         pageViewsByPage:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PageViewsByPage'
 *         sessionsOverTime:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SessionsOverTime'
 *       required:
 *         - totalSessions
 *         - activeUsers
 *         - pageViewsByPage
 *         - sessionsOverTime
 *
 *     SearchAnalyticsDataResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/SearchAnalyticsData'
 *       required:
 *         - data
 *
 *     SearchAnalyticsData:
 *       type: object
 *       properties:
 *         totalSearches:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CountMetric'
 *         topQueries:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TopQuery'
 *         zeroResultQueries:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TopQuery'
 *       required:
 *         - totalSearches
 *         - topQueries
 *         - zeroResultQueries
 *
 *     ProductAndCartAnalyticsDataResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/ProductAndCartAnalyticsData'
 *       required:
 *         - data
 *
 *     ProductAndCartAnalyticsData:
 *       type: object
 *       properties:
 *         cartActions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartActions'
 *         topProducts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *       required:
 *         - cartActions
 *         - topProducts
 *
 *     CountMetric:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *           example: 120
 *       required:
 *         - count
 *
 *     TopQuery:
 *       type: object
 *       properties:
 *         query:
 *           type: string
 *           example: "iphone 15"
 *         searches:
 *           type: integer
 *           example: 56
 *       required:
 *         - query
 *         - searches
 *
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "iPhone 15 Pro"
 *         productId:
 *           type: string
 *           example: "IPH15PRO"
 *         quantity:
 *           type: integer
 *           example: 12
 *       required:
 *         - name
 *         - productId
 *         - quantity
 *
 *     CartActions:
 *       type: object
 *       properties:
 *         eventType:
 *           type: string
 *           example: "ADD_TO_CART"
 *         count:
 *           type: integer
 *           example: 34
 *       required:
 *         - eventType
 *         - count
 *
 *     PageViewsByPage:
 *       type: object
 *       properties:
 *         page:
 *           type: string
 *           example: "/home"
 *         views:
 *           type: integer
 *           example: 340
 *       required:
 *         - page
 *         - views
 *
 *     SessionsOverTime:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-01-01T00:00:00.000Z"
 *         sessions:
 *           type: integer
 *           example: 45
 *       required:
 *         - date
 *         - sessions
 *     RevenueAndConversionAnalyticsDataResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/RevenueAndConversionAnalyticsData'
 *       required:
 *         - data
 *
 *     RevenueAndConversionAnalyticsData:
 *       type: object
 *       properties:
 *         ordersOverTime:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrdersOverTime'
 *         revenueStats:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RevenueStats'
 *       required:
 *         - ordersOverTime
 *         - revenueStats
 *
 *     OrdersOverTime:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-01-01T00:00:00.000Z"
 *         orders:
 *           type: integer
 *           example: 32
 *       required:
 *         - date
 *         - orders
 *
 *     RevenueStats:
 *       type: object
 *       properties:
 *         orders:
 *           type: integer
 *           example: 120
 *         revenue:
 *           type: number
 *           format: float
 *           example: 154320.75
 *         avgOrderValue:
 *           type: number
 *           format: float
 *           example: 1286.0
 *       required:
 *         - orders
 *         - revenue
 *         - avgOrderValue
 *
 *     UserBehaviorAndFunnelAnalyticsDataResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UserBehaviorAndFunnelAnalyticsData'
 *       required:
 *         - data
 *
 *     UserBehaviorAndFunnelAnalyticsData:
 *       type: object
 *       properties:
 *         devices:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DeviceItem'
 *         funnel:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FunnelItem'
 *       required:
 *         - devices
 *         - funnel
 *
 *     FunnelItem:
 *       type: object
 *       properties:
 *         eventType:
 *           type: string
 *           enum:
 *             - ORDER_PLACED
 *             - ADD_TO_CART
 *             - PAGE_VIEW_OR_SEARCH
 *           example: ADD_TO_CART
 *         uniqueUsersCount:
 *           type: integer
 *           example: 56
 *       required:
 *         - eventType
 *         - uniqueUsersCount
 *
 *     DeviceItem:
 *       type: object
 *       properties:
 *         device:
 *           type: string
 *           enum:
 *             - mobile
 *             - desktop
 *             - tablet
 *           example: mobile
 *         uniqueUsersCount:
 *           type: integer
 *           example: 140
 *       required:
 *         - device
 *         - uniqueUsersCount
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *       required:
 *         - data
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6953af3a5b3be4b004cfd16a"
 *         userId:
 *           type: string
 *           example: "user_12345"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T10:30:00Z"
 *         lastActiveAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-10T08:15:00Z"
 *         fname:
 *           type: string
 *           example: 'Sunil'
 *         lname:
 *           type: string
 *           example: 'Kumar'
 *         age:
 *           type: integer
 *           example: 29
 *         country:
 *           type: string
 *           example: "India"
 *         language:
 *           type: string
 *           example: "en"
 *         metadata:
 *           type: object
 *           additionalProperties: true
 *           example:
 *             plan: "premium"
 *             source: "google_ads"
 *       required:
 *         - userId
 *         - createdAt
 *         - lastActiveAt
 *         - fname
 *         - lname
 *         - age
 *         - country
 *         - language
 *
 *     UserJourneyFinalResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UserJourneyResponse'
 *       required:
 *         - data
 *
 *     Session:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6953af3a5b3be4b004cfd176"
 *         sessionId:
 *           type: string
 *           example: "u1001_s1"
 *         userId:
 *           type: string
 *           example: "u1001"
 *         startedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-10T08:15:00Z"
 *         lastActivityAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-10T08:15:00Z"
 *         endedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-10T08:15:00Z"
 *         metadata:
 *           type: object
 *       required:
 *         - userId
 *         - sessionId
 *         - startedAt
 *         - lastActivityAt
 *         - endedAt
 *
 *     SessionResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Session'
 *       required:
 *         - data
 *
 *
 *     UserJourneyResponse:
 *       type: object
 *       properties:
 *         totalPurchaseAmount:
 *           type: number
 *           format: float
 *           example: 15499.75
 *         totalPurchaseQuantity:
 *           type: integer
 *           example: 6
 *         sessions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserSessions'
 *       required:
 *         - totalPurchaseAmount
 *         - totalPurchaseQuantity
 *         - sessions
 *
 *     UserSessions:
 *       type: object
 *       properties:
 *         sessionId:
 *           type: string
 *           example: "sess_abc123"
 *         startedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-10T09:00:00Z"
 *         lastActivityAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-10T09:45:00Z"
 *         endedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-10T09:50:00Z"
 *         events:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SessionEvent'
 *         totalPurchaseAmount:
 *           type: number
 *           format: float
 *           example: 4999.99
 *         totalPurchaseQuantity:
 *           type: integer
 *           example: 2
 *         totalTimeSpent:
 *           type: integer
 *           description: Total time spent in seconds
 *           example: 1800
 *         totalDistinctPages:
 *           type: integer
 *           example: 5
 *       required:
 *         - sessionId
 *         - startedAt
 *         - lastActivityAt
 *         - endedAt
 *         - events
 *         - totalPurchaseAmount
 *         - totalPurchaseQuantity
 *         - totalTimeSpent
 *         - totalDistinctPages
 *
 *     SessionEvent:
 *       type: object
 *       properties:
 *         eventType:
 *           type: string
 *           example: "PAGE_VIEW"
 *         page:
 *           type: string
 *           example: "/product/iphone-15"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2025-01-10T09:10:00Z"
 *         metadata:
 *           type: object
 *           additionalProperties: true
 *           example:
 *             device: "mobile"
 *             browser: "chrome"
 *         timeSpentOnPage:
 *           type: integer
 *           description: Time spent on page in seconds
 *           example: 120
 *       required:
 *         - eventType
 *         - page
 *         - timestamp
 *         - metadata
 *         - timeSpentOnPage
 *
 *     UserEvent:
 *       type: object
 *       required:
 *         - userId
 *         - sessionId
 *         - eventType
 *         - page
 *         - metadata
 *       properties:
 *         userId:
 *           type: string
 *           example: "u1001"
 *         sessionId:
 *           type: string
 *           example: "u1001_s1"
 *         eventType:
 *           type: string
 *           enum:
 *             - PAGE_VIEW
 *             - SEARCH
 *             - ADD_TO_CART
 *             - SCROLL_DEPTH
 *             - REMOVE_FROM_CART
 *             - ORDER_PLACED
 *           example: "PAGE_VIEW"
 *         page:
 *           type: string
 *           enum:
 *             - /home
 *             - /deals
 *             - /category
 *             - /product
 *             - /cart
 *           example: "/home"
 *         metadata:
 *           type: object
 *           additionalProperties: true
 *           example:
 *             device: "mobile"
 *             browser: "chrome"
 */
