<template>
  <div class="allWidth">
    <svg
      class="MapStateUSAElectionFederal"
      :viewBox="`0 0 ${width} ${height}`"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="areas">
        <path
          v-for="featureArea in featureAreas"
          :id="featureArea.feature.properties.geo_id"
          :key="featureArea.feature.properties.geo_id"
          opacity="0.9"
          :d="featureArea.path"
          :fill="
            selectedFeatureId === featureArea.feature.properties.geo_id
              ? 'grey'
              : 'darkgrey'
          "
          @mouseover="areaHoverOver(featureArea)"
          @mouseout="areaHoverOut(null)"
        />
      </g>
      <path id="area-borders" class="areaBorders" :d="featureAreaBorders" />
    </svg>
    <TooltipProcessingballotByStateByDay
      :selected="selectedFeatureId"
      :area-data="
        selectedArea && dataByState
          ? dataByState[selectedArea.feature.properties.iso_3166_2]
          : null
      "
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import Vue from 'vue'
import * as topojson from 'topojson-client'
import type * as d3ns from 'd3'
import usAlbert from './countries-usa-states.topo.json'
import TooltipProcessingballotByStateByDay from '~/components/TooltipProcessingballotByStateByDay'

declare namespace d3 {
  const geoAlbersUsa: typeof d3ns.geoAlbersUsa
}

// const rightSideSmallStates = ['VT', 'VH', 'MA', 'RI', 'CT', 'NJ', 'DE', 'MD', 'DC']
// const congressionalDistrictMethodStates = ['ME', 'NE']

// const width = 720
// const height = 480
const width = 1080
const height = 600

const projection = ((width, height) =>
  d3
    .geoAlbersUsa()
    .scale(height / width > 0.5 ? (1070 * width) / 960 : (1070 * height) / 500) // size, bigger is bigger
    .translate([width / 2, height / 2]))(width, height)

// console.log(usAlbert)
// console.log(projection)

const featureCollection = topojson.feature<UsAlbertGeometryProperties>(
  usAlbert,
  usAlbert.objects.us
) as GeoJSON.FeatureCollection<
  GeoJSON.GeometryObject,
  UsAlbertGeometryProperties
>

// console.log(featureCollection)

const { features } = featureCollection
const path = d3.geoPath().projection(projection)

const featureAreas = features.map((feature) => ({
  path: path(feature),
  feature,
}))
const featureAreaBorders = path(
  topojson.mesh(usAlbert, usAlbert.objects.us, function () {
    return true
  })
)

// console.log('vfeatureAreas', featureAreas)
// console.log(featureAreaBorders)

export default Vue.extend({
  props: {
    dataByState: {
      type: Object,
      default() {
        return {}
      },
    }
  },
  data() {
    return {
      width,
      height,
      featureAreas,
      featureAreaBorders,
      selectedFeatureId: null,
      TooltipProcessingballotByStateByDay: null,
      selectedArea: null,
    }
  },
  methods: {
    areaHoverOver(featureArea) {
      this.selectedFeatureId = featureArea.feature.properties.geo_id
      this.selectedArea = featureArea
      // this.classes = ['animated', 'bounceIn']
    },
    areaHoverOut() {
      // console.log('out', arguments, areaId)
      this.selectedFeatureId = null
      // this.selectedArea = null
      // this.classes = []
    },
  }
})
</script>

<style>
.allWidth {
  width: 100%;
}
.NuxtMapStateUSAElectionFederal {
  animation: 1s appear;
  margin: auto;
}

.background {
  fill: none;
  pointer-events: all;
}

.graticule {
  fill: none;
  stroke: #777;
  stroke-width: 0.5;
  stroke-opacity: 0.7;
}

.areaBorders {
  fill: none;
  stroke: black;
  stroke-width: 0.7;
  stroke-linejoin: round;
  stroke-linecap: round;
  pointer-events: none;
}

.areaLimit {
  fill: none;
  stroke: red;
  stroke-width: 0.7;
  stroke-linejoin: round;
  stroke-linecap: round;
  pointer-events: none;
}

.textbox {
  position: relative;
  top: -80px;
  left: 20px;
  width: 200px;
  height: 100px;
}

.textboxP {
  margin: 0;
  font-size: 0.8em;
}

@keyframes appear {
  0% {
    opacity: 0;
  }
}
</style>
