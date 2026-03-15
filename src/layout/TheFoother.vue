<template>
    <div>
        <footer>

        <div class="py-6 px-6 text-center copy">
                <span class="text-muted mb-0 fs-4">© {{ currentYear }} 3AV — Tous droits réservés.</span>

        <!-- <p class="mb-0 fs-4">Design and Developed by <a href="https://adminmart.com/" target="_blank"
            class="pe-1 text-primary text-decoration-underline">AdminMart.com</a>
        </p> -->
        </div>
        </footer>
    </div>
</template>
<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
<style scoped>
footer {
  padding: 20px 0;
  font-size: 14px;
  margin-top: 5%;
  transition: all 0.3s;
  border-top: 1px solid #cddfff;
}
.copy {
  background-color: #f8f9fa;
  font-size: 14px;
  color: #000;
  position: relative;
  bottom: 0;
  width: 100%;
}
</style>