<template>
  <div class="main">
    <div id="leaderboard">
      <div v-if="loading" class="p-4 font-styled">Loading Data..</div>
      <div v-else>
        <div class="p-4" v-if="sortedPlayers && sortedPlayers.length < 1">
          <p class="font-styled">
            You are currently not connected to a space , please ask your peers
            for room id or create one for yourself.
          </p>
        </div>
        <table>
          <tr v-for="(member, index) in sortedPlayers" :key="member.accountId">
            <td class="number">{{ index + 1 }}</td>
            <td class="name">{{ member.accountId }}</td>
            <td class="points">{{ member.totalPoints }} PTS</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
/*eslint-disable*/
import { defineProps, computed } from "vue";

const props = defineProps({
  members: {
    type: Array,
    required: true,
    default: () => [],
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const sortedPlayers = computed(() => {
  return [...props.members].sort((a, b) => b.totalPoints - a.totalPoints);
});
</script>

<style lang="scss" scoped>
.main {
  background-color: #EBDEDC;
  // -webkit-box-shadow: 0px 5px 15px 8px #e4e7fb;
  // box-shadow: 0px 5px 15px 8px #e4e7fb;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0.5rem;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
}

#leaderboard {
  width: 100%;
  position: relative;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  color: #141a39;
  cursor: default;
}

tr {
  transition: all 0.2s ease-in-out;
  border-radius: 0.2rem;
}

// tr:hover {
//   background-color: #fff;
//   transform: scale(1.1);
//   -webkit-box-shadow: 0px 5px 15px 8px #e4e7fb;
//   box-shadow: 0px 5px 15px 8px #e4e7fb;
// }

td {
  //   height: 5rem;
  font-family: "Bubblegum Sans", sans-serif;
  //   font-size: 1.4rem;
  padding: 10px 2rem;
  position: relative;
}

.number {
  width: 1rem;
  font-size: 2.2rem;
  font-weight: bold;
  text-align: left;
}

.name {
  text-align: left;
  font-size: 1.2rem;
}

.points {
  font-weight: bold;
  font-size: 1.3rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.points:first-child {
  width: 10rem;
}

.font-styled {
  font-family: "Bubblegum Sans", sans-serif;
}

// @media (max-width: 740px) {
//   * {
//     font-size: 70%;
//   }
// }

// @media (max-width: 500px) {
//   * {
//     font-size: 55%;
//   }
// }

// @media (max-width: 390px) {
//   * {
//     font-size: 45%;
//   }
// }
</style>