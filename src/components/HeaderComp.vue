<template>
  <!-- HEADER SECTION -->
  <div class="headDiv d-flex justify-content-between align-items-center">
    <h1 class="fw-bold">Memory Quest</h1>
    <div class="linkDiv">
      <button class="ruleButton fw-bold text-light me-1" @click="toggleModal">
        About Game
      </button>
      <button
        class="restartButton fw-bold ms-1"
        v-if="!isSignedIn"
        @click="signIn"
      >
        Connect
      </button>
      <button class="restartButton fw-bold ms-1" v-else @click="signOut">
        Log out
      </button>
    </div>
  </div>
</template>

<script setup>
/*eslint-disable*/
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  isSignedIn: Boolean,
  flipCard: Function,
});

const emit = defineEmits(["signInWallet", "toggleAboutModal", "signOutWallet"]);

const toggleModal = () => {
  emit("toggleAboutModal");
};

const signIn = () => {
  emit("signInWallet");
};

const signOut = () => {
  emit("signOutWallet");
};
</script>

<style lang="scss" scoped>
</style>