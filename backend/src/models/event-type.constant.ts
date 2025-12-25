export const EVENT_TYPES = {
    PAGE_VIEW: 'PAGE_VIEW',
    SEARCH: 'SEARCH',
    ADD_TO_CART: 'ADD_TO_CART',
    ORDER_PLACED: 'ORDER_PLACED',
    SCROLL_DEPTH: 'SCROLL_DEPTH',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];