<template>
  <div>
    <!-- <button type="button" class="collapsible">Open Collapsible</button>
    <div class="content">
      <p>Lorem ipsum...</p>
      <p>Lorem ipsum...</p>
      <p>Lorem ipsum...</p>
      <p>Lorem ipsum...</p>
    </div> -->

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const coll = document.getElementsByClassName('collapsible')
  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener('click', function (this: HTMLElement) {
      this.classList.toggle('active')
      const content = this.nextElementSibling as HTMLElement | null
      if (content) {
        content.style.display = content.style.display === 'block' ? 'none' : 'block'
      }
    })
  }
})
</script>

<style>
.collapsible {
  background-color: #eee;
  color: #444;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
}

/* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */
.active, .collapsible:hover {
  background-color: #ccc;
}

/* Style the collapsible content. Note: hidden by default */
.content {
  padding: 0 18px;
  display: none;
  overflow: hidden;
  background-color: #f1f1f1;
}
</style>
