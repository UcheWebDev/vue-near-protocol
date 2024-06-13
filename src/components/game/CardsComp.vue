<template>
  <transition-group tag="section" class="game-board" name="shuffle-card ">
    <div
      class="cards"
      v-for="card in deck"
      :key="card.id"
      :class="{ 'is-flipped': card.visible || card.matched }"
      @click="selectCard(card)"
    >
      <div class="card-face is-front">
        <img
          :src="`../assets/images/${selected}/${card.value}.png`"
          alt="Card Front"
        />
      </div>
      <div
        class="card-face is-back"
        style="
          background-image: url('../assets/images/AvalancheLogo.jpg');
          background-size: cover;
        "
      ></div>
    </div>
  </transition-group>
</template> 
  
  <script setup>
/*eslint-disable*/
import { ref, computed, onMounted, defineProps, watch } from "vue";
import { fruitsDeck, gemsDeck } from "@/utils/cardsDeck";

const deck = ref([]);
const matches = ref([]);
const clicks = ref(0);
const seconds = ref(0);
const isGameOver = ref(false);
const isPlaying = ref(false);
const totalFound = ref(0);
const points = ref(0);
const selectedDeckName = ref("");
const initialOpenCard = ref(null);
const isProcessing = ref(false);
const showAboutModal = ref(false);
const showJoinModal = ref(false);

const totalExpectedMoves = ref(16);
const currentMoves = ref(0);

const props = defineProps({
  startGame: Boolean,
});

const selected = ref("");

// Deck Initialization
const decks = [
  { name: "icons", deck: gemsDeck },
  {
    name: "fruits",
    deck: fruitsDeck,
  },
];

const showCards = () => {
  deck.value.forEach((card) => {
    card.visible = true;
  });
};

const flippedStyles = computed(() => {
  if (initialOpenCard.value?.visible) return "is-flipped";
});

const shuffleCards = () => {
  const cardSet = [...deck.value];
  for (let i = cardSet.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]];
  }
  deck.value = cardSet.map((card, index) => ({
    ...card,
    matched: false,
    visible: true,
    position: index,
  }));
};

const selectCard = (card) => {
  if (
    isProcessing.value ||
    card.visible ||
    matches.value.some((c) => c.position === card.position)
  ) {
    return;
  }

  if (initialOpenCard.value) {
    isProcessing.value = true;

    if (initialOpenCard.value.value === card.value) {
      setTimeout(() => {
        initialOpenCard.value.matched = true;
        card.matched = true;
        matches.value.push(initialOpenCard.value, card);
        initialOpenCard.value = null;
        isProcessing.value = false;
        totalFound.value += 1;
        console.log("found");

        restartGame();
      }, 1000);
    } else {
      setTimeout(() => {
        initialOpenCard.value.visible = false;
        card.visible = false;
        initialOpenCard.value = null;
        isProcessing.value = false;

        restartGame();
      }, 1000);
    }
  } else {
    initialOpenCard.value = card;
  }

  card.visible = true;
  currentMoves.value++;
};

const restartGame = () => {
  shuffleCards();
  isGameOver.value = false;
  clicks.value = 0;
  seconds.value = 0;
  matches.value.length = 0;

  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * deck.value.length);
    deck.value.forEach((card, index) => {
      card.visible = index === randomIndex;
    });
    initialOpenCard.value = deck.value[randomIndex];
    isPlaying.value = true;
  }, 500);
};

// Initial setup
onMounted(() => {
  const randomIndex = Math.floor(Math.random() * decks.length);
  const selectedDeck = decks[randomIndex].deck;
  selectedDeckName.value = decks[randomIndex].name;

  deck.value = selectedDeck.map((card, index) => ({
    id: card,
    value: card.split("-")[0],
    position: index,
    visible: true,
    matched: false,
  }));

  selected.value = selectedDeckName.value;
  showCards();
});

watch(
  () => props.startGame,
  (newVal) => {
    if (newVal == true) {
      restartGame();
    } else {
      showCards();
    }
  }
);
</script>

  <style lang="scss" scoped>
.cards {
  position: relative;
  transition: 350ms transform ease-in;
  transform-style: preserve-3d;
}

.cards.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 5px;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
}

.card-face img {
  width: 30px;
  border-radius: 5px;
}

.card-face .is-back {
  transform: rotateY(0deg);
}

.card-face.is-front {
  transform: rotateY(180deg);
}
</style>