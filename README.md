# ALTERNATIVA A VUEX CON COMPOSITION API
## STORE
Primero hay que crear un store similar alque crea Vuex. Por seguir con la similitud cramos una carpeta store y dentro index.js que va a ser quien maneje el estado de toda la aplicación.

```
src/store/index.js
```

a continuación tenemos que hacer que este elemento se pueda inyectar en cualquier componente que lo requiera, para eso utilizamos la llamada Provide/Inject que existe de forma nativa en Vue.

En la app principal (App.vue) hacemos:

```javascript
<script>
import {provide} from 'vue';    //provide es parte de Vue
import store from '@/store';    //importamos store

export default {
  setup(){
    provide('store', store) //muestra store en todos los hijos -> lo puedan inyectar
  }
}
</script>
```

En el store igual que en Vuex, tenemos un objeto state que contiene todos el estado de la aplicación. Aprovechando el nuevo método reactive de Vue3 hacemos que este objeto reaccione a los cambios:

```javascript
import {reactive} from 'vue';

//el objeto state será reactivo
const state = reactive({
    counter: 0,   //pares key, valor inicial
    colorCode:'blue',
})

//Más código aquí

export default {state}
```

Ahora ya podemos inyectar store en cualquier componente, para utilizarlo debemos retornarlo en la coposition api, por ejemplo en Home

```javascript
export default {
  name: "Home",
  setup() {

    const store = inject('store') //inyecta el store en el componente

    /*******************resto del código********************/
    return {
        store,
    }
```

Recordemos que store es un objeto así que para utilizar algún valor del state tenemos que llegar a él:

```javascript
<template>
  <div class="home">
    <div>{{ store.state.counter }}</div>
      
```

Apartir de ese momento tenemos el valor de counter que se mostrará en Home de forma reactiva.

## MÉTODOS EN EL STORE

A diferencia de Vuex donde había que utilizar objetos específicos para las acciones y las mutaciones, con composition api solo hay que definir métodos dentro del store para hacer todo lo que necesitemos, para ello creamos una nueva variable que por convención llamamos methods. En index.js añadimos a continuación de state:

```javascript
//creamos los actions
const methods = {
    //acción para incrementar el valor de counter
    increaseCounter() {
        state.counter++
    },
    //acción para decrementar counter
    decreaseCounter() {
        state.counter--
    },
}

export default {state, methods} //también exportamos los métodos
```

Por supuesto también hay que exportar los métodos. Ahora estos métodos también se puedcen utilizar en los componentes. Por ejemplo añadimos unos botones en Home para incrementar y decrementar el valor de counter:

```html
    <div class="buttons">
      <button @click="store.methods.decreaseCounter">-</button>
      <button @click="store.methods.increaseCounter">+</button>
    </div>
```

Cualquier componente que inyecte el store podrá reflejar estos cambios y utilizar los métodos para modificar valores.

## GETTERS

De la misma manera que podemos hacer acciones en el store, podemos crear getters para obtener valores modificados del state. Supongamos que queremos obtener el cuadrado de counter en vez del propio counter (o cualquier otra cosa más compleja) Podríamos crear una función en el template de destino para manipular el valor, o podemos crear un getter en el store que manipule el valor y nos lo devuelva. Igual que con los métodos creamos una variable que contenga los getter y la exportamos. en index.js añadimos:

```javascript
//GETTERS
const getters = {
    counterSquared() {
        return Math.pow(state.counter, 2)
    }
}

export default {state, methods, getters} //añadimos los getters a la exportación
```

## MUTACIONES

Vamos a utilizar en Home.vue la propiedad del state colorCode para cambiar el color del resultado de counter. Podemos añadir un estilo en el div que muestra counter para que le de el color en función del valor de colorCode:

```html
    <div :style="{color: store.state.colorCode}">
      {{ store.state.counter }}
    </div>
```

y un input desde donde poder cambiar colorcode:

```html
    <div>
      <input v-model="store.state.colorCode" type="text" placeholder="Enter color code"/>
    </div>
```

Con Vuex encesitariamos una mutation para poder cambiar la propiedad, aquí no es necesario.
Si se quiere proteger las propiedades del state para que no cambien a no ser por medio de mutaciones definidas en la propia store, podemos utilizar el método read-only de Vue y exportar una versión protegida del state.

```javascript
import {reactive, readonly} from 'vue'; //añadimo readonly al store

//código del store

export default {
    state: readonly(state) //versión protegida del state
    methods,
    getters
}
```

Ahora el bindeado directo de colorCode ya no funcionará. Lo que vamos a necesitar aquí es una variable computada en Home.vue que lea el valor de store.state.colorCode (get) y que lo sobrescriba mediante un método del store (set). 

Caambiamos el input de Home.vue, ya no utilizamos store.state.colorCode sino otra cosa, pongamos colorCode:

```html
      <input v-model="colorCode" type="text" placeholder="Enter color code"/>
```

Esta nueva variable será una variable computada con un get y un set:

```javascript
import { inject, computed } from "vue";

export default {
  name: "Home",
  setup() {
    const store = inject('store') 

//propiedad computada que maneja a cstore.state.colorCode
const colorCode = computed({
  //obtiene store.state.colorCode  
  get(){
    return store.state.colorCode
  },
  //escribe store.state.colorCode
  set(val){
    store.methods.setColorCode(val) //setColorCode es un método de store
  }
})

    return {
      store,
      colorCode
    };
  },
```

Lógicamente en store debemos añadir un método setColorCode(val)

```javascript
const methods = {
    
    ,
    setColorCode(val) {
        state.colorCode=val
    }
}
```

