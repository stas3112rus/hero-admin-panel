const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle', 
}

const heroes = (state = initialState, action) => {

    switch (action.type) {
        case 'HEROES_FETCHING':
            return {
                ...state,
                heroesLoadingStatus: 'loading'
            }
        case 'HEROES_FETCHED':
            return {
                ...state,
                heroes: action.payload,
                heroesLoadingStatus: 'idle'
            }
        case 'HEROES_FETCHING_ERROR':
            console.log (12)
            return {
                ...state,
                heroesLoadingStatus: 'error'
                
            }
        case 'UPDATE_HEROES': 
            return {
                ...state,
                heroes: action.payload,
                heroesLoadingStatus: 'idle'
            }


        default: return state
    }

}

export default heroes;