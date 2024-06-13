<template>
  <div class="board" v-if="startGame">
    <div class="content">
      <p class="word fw-bold" style="color: #000" v-if="startGame">
        {{ scrambledWord }}
      </p>
      <p v-else class="word">Start</p>
      <div class="details text-center">
        <!-- <p class="hint">
          Hint: <span>{{ currentHint }}</span>
        </p> -->
        <p class="time font-styled">
          Time Left:
          <span
            ><b>{{ timeLeft }}</b
            >s</span
          >
        </p>
      </div>
      <input
        type="text"
        spellcheck="false"
        placeholder=""
        v-model="userInput"
        @keyup.enter="checkWord"
        v-if="startGame"
      />
      <div class="buttons" v-if="startGame">
        <!-- <button class="refresh-word answer" @click="refreshWord">
          Use Hint
        </button> -->
        <button class="startButton answer ms-3 fw-bold" @click="checkWord">
          Check
        </button>
      </div>
    </div>
  </div>
</template>

  <script setup>
/*eslint-disable*/
import { ref, onMounted, watch, defineProps, defineEmits } from "vue";
import { words } from "@/utils/wordsArray";

const props = defineProps({
  startGame: Boolean,
});

const emit = defineEmits(["deductPoints"]);

const timeLeft = ref(30);
const userInput = ref("");
const scrambledWord = ref("");
const currentHint = ref("");
const correctWord = ref(null);
let interval;

const shuffleWord = (word) => {
  return word
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

const refreshWord = () => {
  const randomWord = words[Math.floor(Math.random() * words.length)];
  scrambledWord.value = shuffleWord(randomWord.word);
  currentHint.value = randomWord.hint;
  userInput.value = "";
  timeLeft.value = 30;
};

const initTimer = (maxTime) => {
  if (interval) clearInterval(interval);
  timeLeft.value = maxTime;
  interval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      emit("deductPoints");
      initGame();
    }
  }, 1000);
};

const initGame = () => {
  clearInterval(interval);
  initTimer(30);
  let randomObj = words[Math.floor(Math.random() * words.length)];
  let wordArray = randomObj.word.split("");
  for (let i = wordArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
  }
  scrambledWord.value = wordArray.join("");
  currentHint.value = randomObj.hint;
  correctWord.value = randomObj.word.toLowerCase();
  userInput.value = "";
};

const checkWord = () => {
  if (userInput.value.toLowerCase() === correctWord.value) {
    alert("Correct!");
    initGame();
  } else {
    alert("Incorrect, try again.");
  }
};

watch(
  () => props.startGame,
  (newVal) => {
    if (newVal == true) {
      initGame();
    } else {
      scrambledWord.value = null;
      timeLeft.value = 30;
      currentHint.value = null;
      clearInterval(interval);
    }
  }
);

// onMounted(() => {
//   initGame();
// });
</script>

  <style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.font-styled {
  font-family: "Bubblegum Sans", sans-serif;
}

.board {
  /* width: 440px; */
  border-radius: 7px;
  /* background: #fff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08); */
}

.board h2 {
  font-size: 25px;
  font-weight: 500;
  padding: 16px 25px;
  border-bottom: 1px solid #ccc;
}

.board .content {
  margin: 25px 20px 35px;
  padding: 20px;
  /* background: #fff; */
  border-radius: 3px;
}

.content .word {
  user-select: none;
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  letter-spacing: 24px;
  margin-right: -24px;
  word-break: break-all;
  text-transform: uppercase;
  /* font-family: 'Courier New', Courier, monospace; */
}

.content .details {
  margin: 25px 0 20px;
}

.details p {
  font-size: 18px;
  margin-bottom: 10px;
}

.details p b {
  font-weight: 500;
}

.content input {
  display: block;
  margin: 0 auto;
  border: none;
  padding: 0;
  width: 10.5ch;
  background: repeating-linear-gradient(
      90deg,
      dimgrey 0,
      dimgrey 1ch,
      transparent 0,
      transparent 1.5ch
    )
    0 100%/10ch 2px no-repeat;
  font: 5ch droid sans mono, consolas, monospace;
  letter-spacing: 0.5ch;
}

input:focus {
  outline: none;
  color: #000;
}

/* .content input:focus {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
} */

/* .content input::placeholder {
  color: #aaa;
} */

/* .content input:focus::placeholder {
  color: #bfbfbf;
} */

.content .buttons {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
}

.startButton {
  /* color: rgb(254, 254, 254); */
  background-color: #fda215;
  padding: 15px 0;
}
.startButton:active {
  position: relative;
  top: 2px;
}
.startButton {
  padding: 7px 0;
}

.answer {
  width: 100%;
  border-radius: 15px;
  box-shadow: 0.5rem 0.5rem black;
  text-align: center;
  padding: 10px 0;
  margin: 10px 0;
}

@media screen and (max-width: 470px) {
  .board h2 {
    font-size: 22px;
    padding: 13px 20px;
  }
  .content .word {
    font-size: 30px;
    letter-spacing: 20px;
    margin-right: -20px;
  }
  .board .content {
    margin: 20px 20px 30px;
  }
  .details p {
    font-size: 16px;
    margin-bottom: 8px;
  }
  /* .content input {
    height: 55px;
    font-size: 17px;
  } */
  .buttons button {
    padding: 14px 0;
    font-size: 16px;
    /* width: calc(100% / 2 - 7px); */
  }
}
</style>
