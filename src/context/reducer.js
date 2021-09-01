export const initialState = {
    user: null,
    keys: {}
};

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_KEYS: "SET_KEYS"
};

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user,
            };
        case actionTypes.SET_KEYS:
            return {
                ...state,
                keys: action.keys
            };

        default:
            return state;
    }
};

export default reducer;