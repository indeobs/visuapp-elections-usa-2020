<template>
  <div v-if="derivationByState">
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
            <td class="watermarkContainer">
              <div class="watermark">
                {{
                  `indeobs.org - ${new Date(buildTime)
                    .toISOString()
                    .substring(0, 16)}UTC`
                }}
              </div>
              {{ derivation.electoralAreaCode }}
            </td>
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
    derivationByState: {
      type: Array,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      buildTime: process.env.BUILD_TIME,
    }
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

.watermarkContainer {
  position: relative;
}

.watermark {
  color: rgb(100, 100, 100);
  position: absolute;
  bottom: 0px;
  font-size: 10px;
  right: 0px;
}

.stateHeader {
  font-weight: bold;
  font-size: 200%;
}
</style>
