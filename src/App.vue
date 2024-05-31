<template>
  <div>
    <div v-if="isSignedIn">Signed in as: {{ accountId }}</div>
    <div v-else>Please sign in.</div>
    <button @click="signIn">Sign In</button>
    <button @click="signOut">Sign Out</button>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useWallet } from "./composables/useWallet";

const { accountId, isSignedIn, startUp, signIn, signOut } = useWallet({
  networkId: "testnet",
  createAccessKeyFor: "contractId",
});

const accountChangeHook = (signedAccountId) => {
  console.log("Signed in account:", signedAccountId);
};

onMounted(async () => {
  await startUp(accountChangeHook);
});
</script>
