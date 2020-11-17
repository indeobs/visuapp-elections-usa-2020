<template>
  <div v-if="areaData" class="TooltipProcessingballotByStateByDay maxWidth">
    <div class="stateHeader">{{ areaData.electoralAreaCode }}</div>
    <!--div v-for="result in areaData.results" :id="result.date" :key="result.date">
      {{ result }}
    </div-->
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col"></th>
          <th
            v-for="result in areaData.results"
            :id="result.ts"
            :key="result.ts"
            scope="col"
          >
            {{
              result.ts === 1604509749000 // 2020-11-04T17:09:09Z
                ? `At 11/04 ${new Date(result.ts).toLocaleString(undefined, {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                  })}`
                : `On 11/${new Date(
                    result.ts - 12 * 60 * 60 * 1000
                  ).toLocaleString('en-US', {
                    day: 'numeric',
                    timeZone: 'America/New_York',
                  })}`
              /* : `On ${new Date(result.ts).toLocaleString(undefined, { timeZone: 'America/New_York'})}` */
            }}
          </th>
          <th scope="col" class="lastCol">Last known result</th>
        </tr>
      </thead>
      <tbody>
        <tr class="row-subhead">
          <th scope="row">Percent of #votes</th>
          <td
            v-for="result in areaData.results"
            :id="result.ts"
            :key="result.ts"
            scope="col"
          >
            <!-- // use totalCount? -->
            {{ (100 * (result.totalThatDay / latestDayVotes)).toFixed(2) }}
          </td>
          <td class="lastCol">100</td>
        </tr>
        <tr v-for="contestant in contestants" :key="contestant">
          <th scope="row" class="watermarkContainer">
            <div class="watermark">
              {{
                `indeobs.org - ${new Date(buildTime)
                  .toISOString()
                  .substring(0, 16)}UTC`
              }}
            </div>
            {{ contestant }}
          </th>
          <td
            v-for="result in areaData.results"
            :id="result.ts"
            :key="result.ts"
            scope="col"
          >
            <!-- // use resultsSoFar? -->
            {{ (100 * result.resultsThatDay[contestant]).toFixed(2) }}
          </td>
          <td class="lastCol">
            {{
              (
                100 *
                areaData.results[areaData.results.length - 1].resultsSoFar[
                  contestant
                ]
              ).toFixed(2)
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import Vue from 'vue'

export default Vue.extend({
  props: {
    areaData: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      buildTime: process.env.BUILD_TIME,
    }
  },
  computed: {
    latestDayResult() {
      const last = this.areaData.results[this.areaData.results.length - 1]
      return last
    },
    latestDayVotes() {
      return Object.values(this.latestDayResult.countSoFar).reduce(
        (acc, sum) => acc + sum,
        0
      )
    },
    contestants() {
      if (!this.areaData) {
        return null
      }
      // console.log(this.areaData.results[0].date, new Date(this.areaData.results[0].date).getTime());
      const latestDayResult = this.latestDayResult
      const contestants = Object.keys(latestDayResult.resultsSoFar).sort(
        (a, b) =>
          latestDayResult.resultsSoFar[b] - latestDayResult.resultsSoFar[a]
      )
      return contestants
    },
  },
})
</script>

<style>
.maxWidth {
  width: max-content;
}

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

.lastCol {
  border-left: solid 1px #000;
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
  overflow: hidden;
  white-space: nowrap;
}
</style>
