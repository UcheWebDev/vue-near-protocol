<template>
  <Suspense>
    <template #default>
      <div>
        <img alt="Vue logo" src="./assets/logo.png" />
        <button @click="runOps">Connect wallet</button>
      </div>
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import "@near-wallet-selector/modal-ui/styles.css"

const fetchData = async () => {
  const selector = await setupWalletSelector({
    network: "testnet",
    modules: [setupMyNearWallet(), setupHereWallet()],
  });

  const modal = setupModal(selector, {
    contractId: "test.testnet",
  });

  return { selector, modal };
};

const runOps = async () => {
  const { modal } = await fetchData();
  modal.show();
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
