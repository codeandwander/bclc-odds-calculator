<template>
  <div class="bg-[#F2F2F2] p-5 rounded-lg max-w-2xl mx-auto font-fort">
    <h2 class="text-black font-black mb-2">Select Bet Type</h2>
    <div class="flex gap-5 mb-4">
      <label class="flex items-center cursor-pointer">
        <input type="radio" v-model="betType" value="single" class="hidden" />
        <span class="w-5 h-5 border-2 border-[#00823E] rounded-full mr-2 relative flex items-center justify-center">
          <span v-if="betType === 'single'" class="w-3 h-3 bg-[#00823E] rounded-full"></span>
        </span>
        Single
        <InfoTooltip>A single bet is a wager on one selection in a single event.</InfoTooltip>
      </label>
      <label class="flex items-center cursor-pointer">
        <input type="radio" v-model="betType" value="parlay" class="hidden" />
        <span class="w-5 h-5 border-2 border-[#00823E] rounded-full mr-2 relative flex items-center justify-center">
          <span v-if="betType === 'parlay'" class="w-3 h-3 bg-[#00823E] rounded-full"></span>
        </span>
        Parlay
        <InfoTooltip>A parlay is a wager on two or more selections in different events.</InfoTooltip>
      </label>
    </div>

    <div class="w-full h-[1px] bg-[#CDCDCD] mb-4"></div>

    <div class="flex w-full mb-5 gap-5">
      <div class="flex w-full flex-col flex-1">
        <h3 class="text-black font-black">Enter Amount</h3>
        <p class="mb-4 text-black text-sm">Enter the amount or use the slide to increase your wager</p>
        <input 
          type="number" 
          v-model="amount" 
          :class="[
            'p-2 border border-gray-400 rounded mb-5',
            betType === 'single' ? 'w-[117px]' : ''
          ]"
        />
        <input type="range" v-model="amount" min="0" max="1000" step="10" class="w-full mb-2" />
      </div>

      <div v-if="betType === 'parlay'" class="flex-1">
        <h3 class="mb-2 text-black font-bold">Format</h3>
        <p class="mb-1 text-gray-500 text-sm">Choose your parlay odds format</p>
        <select v-model="format" class="w-full p-3 text-sm rounded mb-2">
          <option value="decimal">Decimal</option>
          <option value="american">American</option>
          <option value="fractional">Fractional</option>
        </select>
      </div>
    </div>

    <div class="w-full h-[1px] bg-[#CDCDCD] mb-4"></div>

    <div v-if="betType === 'single'" class="mb-5">
      <h3 class="text-black font-black mb-2">Enter your preferred odds format</h3>
      <div class="grid grid-cols-4 gap-5">
        <div class="flex flex-col justify-end">
          <label class="block mb-2 text-sm font-bold text-black leading-none">Decimal Odds
            <InfoTooltip>Decimal odds represent the total payout, including the stake. For example, a decimal odds of 1.91 means a $100 bet would return $191.</InfoTooltip>
          </label>
          <input type="number" v-model="decimalOdds" step="0.01" class="w-full p-3 text-sm rounded" @input="updateOdds('decimal')" />
        </div>
        <div class="flex flex-col justify-end">
          <label class="block mb-2 text-sm font-bold text-black leading-none">American Odds
            <InfoTooltip>American odds represent the total payout, including the stake. For example, a decimal odds of 1.91 means a $100 bet would return $191.</InfoTooltip>
          </label>
          <input type="number" v-model="americanOdds" class="w-full p-3 text-sm rounded" @input="updateOdds('american')" />
        </div>
        <div class="flex flex-col justify-end">
          <label class="block mb-2 text-sm font-bold text-black leading-none">Fractional
            <InfoTooltip>Fractional odds represent the total payout, including the stake. For example, a decimal odds of 1.91 means a $100 bet would return $191.</InfoTooltip>
          </label>
          <input type="text" v-model="fractionalOdds" class="w-full p-3 text-sm rounded" @input="updateOdds('fractional')" />
        </div>
        <div class="flex flex-col justify-end">
          <label class="block mb-2 text-sm font-bold text-black leading-none">Implied Probability
            <InfoTooltip>Implied probability is the probability of an event occurring based on the odds. For example, a decimal odds of 1.91 means a $100 bet would return $191.</InfoTooltip>
          </label>
          <input type="number" v-model="impliedProbability" step="0.1" class="w-full p-3 text-sm rounded" @input="updateOdds('implied')" />
        </div>
      </div>
    </div>

    <div class="w-full h-[1px] bg-[#CDCDCD] mb-4"></div>

    <div v-if="betType === 'parlay'" class="grid grid-cols-2 gap-5 mb-5">
      <div v-for="(bet, index) in bets" :key="index">
        <h3 class="mb-2 text-black font-bold">Bet {{ index + 1 }}</h3>
        <p class="mb-1 text-gray-500 text-sm">{{ index === 0 ? 'Your first parlay odds' : 'Your next parlay odds' }}</p>
        <input type="number" v-model="bets[index]" step="0.01" class="w-full p-3 text-sm rounded" />
      </div>
      <button @click="addBet" class="bg-[#00823E] text-white border-none py-2 px-5 rounded cursor-pointer mt-2 col-span-2">Add Bet</button>
    </div>

    <div class="grid grid-cols-4 gap-5 mt-5">
      <div class="">
        <h3 class="text-black font-black leading-none mb-2">{{ betType === 'parlay' ? 'Parlay Odds' : 'Potential Return' }}</h3>
        <p class="mb-4 text-black text-sm leading-none">{{ betType === 'parlay' ? 'Combined odds' : 'Your total wager and potential payout' }}</p>
        <input type="text" :value="betType === 'parlay' ? parlayOdds : potentialReturn" readonly class="w-full p-3 text-sm rounded border-2 border-[#00823E]" />
        
        <button @click="reset" class="border border-black rounded-full py-2 px-6 cursor-pointer mt-5 font-bold text-black">Reset</button>
      </div>

      <div class="">
        <h3 class="text-black font-black leading-none mb-2">To Win</h3>
        <p class="mb-4 text-black text-sm leading-none">Your expected profit</p>
        <input type="text" :value="toWin" readonly class="w-full p-3 text-sm rounded border-2 border-[#00823E]" />
      </div>

      <div v-if="betType === 'parlay'" class="bg-white p-3 rounded">
        <h3 class="text-black font-black leading-none mb-2">Potential Return</h3>
        <p class="mb-1 text-gray-500 text-sm">Your total wager and potential payout</p>
        <input type="text" :value="potentialReturn" readonly class="w-full p-3 text-sm rounded border-2 border-[#00823E]" />
      </div>

      <div class="col-span-2 p-6">
        <div class="w-full">
          <Pie :data="chartData" :options="chartOptions" />
        </div>
        <!-- <p class="ml-5 text-sm text-gray-500">Looks like someone might be able to treat themselves.</p> -->
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import InfoTooltip from './InfoTooltip.vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const textCenterPlugin = {
  id: 'textCenter',
  beforeDraw: (chart: any) => {
    const width = chart.width;
    const height = chart.height;
    const ctx = chart.ctx;
    ctx.restore();
    const fontSize = (height / 114).toFixed(2);
    ctx.font = `${fontSize}em sans-serif`;
    ctx.textBaseline = 'middle';
    const text = 'FPO';
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;
    ctx.fillText(text, textX, textY);
    ctx.save();
  }
};

export default defineComponent({
  name: 'OddsCalculator',
  components: { Pie, InfoTooltip },
  setup() {
    const betType = ref('single');
    const amount = ref(10);
    const format = ref('decimal');
    const decimalOdds = ref(1.91);
    const americanOdds = ref(100);
    const fractionalOdds = ref('2/1');
    const impliedProbability = ref(51);
    const bets = ref([1.91, 1.91, 1.91, 1.91]);

    const updateOdds = (type: string) => {
      switch (type) {
        case 'decimal':
          americanOdds.value = decimalOdds.value >= 2 
            ? Math.round((decimalOdds.value - 1) * 100) 
            : Math.round(-100 / (decimalOdds.value - 1));
          fractionalOdds.value = `${Math.round((decimalOdds.value - 1) * 100)}/${100}`;
          impliedProbability.value = Math.round((1 / decimalOdds.value) * 100);
          break;
        case 'american':
          decimalOdds.value = americanOdds.value > 0 
            ? 1 + (americanOdds.value / 100) 
            : 1 - (100 / americanOdds.value);
          fractionalOdds.value = americanOdds.value > 0 
            ? `${americanOdds.value}/100` 
            : `100/${-americanOdds.value}`;
          impliedProbability.value = americanOdds.value > 0 
            ? Math.round((100 / (americanOdds.value + 100)) * 100) 
            : Math.round((-americanOdds.value / (-americanOdds.value + 100)) * 100);
          break;
        case 'fractional':
          const [numerator, denominator] = fractionalOdds.value.split('/').map(Number);
          decimalOdds.value = 1 + (numerator / denominator);
          americanOdds.value = numerator > denominator 
            ? Math.round((numerator / denominator) * 100) 
            : Math.round((-100 * denominator) / numerator);
          impliedProbability.value = Math.round((denominator / (numerator + denominator)) * 100);
          break;
        case 'implied':
          decimalOdds.value = 100 / impliedProbability.value;
          americanOdds.value = impliedProbability.value < 50 
            ? Math.round((100 / impliedProbability.value - 1) * 100) 
            : Math.round(-100 / (100 / impliedProbability.value - 1));
          fractionalOdds.value = `${Math.round((100 / impliedProbability.value - 1) * 100)}/${100}`;
          break;
      }
    };

    const addBet = () => {
      if (bets.value.length < 10) {
        bets.value.push(1.91);
      }
    };

    const parlayOdds = computed(() => {
      return bets.value.reduce((acc, bet) => acc * bet, 1).toFixed(2);
    });

    const toWin = computed(() => {
      const odds = betType.value === 'single' ? decimalOdds.value : parseFloat(parlayOdds.value);
      return ((odds - 1) * amount.value).toFixed(2);
    });

    const potentialReturn = computed(() => {
      const odds = betType.value === 'single' ? decimalOdds.value : parseFloat(parlayOdds.value);
      return (odds * amount.value).toFixed(2);
    });

    const chartData = computed(() => ({
      labels: ['FPO', 'Profit'],
      datasets: [{
        backgroundColor: ['#1e3a8a', '#15803d'],
        data: [amount.value, parseFloat(toWin.value)]
      }]
    }));

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.raw || 0;
              return `${label}: $${value.toFixed(2)}`;
            }
          }
        },
        textCenter: textCenterPlugin
      }
    };

    const reset = () => {
      amount.value = 10;
      decimalOdds.value = 1.91;
      bets.value = [1.91, 1.91, 1.91, 1.91];
      updateOdds('decimal');
    };

    watch(amount, () => {
      if (amount.value < 0) amount.value = 0;
    });

    return {
      betType,
      amount,
      format,
      decimalOdds,
      americanOdds,
      fractionalOdds,
      impliedProbability,
      bets,
      parlayOdds,
      toWin,
      potentialReturn,
      chartData,
      chartOptions,
      updateOdds,
      addBet,
      reset,
    };
  },
});
</script>

<style scoped>
.info-icon {
  font-size: 0.8em;
  color: #00823E;
  cursor: help;
}

.tooltip {
  visibility: hidden;
  width: 200px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -100px;
  opacity: 0;
  transition: opacity 0.3s;
}

.group:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>