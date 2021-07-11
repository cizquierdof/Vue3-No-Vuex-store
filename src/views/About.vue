<template>
  <div class="about">
    <h1>Aqui también funciona Counter</h1>
    <h2>
      {{store.state.counter}}
    </h2>
  </div>
</template>

<script>
import {inject} from 'vue';

export default{
  setup(){
    const store = inject('store')

    return{
      store
    }
  }
}
</script>