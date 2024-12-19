import { computed } from "./src/computed.js";
import { watchEffect } from "./src/effects.js";
import { createSignal } from "./src/signals.js";


const [count, setCount] = createSignal(0);
console.log('Initial count:', count()); 
setCount(1);
console.log('Updated count:', count());

const doubled = computed(() => count() * 2);
console.log('Doubled:', doubled());

watchEffect(() => {
    console.log('Effect triggered, count is:', count());
});

setCount(2);
setCount(3);