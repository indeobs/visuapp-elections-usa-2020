<template>
  <div v-if="batchesData" class="GraphVotesEvolutionBidenVsTrumpByState">
    <div>{{ batchesData.electoralAreaCode }}</div>
    <svg ref="svg" :viewBox="`0 0 ${width} ${height}`" />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import Vue from 'vue'
// https://observablehq.com/@d3/stacked-area-chart

export default Vue.extend({
  props: {
    batchesData: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      height: 250,
      width: 250,
    }
  },
  computed: {
    votesTrumpVsBiden() {
      if (!this.batchesData) {
        return null
      }

      const { metricsDesc, timeserie } = this.batchesData
      const bidenIndex = metricsDesc.findIndex(
        (desc) => desc.lastName === 'Biden'
      )
      const trumpIndex = metricsDesc.findIndex(
        (desc) => desc.lastName === 'Trump'
      )

      let previousResult
      let soFarBT = 0
      // for each result, we're interested in the result as compared to the previous one, and not the big totals so far
      // we only store datapoint with increasing Biden+Trump votes, as we wouldn't know how to display when this total is decreasing
      // this could be misleading, need to check cases later
      const data = timeserie.reduce((acc, { metrics }) => {
        const thisBT = metrics[bidenIndex] + metrics[trumpIndex] - soFarBT
        if (!previousResult || thisBT > 0) {
          let newResult
          if (previousResult === undefined) {
            newResult = {
              soFarBT,
              thisBT,
              b: metrics[bidenIndex] / thisBT,
              t: metrics[trumpIndex] / thisBT,
            }
          } else {
            newResult = {
              soFarBT,
              thisBT,
              b: (metrics[bidenIndex] - previousResult[bidenIndex]) / thisBT,
              t: (metrics[trumpIndex] - previousResult[trumpIndex]) / thisBT,
            }
          }
          /*
          if (newResult.b < 0.01) {
            console.log(
              'low biden result',
              electoralAreaCode,
              metrics,
              newResult
            )
          }
          // console.log PA result at 1604522460000
          // TODO: do a visual?
          if (newResult.t < 0.01) {
            console.log(
              'low trump result',
              electoralAreaCode,
              new Date(ts),
              metrics,
              newResult
            )
          } else if (
            1604522460000 - 30 * 60 * 1000 < ts &&
            ts < 1604522460000 + 30 * 60 * 1000
          ) {
            console.log(
              'around 10mins low trump result',
              electoralAreaCode,
              new Date(ts),
              metrics,
              newResult
            )
          }
          */
          acc.push(newResult)
          // hack to get rectangle areas
          acc.push({
            soFarBT: newResult.soFarBT + newResult.thisBT,
            thisBT: 0,
            b: newResult.b,
            t: newResult.t,
          })
          soFarBT += thisBT
          previousResult = metrics
        }
        return acc
      }, [])

      // console.log('votesTrumpVsBiden', stateResult.results.slice(0, 3))
      // console.log('votesTrumpVsBiden', data.results.slice(0, 3))
      return data
    },

    votesTrumpVsBidenPercentSoFar() {
      if (!this.batchesData) {
        return null
      }

      const { metricsDesc, timeserie } = this.batchesData
      const bidenIndex = metricsDesc.findIndex(
        (desc) => desc.lastName === 'Biden'
      )
      const trumpIndex = metricsDesc.findIndex(
        (desc) => desc.lastName === 'Trump'
      )
      const data = timeserie.reduce((acc, { metrics }, idx) => {
        const count = metrics[bidenIndex] + metrics[trumpIndex]
        const trumpScore = metrics[trumpIndex] / count
        if (idx === 0) {
          acc.push([0, trumpScore])
        }
        acc.push([count, trumpScore])
        return acc
      }, [])
      // console.log('votesTrumpVsBidenPercentSoFar', data.slice(0, 3))
      return data
    },
  },
  mounted() {
    const { svg: svgElement } = this.$refs
    const margin = { top: 20, right: 30, bottom: 30, left: 40 }

    // console.log(this.width, this.height)
    // console.log('v', this.votesTrumpVsBiden.slice(0, 3))
    /* const x = d3.scaleUtc()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, this.width - margin.right])
      */
    const lastKnownTotalBTResult = this.votesTrumpVsBiden[
      this.votesTrumpVsBiden.length - 1
    ]
    const lastKnownTotalBTVotes =
      lastKnownTotalBTResult.soFarBT + lastKnownTotalBTResult.thisBT
    const x = d3
      .scaleLinear()
      .domain([0, lastKnownTotalBTVotes])
      .nice()
      .range([margin.left, this.width - margin.right])
    const xAxis = (g) =>
      g.attr('transform', `translate(0,${this.height - margin.bottom})`).call(
        d3
          .axisBottom(x)
          .ticks(this.width / 80)
          .tickSizeOuter(0)
      )

    // Object.assign(d3.csvParse(await FileAttachment('unemployment-2.csv').text(), d3.autoType), {y: 'Unemployment'})
    // const svg = d3.create('svg').attr('viewBox', [0, 0, width, height])
    const svg = d3.select(svgElement)

    // const data = this.votesTrumpVsBiden
    const data = this.votesTrumpVsBiden
    const columns = ['t', 'b']
    const series = d3.stack().keys(columns)(data)
    // console.log('series', series)

    const y = d3
      .scaleLinear()
      .domain([0, 1])
      .nice()
      .range([this.height - margin.bottom, margin.top])

    const color = d3.scaleOrdinal().domain(columns).range(['red', 'blue'])
    const area = d3
      .area()
      .x((d) => x(d.data.soFarBT))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))

    svg
      .append('g')
      .selectAll('path')
      .data(series)
      .join('path')
      .attr('fill', ({ key }) => color(key))
      .attr('d', area)
      .append('title')
      .text(({ key }) => (key === 't' ? 'Trump' : 'Biden'))

    svg.append('g').call(xAxis)

    // 50% horizontal line

    // Define the line
    const line50 = d3
      .line()
      .x((d) => x(d))
      .y(() => y(0.5))

    const horizontal50LineData = [0, lastKnownTotalBTVotes]
    // Add the valueline path.
    svg
      .append('path')
      .attr('class', 'line50')
      .attr('d', line50(horizontal50LineData))

    const winnerLineData = this.votesTrumpVsBidenPercentSoFar
    const winnerLine = d3
      .line()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]))

    // Add the valueline path.
    svg
      .append('path')
      .attr('class', 'winnerLine')
      .attr('d', winnerLine(winnerLineData))

    svg
      .append('text')
      .attr('x', () => x(0))
      .attr('y', () => y(1.05))
      .text(
        () => `
        indeobs.org - ${new Date(process.env.BUILD_TIME)
          .toISOString()
          .substring(0, 16)}UTC`
      )
      .attr('font-family', 'sans-serif')
      .attr('font-size', '10px')
      .attr('fill', 'rgb(200, 200, 200)')
    /*
    const yAxis = (g) =>
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call((g) => g.select('.domain').remove())
        .call((g) =>
          g
            .select('.tick:last-of-type text')
            .clone()
            .attr('x', 3)
            .attr('text-anchor', 'start')
            .attr('font-weight', 'bold')
            .text(data.y)
        )
    svg.append('g').call(yAxis)
    */

    return svg.node()
  },
})
</script>

<style>
.GraphVotesEvolutionBidenVsTrumpByState {
  background-color: grey;
  flex-direction: column;
  margin-bottom: 10px;
}

.row-subhead {
  background-color: rgb(78, 70, 70);
  color: white;
}

.stateHeader {
  font-weight: bold;
  font-size: 200%;
}

.line50 {
  fill: none;
  stroke: grey;
  stroke-width: 1;
  shape-rendering: crispEdges;
  stroke-dasharray: 3, 3;
}

.winnerLine {
  fill: none;
  stroke: #ffd000; /* gold */
  stroke-width: 2;
  shape-rendering: crispEdges;
}

.watermark {
  color: rgb(100, 100, 100);
}
</style>
