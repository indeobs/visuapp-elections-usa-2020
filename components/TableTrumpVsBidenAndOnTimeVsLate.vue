<template>
  <div v-if="dataByState">
    <h1>Votes comparison Biden vs. Trump, on-time ballots vs late ballots.</h1>
    <div class="TooltipProcessingballotByStateByDay">
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Electoral Area Code</th>
            <th scope="col">Derivation %</th>
            <th scope="col">% of votes late</th>
            <th scope="col">% favoring Biden induced by late votes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="derivation in derivationByState" :key="derivation.state">
            <td>{{ derivation.electoralAreaCode }}</td>
            <td>{{ (100 * derivation.derivation).toFixed(2) }}</td>
            <td>{{ (100 * derivation.proportionLateVote).toFixed(2) }}</td>
            <td>{{ (100 * derivation.change).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import Vue from 'vue'

export default Vue.extend({
  props: {
    dataByState: {
      type: Object,
      default() {
        return {}
      },
    }
  },
  computed: {
    derivationByState() {
      if (!this.dataByState) {
        return null
      }
      const data = Object.entries(this.dataByState).reduce((acc, [electoralAreaCode, v]) => {
          if (v.results.length === 1) {
            return acc
          }
          const firstDayResult = v.results[0]
          const latestDayResult = v.results[v.results.length - 1]
          const totalCount = v.results.reduce((sum, e) => sum + e.totalCount, 0)
          const totalLateCount = totalCount - v.results[0].totalCount
          const proportionLateVote = totalLateCount / totalCount
          if (proportionLateVote < 0.01) {
            // remove area with little late votes, < 1%
            return acc
          }

          const onTimeBidenTrumpCount = firstDayResult.countSoFar.Biden + firstDayResult.countSoFar.Trump
          const onTimeBidenProp = firstDayResult.countSoFar.Biden / onTimeBidenTrumpCount
          const onTimeTrumpProp = firstDayResult.countSoFar.Trump / onTimeBidenTrumpCount

          const totalBidenCount = latestDayResult.countSoFar.Biden
          const totalTrumpCount = latestDayResult.countSoFar.Trump

          const lateBidenCount = totalBidenCount - firstDayResult.countSoFar.Biden
          const lateTrumpCount = totalTrumpCount - firstDayResult.countSoFar.Trump
          const lateBidenTrumpCount = lateBidenCount + lateTrumpCount

          const lateBidenProp = lateBidenCount / lateBidenTrumpCount
          const lateTrumpProp = lateTrumpCount / lateBidenTrumpCount

          const derivation = (lateBidenProp - onTimeBidenProp) - (lateTrumpProp - onTimeTrumpProp)
          console.log(electoralAreaCode, 'biden', onTimeBidenProp, lateBidenProp)
          console.log(electoralAreaCode, 'trump', onTimeTrumpProp, lateTrumpProp)
          // console.log(electoralAreaCode, 'trump', v.results[0].resultsSoFar.Trump, propTrumpLate)
          acc.push({
            electoralAreaCode,
            derivation,
            proportionLateVote,
            change: derivation * proportionLateVote,
          })
          return acc
        }, [])
        .sort((a, b) => b.change - a.change)
      return data
    },
  },
})
</script>

<style>
.TooltipProcessingballotByStateByDay {
  background-color: grey;
}

.row-subhead {
  background-color: rgb(78, 70, 70);
  color: white;
}

.stateHeader {
  font-weight: bold;
  font-size: 200%;
}
</style>
