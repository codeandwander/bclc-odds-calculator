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

    <div 
      class="grid grid-cols-1 w-full mb-5 gap-5" 
      :class="[
        betType === 'single' ? '' : 'grid-cols-1 md:grid-cols-2'
      ]">
      <div class="flex w-full flex-col flex-1">
        <h3 class="text-black font-black">Enter Wager Amount</h3>
        <p class="mb-4 text-black text-sm">Enter the amount or use the slide to increase your wager</p>
        <div class="relative w-[117px]">
          <span class="absolute left-2.5 top-1/2 transform -translate-y-1/2">$</span>
          <input 
            type="number" 
            v-model="amount" 
            :class="[
              'p-2 pl-5 border border-gray-400 rounded w-full',
            ]"
          />
        </div>
        <input type="range" v-model="amount" min="0" max="1000" step="10" class="input-range w-full  mt-5 mb-2" />
      </div>

      <div v-if="betType === 'parlay'" class="flex-1">
        <h3 class="text-black font-bold">Format</h3>
        <p class="mb-4 text-black text-sm">Choose your parlay odds format</p>
        <select v-model="format" class="w-full p-3 text-sm rounded mb-2 pr-8 custom-select">
          <option value="decimal">Decimal</option>
          <option value="american">American</option>
          <option value="fractional">Fractional</option>
        </select>
      </div>
    </div>

    <div v-if="betType === 'single'" class="w-full h-[1px] bg-[#CDCDCD] mb-4"></div>

    <div v-if="betType === 'single'" class="mb-5">
      <h3 class="text-black font-black mb-2">Enter your preferred odds format</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
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
          <label class="block mb-2 text-sm font-bold text-black leading-none">Implied<br/>Probability
            <InfoTooltip>Implied probability is the probability of an event occurring based on the odds. For example, a decimal odds of 1.91 means a $100 bet would return $191.</InfoTooltip>
          </label>
          <input type="text" v-model="impliedProbabilityDisplay" class="w-full p-3 text-sm rounded" @input="updateOdds('implied')" />
        </div>
      </div>
    </div>

    <div class="w-full h-[1px] bg-[#CDCDCD] mb-4"></div>

    <div v-if="betType === 'parlay'" class="grid grid-cols-2 gap-5 mb-5">
      <div v-for="(bet, index) in bets" :key="index">
        <h3 class="text-black font-bold">Bet {{ index + 1 }}</h3>
        <p class="mb-4 text-sm text-black">{{ index === 0 ? 'Your first parlay odds' : 'Your next parlay odds' }}</p>
        <div class="flex items-center">
          <input type="text" v-model="bets[index]" class="w-full p-3 text-sm rounded mr-2" />
          <button @click="removeBet(index)" class="bg-red-500 text-white p-2 rounded" v-if="bets.length > 1">
            Remove
          </button>
        </div>
      </div>
    </div>
  
    <button v-if="betType === 'parlay'" @click="addBet" class="mb-2 bg-[#00823E] text-white border-none pt-2.5 pb-2 px-6 rounded-full cursor-pointer mt-2 font-bold">
      Add Bet
    </button>

    <div class="w-full h-[1px] bg-[#CDCDCD] mb-5" v-if="betType === 'parlay'" ></div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5">
        <div class="col-span-2 grid grid-cols-2 gap-5">
          <div class="">
            <h3 class="text-black font-black leading-none mb-2">Winnings</h3>
            <p class="mb-4 text-black text-sm leading-none">Your expected <br v-if="betType === 'single'" />profit</p>
            <input type="text" :value="'$' + toWin" readonly class="w-full p-3 text-sm rounded border-2 border-[#00823E] font-bold" />
          </div>

          <div class="">
            <h3 class="text-black font-black leading-none mb-2">{{ betType === 'parlay' ? 'Parlay Odds' : 'Total payout' }}</h3>
            <p class="mb-4 text-black text-sm leading-none">{{ betType === 'parlay' ? 'Combined odds' : 'Your original wager plus the potential winnings' }}</p>
            <input 
              type="text" 
              :value="betType === 'parlay' ? parlayOdds : '$' + potentialReturn" 
              readonly 
              class="w-full p-3 text-sm rounded border-2 border-[#00823E] font-bold" 
            />
          </div>
          
          <div v-if="betType === 'parlay'" class="">
            <h3 class="text-black font-black leading-none mb-2">Potential Return</h3>
            <p class="mb-4 text-black text-sm">Total wager and potential payout</p>
            <input type="text" :value="'$' + potentialReturn" readonly class="w-full p-3 text-sm rounded border-2 border-[#00823E] font-bold" />
          </div>

          <div>
            <button 
              @click="reset" 
              :class="[
                'border border-[#001941] text-[#001941] rounded-full pt-2.5 pb-2 px-6 cursor-pointer font-bold', 
                betType === 'single' ? 'md:relative md:-top-12' : ''
              ]"
            >
              Reset
            </button>
          </div>
        </div>

        <div :class="['relative col-span-2 p-6', betType === 'parlay' ? 'hidden md:block' : '']">
          <div class="w-full h-56">
            <Pie :data="chartData" :options="chartOptions" />
          </div>
          <div class="absolute bottom-0 left-0 w-full h-full flex items-center justify-center">
          <!-- <span class="uppercase text-white text-lg md:text-3xl font-black leading-none">FPO</span> -->
        </div>

        <!-- <div class="absolute bottom-0 left-0 w-full flex items-center justify-center">
          <div class="text-xs leading-snug w-36 bg-white p-2 rounded">{{ oddsMessage }}</div>
        </div> -->
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
    const amount = ref(150); // Default bet amount set to 150
    const format = ref('decimal');
    const decimalOdds = ref(2.5); // Default decimal odds for single bet
    const americanOdds = ref(100);
    const fractionalOdds = ref('2/1');
    const impliedProbability = ref(51);
    const bets = ref(['2.5']); // Default bet for parlay (decimal format)
    const impliedProbabilityDisplay = computed({
      get: () => `${impliedProbability.value}%`,
      set: (value) => {
        impliedProbability.value = parseInt(value.replace('%', ''), 10);
      }
    });

    const updateDefaultBet = () => {
      switch (format.value) {
        case 'american':
          bets.value = ['150'];
          break;
        case 'decimal':
          bets.value = ['2.5'];
          break;
        case 'fractional':
          bets.value = ['3/2'];
          break;
      }
    };

    watch(format, updateDefaultBet);

    const updateOdds = (type: string) => {
      switch (type) {
        case 'decimal':
          americanOdds.value = decimalOdds.value >= 2 
            ? Math.round((decimalOdds.value - 1) * 100) 
            : Math.round(-100 / (decimalOdds.value - 1));
          fractionalOdds.value = `${Math.round((decimalOdds.value - 1) * 100)}/${100}`;
          impliedProbability.value = Math.round((1 / decimalOdds.value) * 100);
          decimalOdds.value = parseFloat(decimalOdds.value.toFixed(2)); // Ensure 2 decimal points
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
          decimalOdds.value = parseFloat(decimalOdds.value.toFixed(2)); // Ensure 2 decimal points
          break;
        case 'fractional':
          const [numerator, denominator] = fractionalOdds.value.split('/').map(Number);
          decimalOdds.value = 1 + (numerator / denominator);
          americanOdds.value = numerator > denominator 
            ? Math.round((numerator / denominator) * 100) 
            : Math.round((-100 * denominator) / numerator);
          impliedProbability.value = Math.round((denominator / (numerator + denominator)) * 100);
          decimalOdds.value = parseFloat(decimalOdds.value.toFixed(2)); // Ensure 2 decimal points
          break;
        case 'implied':
          const probability = parseFloat(impliedProbability.value.toString().replace('%', ''));
          decimalOdds.value = 100 / probability;
          americanOdds.value = probability < 50 
            ? Math.round((100 / probability - 1) * 100) 
            : Math.round(-100 / (100 / probability - 1));
          fractionalOdds.value = `${Math.round((100 / probability - 1) * 100)}/${100}`;
          decimalOdds.value = parseFloat(decimalOdds.value.toFixed(2));
          break;
      }
    };

    const addBet = () => {
      if (bets.value.length < 10) {
        bets.value.push(bets.value[0]); // Add a new bet with the same odds as the first bet
      }
    };

    const removeBet = (index: number) => {
      if (bets.value.length > 1) {
        bets.value.splice(index, 1);
      }
    };

    const americanToDecimal = (americanOdds: number): number => {
      return americanOdds > 0 ? (americanOdds / 100) + 1 : (100 / Math.abs(americanOdds)) + 1;
    };

    const decimalToAmerican = (decimalOdds: number): string => {
      return decimalOdds >= 2 
        ? `+${Math.round((decimalOdds - 1) * 100)}`
        : `-${Math.round(100 / (decimalOdds - 1))}`;
    };

    const fractionalToDecimal = (fractional: string): number => {
      const [numerator, denominator] = fractional.split('/').map(Number);
      return 1 + (numerator / denominator);
    };

    const decimalToFractional = (decimal: number): string => {
      const numerator = Math.round((decimal - 1) * 100);
      const denominator = 100;
      return `${numerator}/${denominator}`;
    };

    const parlayOdds = computed(() => {
      const totalDecimalOdds = bets.value.reduce((acc, bet) => {
        let decimalOdds;
        switch (format.value) {
          case 'american':
            decimalOdds = americanToDecimal(parseFloat(bet));
            break;
          case 'fractional':
            decimalOdds = fractionalToDecimal(bet);
            break;
          default:
            decimalOdds = parseFloat(bet);
        }
        return acc * decimalOdds;
      }, 1);

      switch (format.value) {
        case 'decimal':
          return totalDecimalOdds.toFixed(2);
        case 'american':
          return decimalToAmerican(totalDecimalOdds);
        case 'fractional':
          return decimalToFractional(totalDecimalOdds);
        default:
          return totalDecimalOdds.toFixed(2);
      }
    });

    const toWin = computed(() => {
      let odds = betType.value === 'single' ? decimalOdds.value : parseFloat(parlayOdds.value);
      if (betType.value === 'parlay') {
        switch (format.value) {
          case 'american':
            odds = americanToDecimal(parseFloat(parlayOdds.value.replace('+', '')));
            break;
          case 'fractional':
            odds = fractionalToDecimal(parlayOdds.value);
            break;
        }
      }
      return ((odds - 1) * amount.value).toFixed(2);
    });

    const potentialReturn = computed(() => {
      let odds = betType.value === 'single' ? decimalOdds.value : parseFloat(parlayOdds.value);
      if (betType.value === 'parlay') {
        switch (format.value) {
          case 'american':
            odds = americanToDecimal(parseFloat(parlayOdds.value.replace('+', '')));
            break;
          case 'fractional':
            odds = fractionalToDecimal(parlayOdds.value);
            break;
        }
      }
      return (odds * amount.value).toFixed(2);
    });

    const chartData = computed(() => ({
      labels: ['Original Wager', 'Profit'],
      datasets: [{
        backgroundColor: ['#1e3a8a', '#15803d'],
        data: [amount.value, parseFloat(toWin.value)],
        borderWidth: 0
      }],
    }));

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#000000',
            font: {
              family: 'fort',
              size: 12
            }
          }
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
      amount.value = 150;
      if (betType.value === 'single') {
        decimalOdds.value = 2.5;
      } else {
        updateDefaultBet();
      }
      // ... other reset logic ...
    };

    const oddsMessage = computed(() => {
      const winAmount = parseFloat(toWin.value);
      const betAmount = amount.value;
      const probability = betType.value === 'single' ? impliedProbability.value : 0; // Only for single bets

      // Handle 100% probability case
      if (probability === 100) {
        return "Guaranteed return, but no profit to be made.";
      }
      
      // Original logic for other cases
      if (winAmount > betAmount * 2) {
        return "Looks like someone might be able to treat themselves!";
      } else if (winAmount > betAmount) {
        return "A modest profit is still a profit.";
      } else {
        return "Lower potential return. Consider your options carefully.";
      }
    });

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
      removeBet,
      reset,
      impliedProbabilityDisplay,
      oddsMessage,
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

.input-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  background: #fff;
  outline: none;
  opacity: 0.7;
  transition: opacity .2s;
}

.input-range:hover {
  opacity: 1;
}

.input-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px; 
  background: white;  
  border-radius: 50%;
  border: 2px solid #00823E;
}

.input-range::-moz-range-thumb {
  width: 24px;
  height: 24px; 
  background: white;  
  border-radius: 50%;
  border: 2px solid #00823E;
}

.custom-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: white url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmkgY2hldnJvbi1kb3duIiB2aWV3Qm94PSIwIDAgMTYgMTYiPgogIDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEuNjQ2IDQuNjQ2YS41LjUgMCAwIDEgLjcwOCAwTDggMTAuMjkzbDUuNjQ2LTUuNjQ3YS41LjUgMCAwIDEgLjcwOC43MDhsLTYgNmEuNS41IDAgMCAxLS43MDggMGwtNi02YS41LjUgMCAwIDEgMC0uNzA4Ii8+Cjwvc3ZnPg==') no-repeat right 1rem center/12px 12px;
}
</style>