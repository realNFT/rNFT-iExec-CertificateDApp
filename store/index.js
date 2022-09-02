export const state = {
    isConnected: "",
    form: {
        smartContract: null,
        tokenId: null,
    },
    createOracle: null
}

export const mutations = {
    setUser(state, newUser){
        state.isConnected = newUser
    },
    setDataForm(state, newData){
        state.form = newData
    },
    setOracle(state, n){
        state.createOracle = n
    }
}