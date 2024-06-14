<template>
  <!-- HEADER SECTION -->
  <div class="headDiv d-flex justify-content-between align-items-center">
    <h1 class="fw-bold">Word Quest</h1>
    <div class="linkDiv">
      <button
        class="btn-style transparent rounded fw-bold me-1"
        @click="showAboutModal = true"
      >
        <span class="material-symbols-outlined"> info </span>
        How To Play
      </button>
      <button
        class="btn-style rounded fw-bold ms-1"
        v-if="!isSignedIn"
        @click="signIn"
      >
        <span class="material-symbols-outlined"> cloud_upload </span>
        Connect
      </button>
      <button class="btn-style rounded fw-bold ms-1" v-else @click="signOut">
        <span class="material-symbols-outlined"> logout </span> Log out
      </button>
    </div>
  </div>

  <!-- CENTRAL PART -->
  <div class="centralDiv d-flex justify-content-around align-items-center mb-4">
    <!-- CORRECT SCORE -->
    <div
      id="outCorrect"
      class="outerDiv d-flex flex-column justify-content-around align-items-center"
    >
      <button
        @click="showJoinModal = true"
        class="btn-style large d-flex justify-content-center align-items-center fw-bold"
        :disabled="!isSignedIn"
      >
        <span class="material-symbols-outlined"> person_add </span>
        JOIN
      </button>
      <div class="standard-card">
        <h5>Max Point</h5>
        <p id="correctScore" class="m-0 p-0 stake-counter" v-if="isSignedIn">
          <!-- {{ currentMoves }} -->
          2000
        </p>
        <p id="correctScore" class="m-0 p-0 stake-counter" v-else>0</p>
      </div>
    </div>

    <!-- GAMEBOARD -->
    <div class="mainDiv">
      <LeaderBoard
        :members="spaceMembers"
        :loading="loadingSkeleton"
        v-if="isSignedIn && !isPlaying"
      />
      <!-- <CardsComp :startGame="isPlaying" /> -->
      <ScrambleComp
        :startGame="isPlaying"
        @addUserPoints="callPointsAddition"
        @deductPoints="callPointsDeduction"
      />
    </div>

    <!-- WRONG SCORE -->
    <div
      id="outWrong"
      class="outerDiv d-flex flex-column justify-content-around align-items-center"
    >
      <button
        class="btn-style large d-flex justify-content-center align-items-center fw-bold"
        @click="restartGame"
        v-if="!isPlaying"
        :disabled="!hasFourMembers"
      >
        <span class="material-symbols-outlined"> play_circle </span>
        PLAY
      </button>

      <button
        v-else
        class="btn-style large d-flex justify-content-center align-items-center fw-bold"
        @click="stopGame"
      >
        <span class="material-symbols-outlined"> close </span>
        STOP
      </button>

      <div class="standard-card">
        <h5>Total Point</h5>
        <p class="m-0 p-0 stake-counter" v-if="isSignedIn">
          {{ getTotalPointsinSpace }}
        </p>
        <p class="m-0 p-0 stake-counter" v-else>{{ getTotalPointsinSpace }}</p>
      </div>
    </div>
  </div>

  <!-- QUESTION SECTION  -->
  <div class="askDiv text-center p-4">
    <div v-if="isSignedIn">
      <div>
        <h3 id="myQuestion">
          Connected as <span class="text-success"> "{{ accountId }}"</span>...
        </h3>
      </div>
    </div>
    <h3 id="myQuestion fw-bold text-capitalize text-styled" v-else>
      <span class="text-styled">connect your wallet !</span>
    </h3>
  </div>

  <!-- About Modal -->
  <ModalComp :header="'About Game'" v-model:isVisible="showAboutModal">
    <p>
      Welcome to Word Quest, a groundbreaking Web 3 game that combines the
      excitement of classic word scramble challenges with the power and security
      of blockchain technology.
    </p>

    <h5>How It Works</h5>
    <p>
      Word Quest leverages near protocol smart contracts to provide a
      transparent, fair, stake & play gamefi experience. it is an engaging game
      that tests your word and dedication skills ! In this game, players compete
      to unscramble words as quickly as possible accumulating points. The player
      who accumulates the max points takes home the total stakes contributed by
      all other players.
    </p>
  </ModalComp>

  <!-- Action Modal-->
  <ModalComp
    :header="'..'"
    v-model:isVisible="showJoinModal"
    @close="handleModalClose"
    style="padding: 0 20px"
  >
    <div class="d-flex justify-content-between gap-2 mt-4" v-if="actionPanel">
      <button
        class="btn-style large"
        @click="createNewRoom"
        v-if="!canParticipate"
      >
        CREATE
      </button>
      <button
        class="btn-style large"
        @click="joinExistingRoom"
        v-if="!canParticipate"
      >
        JOIN
      </button>
      <button
        class="btn-style large rounded"
        @click="LeaveJoinedRoom"
        v-if="canParticipate"
      >
        LEAVE
      </button>
      <button
        class="btn-style rounded large transparent"
        @click="LeaveJoinedRoom"
        v-if="canParticipate"
      >
        SHARE
      </button>
    </div>

    <!--Join Panel-->
    <div v-if="joinPanel">
      <label class="input d-block mb-3">
        <input
          class="input__field"
          type="text"
          v-model="joinGroupName"
          placeholder=" "
          style="
            background: white;
            border: 2px solid #ededed;
            border-radius: 20px;
          "
        />
        <span
          class="input__label"
          style="
            background: white;
            font-weight: 400;
            top: 4px;
            left: 10px;
            font-size: 14px;
          "
          >Enter Space Name</span
        >
      </label>

      <button class="btn-style full rounded" @click="joinExistingSpace">
        <div
          class="spinner-border spinner-border-sm text-dark"
          role="status"
          v-if="isLoading"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
        <div v-else>Join</div>
      </button>
    </div>

    <!--Leave panel-->
    <div v-if="LeavePanel" class="pa-6">
      <label class="input d-block mb-3">
        <input
          class="input__field"
          type="text"
          v-model="connectedGroup"
          placeholder=" "
          style="
            background: white;
            border: 2px solid #ededed;
            border-radius: 20px;
          "
        />
        <span
          class="input__label"
          style="
            background: white;
            font-weight: 400;
            top: 4px;
            left: 10px;
            font-size: 14px;
          "
          >Enter Space Name</span
        >
      </label>

      <button class="btn-style full rounded" @click="leaveConnectGroup">
        <div
          class="spinner-border spinner-border-sm text-light"
          role="status"
          v-if="isLoading"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
        <div v-else>LEAVE</div>
      </button>
    </div>

    <!--create Panel-->
    <div v-if="createPanel">
      <label class="input d-block mb-3">
        <input
          class="input__field"
          type="text"
          v-model="groupName"
          placeholder=" "
          style="
            background: white;
            border: 2px solid #ededed;
            border-radius: 20px;
          "
        />
        <span
          class="input__label"
          style="
            background: white;
            font-weight: 400;
            top: 4px;
            left: 10px;
            font-size: 14px;
          "
          >Pick A Fancy Space Name</span
        >
      </label>

      <button class="btn-style full rounded" @click="creatNewSpace">
        <div
          class="spinner-border spinner-border-sm text-light"
          role="status"
          v-if="isLoading"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
        <div v-else>CREATE</div>
      </button>
    </div>
  </ModalComp>
</template>

<script setup>
/*eslint-disable*/
import * as nearAPI from "near-api-js";

import { onMounted, ref, watch, computed, onBeforeUnmount } from "vue";
import CardsComp from "./components/game/CardsComp.vue";
import ScrambleComp from "./components/game/ScrambleComp.vue";

import ModalComp from "./components/modal/ModalComp.vue";
import { useWallet } from "./composables/useWallet";
import LeaderBoard from "./components/app/LeaderBoard.vue";

const showAboutModal = ref(false);
const showJoinModal = ref(false);

const actionPanel = ref(true);
const joinPanel = ref(false);
const createPanel = ref(false);
const LeavePanel = ref(false);

const currentMoves = ref(0);
const totalFound = ref(0);
const spaceMembers = ref([]);
const connectedGroup = ref(null);

const loadingSkeleton = ref(true);
const isLoading = ref(false);

const isPlaying = ref(false);
const contractName = "contract8080.testnet";

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
  createAccessKeyFor: contractName,
});

// get total points
const getTotalPointsinSpace = computed(() => {
  const memebers = spaceMembers.value.find(
    (member) => member.accountId == accountId.value
  );
  const points = memebers ? memebers.totalPoints : "0";
  return points;
});

// check total members
const hasFourMembers = computed(() => {
  return spaceMembers.value.length === 4;
});

const groupName = ref(null);
const joinGroupName = ref(null);
const leaveGroupName = ref(null);

// handle modal actions
const createNewRoom = () => {
  actionPanel.value = false;
  joinPanel.value = false;
  createPanel.value = true;
  LeavePanel.value = false;
};

const joinExistingRoom = () => {
  actionPanel.value = false;
  createPanel.value = false;
  joinPanel.value = true;
  LeavePanel.value = false;
};

const LeaveJoinedRoom = () => {
  actionPanel.value = false;
  createPanel.value = false;
  joinPanel.value = false;
  LeavePanel.value = true;
};

const handleModalClose = () => {
  actionPanel.value = true;
  createPanel.value = false;
  LeavePanel.value = false;
  joinPanel.value = false;
  showJoinModal.value = false;
};

const restartGame = () => {
  if (
    spaceMembers.value.some((member) => member.accountId == accountId.value)
  ) {
    isPlaying.value = true;
  } else {
    console.log("cannot play");
  }
};

const stopGame = () => {
  isPlaying.value = false;
};

const accountChangeHook = (signedAccountId) => {
  console.log("Signed in account:", signedAccountId);
};

const canParticipate = computed(() => {
  return spaceMembers.value.some(
    (member) => member.accountId == accountId.value
  );
});

const getConnectedSpaceId = computed(() => {
  return connectedGroup.value ? connectedGroup.value : "No Space";
});

// Near contract calls
const getTotalSpaceMembers = async () => {
  try {
    const groupId = localStorage.getItem("groupName");
    const result = await viewMethod({
      contractId: contractName,
      method: "get_users_in_group",
      args: { groupName: groupId },
    });
    spaceMembers.value = result;
    connectedGroup.value = groupId;
    loadingSkeleton.value = false;
  } catch (error) {
    console.error("Error calling getTotalSpaceMembers:", error);
  }
};

const creatNewSpace = async () => {
  try {
    isLoading.value = true;
    const result = await callMethod({
      contractId: contractName,
      method: "create_genesis_user",
      args: { groupName: groupName.value },
      gas: "30000000000000",
    });
    console.log(result);
    isLoading.value = false;
    localStorage.setItem("groupName", groupName.value);
    getTotalSpaceMembers();
    handleModalClose();
  } catch (error) {
    console.error("Error calling creatNewSpace:", error);
  }
};

const joinExistingSpace = async () => {
  try {
    isLoading.value = true;
    const result = await callMethod({
      contractId: contractName,
      method: "add_user_to_group",
      args: { groupName: joinGroupName.value },
      gas: "30000000000000",
    });
    localStorage.setItem("groupName", joinGroupName.value);
    isLoading.value = false;
    getTotalSpaceMembers();
    handleModalClose();
  } catch (error) {
    console.error("Error calling joinExistingSpace:", error);
  }
};

const leaveConnectGroup = async () => {
  try {
    isLoading.value = true;
    const result = await callMethod({
      contractId: contractName,
      method: "remove_user_from_group",
      args: { groupName: connectedGroup.value },
    });
    isLoading.value = false;
    localStorage.removeItem("groupName");
    getTotalSpaceMembers();
    handleModalClose();
  } catch (error) {
    console.error("Error calling leaveConnectGroup:", error);
  }
};

const callPointsDeduction = async () => {
  try {
    isLoading.value = true;
    const result = await callMethod({
      contractId: contractName,
      method: "deduct_user_points",
      args: { groupName: connectedGroup.value },
    });

    getTotalSpaceMembers();
  } catch (error) {
    console.error("Error calling callPointsDeduction:", error);
  }
};

const callPointsAddition = async () => {
  try {
    isLoading.value = true;
    const result = await callMethod({
      contractId: contractName,
      method: "update_user_points",
      args: { groupName: connectedGroup.value },
    });

    getTotalSpaceMembers();
  } catch (error) {
    console.error("Error calling callPointsAddition:", error);
  }
};

// Lifecycle hook
onMounted(async () => {
  await startUp(accountChangeHook);
  getTotalSpaceMembers();
});
</script>

<style scoped>
@import "@/assets/css/layout.css";
</style>

