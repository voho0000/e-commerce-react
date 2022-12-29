import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,

    cart: {
        shipping_address: localStorage.getItem('shipping_address')
            ? JSON.parse(localStorage.getItem('shipping_address'))
            : {},
        payment_method: localStorage.getItem('payment_method')
            ? localStorage.getItem('payment_method')
            : '',
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
    },
};
function reducer(state, action) {
    switch (action.type) {
        case 'CART_ADD_ITEM':
            // add to cart
            const newItem = action.payload;
            const existItem = state.cart.cartItems.find(
                (item) => item.id === newItem.id
            );
            const cartItems = existItem
                ? state.cart.cartItems.map((item) =>
                    item.id === existItem.id ? newItem : item
                )
                : [...state.cart.cartItems, newItem];
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
        case 'CART_REMOVE_ITEM': {
            const cartItems = state.cart.cartItems.filter(
                (item) => item.id !== action.payload.id
            );
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
        }
        case 'CART_CLEAR':
            return { ...state, cart: { ...state.cart, cartItems: [] } };      
        case 'USER_SIGNIN':
            return { ...state, userInfo: action.payload };
        case 'USER_SIGNOUT':
            return {
                ...state,
                userInfo: null,
                cart: {
                    cartItems: [],
                    shipping_address: {},
                    payment_method: '',
                },
            };
        case 'SAVE_SHIPPING_ADDRESS':
            return {
                ...state,
                cart: {
                    ...state.cart,
                    shipping_address: action.payload,
                },
            };
        case 'SAVE_PAYMENT_METHOD':
            return {
                ...state,
                cart: { ...state.cart, payment_method: action.payload },
            };
        default:
            return state;
    }
}

export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider value={value}>{props.children} </Store.Provider>;
}