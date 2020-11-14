
interface ElectoralAreaResult {
  date: string,
  proportion: number,
  totalCount: numver:
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
  voteCounts: Object<string, number> // candidate, votes
}

interface ProcessingballotChangesByState {
  results: Array<ProcessingballotResults>,
  stateCode: string,
  availableDelegates: number,
}

interface ProcessingballotChangesByState {
  stateResults: Array<ProcessingballotChanges>,
}

