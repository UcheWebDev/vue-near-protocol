<template>
  <div>
    <h1>Guest Book</h1>
    <div v-if="isSignedIn">
      <div>
        <p>Total guest : {{ viewResult }}</p>
        <p>{{ messages }}</p>
      </div>
      <input type="text" placeholder="enter guest message" v-model="msg" />
      <br /><br />
      <input
        type="text"
        placeholder="donation amount"
        v-model="amountToAdd"
      />
      <br /><br />
      <button @click.prevent="addMessage">Donate</button>
      <p>Signed in as: {{ accountId }}</p>
      <button @click="signOut">Sign Out</button>
    </div>
    <div v-else>
      <p>Please sign in</p>
      <button @click="signIn">Sign In</button>
    </div>
  </div>
</template>

<script setup>
/*eslint-disable*/
import * as nearAPI from "near-api-js";
import { onMounted, ref } from "vue";
import { useWallet } from "./composables/useWallet";
const viewResult = ref(null);

const msg = ref("");
const amountToAdd = ref(null);
const messages = ref(null);

const {
  accountId,
  isSignedIn,
  startUp,
  signIn,
  signOut,
  viewMethod,
  callMethod,
} = useWallet({
  networkId: "testnet",
  createAccessKeyFor: "mytestact.testnet",
});

const accountChangeHook = (signedAccountId) => {
  console.log("Signed in account:", signedAccountId);
};

const getTotalGuests = async () => {
  try {
    const result = await viewMethod({
      contractId: "mytestact.testnet",
      method: "total_messages",
      args: {},
    });
    viewResult.value = result;
  } catch (error) {
    console.error("Error calling view method:", error);
  }
};

const addMessage = async () => {
  const amt = nearAPI.utils.format.parseNearAmount(amountToAdd.value)
  try {
    const amount = amountToAdd.value;
    const result = await callMethod({
      contractId: "mytestact.testnet",
      method: "add_message",
      args: { text: msg.value },
      gas: "30000000000000",
      deposit:amt, 
    });
    console.log("Transaction Result:", result);
  } catch (error) {
    console.error("Error calling add_message:", error);
  }
};

const getMessages = async () => {
  try {
    const result = await viewMethod({
      contractId: "mytestact.testnet",
      method: "get_messages",
      args: { from_index: 0, limit: 10 },
    });
    messages.value = result;
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

onMounted(async () => {
  await startUp(accountChangeHook);
  getTotalGuests();
  getMessages();
});
</script>
