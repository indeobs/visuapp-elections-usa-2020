// global.d.ts

import * as TopoJSON from 'topojson-specification'

/* eslint-disable camelcase */
interface UsAlbertGeometryProperties {
  geo_id: string
  fips_state: string
  name: string
  census: string
  pop_estimataes_base: number
  pop_2010: number
  pop_2011: number
  pop_2012: number
  pop_2013: number
  pop_2014: number
}
/* eslint-enalble camelcase */

declare module '*.topo.json' {
  const value: TopoJSON.Topology<TopoJSON.Objects<
    TopoJSON.GeometryCollection<UsAlbertGeometryProperties>
  >>
  export default value
}
