<template>
  <div>
    <button @click="onTrigger">Trigger SSE</button>

    <p v-for="(item, i) in messages" :key="i">{{ item }}</p>
    <NuxtLink to="/second">Go to Second Page</NuxtLink>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Home Page' });

const onTrigger = async () => {
  await $fetch('/api/publish', {
    method: 'POST',
    body: { date: Date.now() }
  });
};

const messages = ref<Record<string, any>>([]);
const events = ref<EventSource>();

onMounted(() => {
  events.value = new EventSource('/api/subscribe');
  events.value.addEventListener('connect', (evt) => messages.value.push(JSON.parse(evt.data)));
  events.value.addEventListener('update', (evt) => messages.value.push(JSON.parse(evt.data)));
});

onBeforeUnmount(() => events.value?.close());
</script>
