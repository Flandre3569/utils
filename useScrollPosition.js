import { ref } from 'vue';

export function useScrollPosition() {
  const scrollX = ref(0);
  const scroolY = ref(0);

  document.addEventListener('scroll', () => {
    scrollX.value = window.scrollX;
    scroolY.value = window.scrollY;
  })

  return { scrollX, scroolY };
}