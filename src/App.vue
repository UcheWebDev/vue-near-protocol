<template>
  <Suspense>
    <template #default>
      <div v-if="!LoadingState">
        <img alt="Vue logo" src="./assets/logo.png" />
        <button @click="runOps" v-if="!walletStatus">Connect wallet</button>

        <div v-if="accountsConnected">{{ accountsConnected }}</div>
        <button style="margin-top: 20px" v-if="walletStatus" @click="callCont">
          call
        </button>
        <button
          v-if="walletStatus"
          @click="SignOutWallet"
          style="margin-left: 5px"
        >
          sign Out
        </button>
      </div>
      <div v-else>Loading...</div>
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script setup>
/*eslint-disable*/
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import "@near-wallet-selector/modal-ui/styles.css";
import { computed, ref } from "vue";

const walletStatus = ref(false);
const accountsConnected = ref(null);
const LoadingState = ref(false);

const fetchData = async () => {
  const selector = await setupWalletSelector({
    network: "testnet",
    modules: [setupMyNearWallet(), setupHereWallet()],
  });

  const modal = setupModal(selector, {
    contractId: "uceewebdev.testnet",
  });

  // const wallet = await selector.wallet();
  // const accounts = await wallet.getAccounts();
  return { selector, modal };
};

const runOps = async () => {
  const { modal } = await fetchData();
  modal.show();
};

async function displayStateData() {
  try {
    const { selector } = await fetchData();
    walletStatus.value = selector.isSignedIn();
    if (walletStatus.value) {
      LoadingState.value = false;
      const wallet = await selector.wallet();
      const accounts = await wallet.getAccounts();
      accountsConnected.value = accounts;
      console.log(walletStatus.value);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
displayStateData();

async function SignOutWallet() {
  try {
    const { selector } = await fetchData();
    const wallet = await selector.wallet();
    const res = await wallet.signOut();
    LoadingState.value = false;
    accountsConnected.value = null;
    walletStatus.value = null;
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

async function callCont() {
  try {
    const { selector } = await fetchData();
    const wallet = await selector.wallet();
    const callContract = await wallet.signAndSendTransaction({
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "set_greeting",
            args: { greeting: "Hello uche calling!" },
            gas: "30000000000000",
          },
        },
      ],
    });
  } catch (error) {
    console.error("Error calling contract:", error);
  }
}
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
