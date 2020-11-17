
interface ElectoralAreaResult {
  date: string,
  proportion?: number,
  totalCount: number,
  resultsThatDay: Object<string, number>; // candidate, percent
  countSoFar: Object<string, number>; // candidate, voters
  resultsSoFar: Object<string, number>;  // candidate, percent
}

interface ElectoralAreaResults {
  electoralAreaCode: string;
  results: Array<ElectoralAreaResult>;
}

interface ProcessingballotByStateByDay {
  [ string ]:  ElectoralAreaResults,
}
////////////////:
interface ProcessingballotResults {
  ts: number // ms
  voteCounts: object<string, number>, // candidate, votes
}

interface ProcessingballotChangesInState {
  results: Array<ProcessingballotResults>,
  stateCode: string,
  availableDelegates: number,
}

interface ProcessingballotChangesByState {
  stateResults: Array<ProcessingballotChangesInState>,
}

///////////////
interface Timeserie {
  ts: number, // second 
  metrics: Array<number>
}
interface TimeserieInElectoralArea {
  electoralAreaCode: string, // 
  metricsDesc: Array<Object<string, string>>,
  timeserie: Timeserie,
}


