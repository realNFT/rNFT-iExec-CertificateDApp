export const state = {
    isConnected: "",
    form: {
        smartContract: null,
        tokenId: null,
        agree: null,
        support: null,
        size: null,
        number: null,
    },
    signer: null, 
    createOracle: null
}

export const mutations = {
    setUser(state, newUser){
        state.isConnected = newUser
    },
    setSigner(state, n){
        state.signer = n   
    },
    setDataForm(state, newData){
        state.form = newData
    },
    setOracle(state, n){
        state.createOracle = n
    }
}