import {reactive, readonly} from 'vue';

//creamos el state
const state = reactive({
    counter: 0,   //en los componentes se puede recuperar como store.state.counter
    colorCode:'blue',
})

//creamos los actions
const methods = {
    increaseCounter() {
        state.counter++
    },
    decreaseCounter() {
        state.counter--
    },
    setColorCode(val) {
        state.colorCode=val
    }
}

//GETTERS
const getters = {
    counterSquared() {
        return Math.pow(state.counter, 2)
    }
}
export default {
    state: readonly(state), //poniendolo readonly solo se puede modificar con setters
    methods,
    getters
}