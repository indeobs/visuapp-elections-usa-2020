<template>
  <div class="container">
    <h1 class="pageTitleWithSubtitle">USA Election 2020</h1>
    <div class="subtitle">Study on the impact of the late votes on the 2020 USA presidential election</div>
    <div>{{`Last updated: ${new Date(buildTime).toLocaleString()}`}}</div>
    <p />
    <h1 class="whatToLookAt">Abstract</h1>
    <div class="whatToLookAt">
      Looking at late-ballots results, they evolve
      significantly and differently depending on the state. They make Trump improve
      his score in several states, but it makes several critical states switch to Biden.
    </div>

    <div class="whatToLookAt">
      This goes against the general idea that there were so many Democratic Party
      presidential candidate late votes because the Republican candidates asked
      not to use mail-in ballots.
    </div>

    <div class="whatToLookAt">
      Data is from
      <ul>
        <li>
          <a href="https://nytimes.com">nytimes.com</a> via the github <a href="https://github.com/alex/nyt-2020-election-scraper/">nyt-2020-election-scraper</a> project (active now). nytime data seems from <a href="https://www.edisonresearch.com/election-polling/">edisonresearch</a>
          We mostly use the timeserie data there, and it might not be precise enough (percent 3 digit after commas), especially on small batches in PA. We have data from the start.
        </li>
        <li>
          <a href="https://www.foxnews.com" target="_blank">foxnews.com</a> and is freely available to use from our <a href="https://github.com/indeobs/dataset-elections-usa-2020-presidential-foxnewsfeed" target="_blank">GitHub</a> account.
          Data is polled every 10s, so we might miss very few data points. We call a change of result in one state at a given time a batch (each commit of tabulation of votes ?). Most probably feed from Associated Press?
          Ideally, the first batch would be the first time a state gives its result on the evening of 11/03. Unfortunately, we only started to grab the data from 11/04 at 12:09:09 ET, and we're actively looking for a reliable source for earlier results.
        </li>
        <li>
          We would actively promote the use of open data, so that opensource and other project can use the results directly from the election places.
        </li>
      </ul>
    </div>

    <div class="whatToLookAt">
      This is a provisional work and reviews are welcomed on the GitHub project.  
    </div>

    <div v-if="dataByStateByDay" class="allWidth">
      <h1>Votes per state per day</h1>
        <MapCountryUsaElectionFederal
            :data-by-state="dataByStateByDay"
        />
    </div>

    <p v-if="dataProvider === 'fox'" class="explanation">
      The "On 11/x" column is only about votes accounted between 6 am ET that
      day and 6 am ET the following day. Except for the "On 11/4" column, where
      the count starts at 12:09:09 ET.
    </p>

    <p v-if="dataProvider === 'fox'" class="explanation">
      On-time ballots, votes "At 11/04 12:09:09 ET" contains :
      <ul>
        <li>Ballots cast on 11/3</li>
        <li>Ballots cast on 11/4 before 12:09:09 ET (we're looking for official results on 11/3 6 am ET to remove this)</li>
        <li>Ballots from voted-early at the polls that could be counted before 11/4 12:09:09 ET</li>
        <li>Early-returned vote-by-mail ballots that could be counted before 11/4 12:09:09 ET</li>
      </ul>

      Late-ballots contains :
      <ul>
        <li>Mail-in ballots that couldn't be counted before 11/3 evening</li>
        <li>Mail-in ballots that couldn't be counted before 11/4 12:09:09 ET </li>
        <li>Provisional ballots (marginally, <a href="https://www.azcentral.com/story/news/politics/elections/2020/11/05/arizona-vote-counting-slowed-early-ballots-arriving-election-day/6180648002/" target="_blank">less than 1% of late votes in Maricopa County in AZ</a>, but may vary greatly by county?)</li>
      </ul>
    </p>
    
    <p v-if="dataProvider !== 'fox'" class="explanation">
      On-time ballots, votes  contains :
      <ul>
        <li>Ballots cast on 11/3 and before 11/04 at 04:00 am ET"</li>
        <li>Ballots from voted-early at the polls that could be counted before 11/04 at 04:00 am ET</li>
        <li>Early-returned vote-by-mail ballots that could be counted before 11/04 at 04:00 am ET</li>
      </ul>

      Late-ballots contains :
      <ul>
        <li>Mail-in ballots that couldn't be counted before 11/04 at 04:00 am ET </li>
        <li>Provisional ballots (marginally, <a href="https://www.azcentral.com/story/news/politics/elections/2020/11/05/arizona-vote-counting-slowed-early-ballots-arriving-election-day/6180648002/" target="_blank">less than 1% of late votes in Maricopa County in AZ</a>, but may vary greatly by county?)</li>
      </ul>
    </p>
    
    <p>
      Provisional ballots are given to voters who can't verify their ID at the polls or who received a mail-in ballot but decided to vote in person.
      Hopefully, later update of the app will try to make each state vote policy more easily understandable.
    </p>


    <p  v-if="dataProvider === 'fox'" class="explanation">
      Fox data starts on 11/04 at 12:09:09 ET because it was only started to be grabbed from that time. If by any chance, someone
      has more data, please contact us at <a href="https://github.com/indeobs/dataset-elections-usa-2020-presidential-foxnewsfeed" target="_blank">GitHub</a>
      or by email at github@indeobs.com. This would be important data to have, especially for Wisconsin and Michigan.
    </p>


    <TableTrumpVsBidenAndOnTimeVsLate
      :derivation-by-state="derivationByState"
    />

    <p class="explanation">
      3 metrics are available in this table when comparing on-time and late vote results. The table is sorted by the last column.

      <ul>
        <li>Derivation: how far the two groups are different of each other</li>
        <li>% of votes late: is the proportion of late votes</li>
        <li>% favoring Biden induced by late votes: how much late votes changed the result. Negative results mean that Trump had gains</li>
      </ul>

      We ruled out votes for other candidates here, for sake of clarity. So the final percentage might look different than the official results (higher for both candidates)
    </p>



    <h1>Votes Biden vs. Trump</h1>
    <div class="fullWidth row">
      <div v-for="batchesInElectoralArea in batchesByElectoralAreaSorted" :key="batchesInElectoralArea.electoralAreaCode" class="col-6 col-sm-3">
        <GraphVotesEvolutionBidenVsTrumpByState
          :timeserie-in-electoral-area="batchesInElectoralArea.timeserieInElectoralArea"
          :days="batchesInElectoralArea.days.slice(0, 1)"
        />
      </div>
    </div>
    <p class="explanation">
      These graphs show the evolution of the score for each candidate. The horizontal axis is not the date, but the sum of total votes for Biden or Trump.
      As some states are really slow counting, this is more visually accurate. Also, this way, the area blue or red is proportional to the number
      of voters and allow a good visualization.
    </p>
    <p class="explanation">
      The caveat is that the area doesn't show when the total of votes is getting lower. Sometimes, votes get invalidated or at least decrease for other reasons.
    </p>
    <p class="explanation">
      Surprisingly, sometimes candidates get all the votes on one batch. This could be explained if people input a result two times, or there are
      very few people on one batch. Most notable is a batch giving 23277 votes to Biden and 0 to Trump in PA, 11/04 15:41 ET, which doesn't seem correlated with
      another close batch favoring Trump around the same time. This is a very unlikely event.
    </p>
    <p class="explanation">
      The golden line shows the evolution of the score in the Biden/Trump battle. Votes for other candidates were removed for sake of simplification. This way, 
      the winner is the one who gets to 50% on the right end of the graph. The 50% line is shown with dashes. The final winner is the one who gets the golden line in the other area.
    </p>
    <p class="explanation">
      This golden line shows when votes are getting invalided, by going left. This effect is clearly visible in Indiana.
    </p>



    <h1>About election processes</h1>
    <p class="explanation">
      <a href="https://people.csail.mit.edu/rivest/Rivest-ElectronicVoting.pdf" target="_blank">Here is a writing</a> that tells how electronic voting, or massive usage of absentee ballots, is not reliable.
      It is written by Turing award winner Ronald Rivest.
      It includes the cases where electronic devices are used just for counting.
    </p>

    <p class="explanation">
      On the other hand, postal voting, and electronic voting, seem implemented quite successfully in Switzerland, even though some <a href="https://en.wikipedia.org/wiki/Electronic_voting_in_Switzerland">security concerns</a> emerged.
    </p>
    
    <p class="explanation">
      However, one cannot imply an electronic device or software is at fault here to explain the bias. It's hard to explain the bias, and there
      could be a lot of reason, even without thinking about fraud. It could be than some specific groups in PA are very against mail-in ballots, and the batch with no vote for Trump is just a mistake.
      Anyway, full people-supervised recount would be enough to rules-out electronic device fault.
      
      There are many other ways the USA election could be improved and become more trustable to everyone, and the cause of the bias should be investigated and explained to improve the trust.
    </p>
    
    <p class="explanation">
      We would actively advise to adopt Open Data initiatives for democratic election. This way we would be able to know the result without having to go through the main stream media.
    </p>

    <h1>About us</h1>
    <p class="explanation">
      We value transparency. We also realize we purposefully try to expose bias with statistics. If you don't agree with something
      or think that the data is misleading, please open an issue on the GitHub project to talk about it.
    </p>

    <p class="explanation">You're also welcomed to contribute to making this page better. This wep app is opensource and based on <a href="https://www.nuxtjs.org" target="_blank">Nuxt.js</a> and <a href="https://d3js.org/">d3js</a></p>

    <p class="explanation">
      If you're an individual or a company with revenue of less than 1 million USD, you're welcome to take screenshots of this page and share it, as long as you add the date and time at which you take the screenshot and a mention to IndeObs to the screenshot, you provide an easily clickable link to https://www.indeobs.com/ when sharing, and don't tamper with its content too much.
    </p>

    <p class="explanation">
      Timestamping screenshot is wanted because we're hopefully getting more accurate data from 11/3 & 11/4 sooner, and we'll update then.
    </p>

    <!--p class="explanation">
      Aucun obstacle, aucun mécompte, aucun chagrin ne me détourne ou me ralentit dans le but unique de ma vie : le bien-être de tous, et la liberté partout. Marquis De La Fayette.
    </p-->

    <div class="links">
      <a
        href="https://github.com/indeobs/visuapp-elections-usa-2020"
        target="_blank"
        rel="noopener noreferrer"
        class="button--grey"
      >
        GitHub
      </a>
    </div>

    <p>
      #PardonSnowdenPlease #PardonWhistleblowersPlease #IndeObs
    </p>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import Vue from 'vue' //
// import TooltipProcessingballotByStateByDay from '~/components/TooltipProcessingballotByStateByDay'
import foxPresidentialTimeseriesByElectoralArea from '~/gen/fox-processingballot-timeseries-by-electoral-area.json'
import nytPresidentialTimeseriesByElectoralArea from '~/gen/nyt-processingballot-timeseries-by-electoral-area.json'

const dataByNewsOutlet = {
  fox: {
    upstreamProvider: 'AP?',
    presidentialTimeseriesByElectoralArea: foxPresidentialTimeseriesByElectoralArea,
    startsLate: true,
  },
  nyt: {
    upstreamProvider: 'edison',
    presidentialTimeseriesByElectoralArea: nytPresidentialTimeseriesByElectoralArea,
  },
};

const dataProvider = 'nyt'
const importedData = dataByNewsOutlet[dataProvider];

export default Vue.extend({
  data() {
    return {
      // TooltipProcessingballotByStateByDayByDay,
      buildTime: process.env.BUILD_TIME,
      dataProvider,
    }
  },
  computed: {
    dataByStateByDay() {
      if (!importedData.presidentialTimeseriesByElectoralArea) {
        return null
      }

      const data = importedData.presidentialTimeseriesByElectoralArea.reduce((acc, ballotChangesInElectoralArea) => {
        const { electoralAreaCode, timeserie, metricsDesc } = ballotChangesInElectoralArea
        const stepDate = new Date(Date.UTC(2020, 11-1, 4, 9));
        let previousDayEvent;
        let previousEvent;
        // const totalCountMetrics = metricsDesc.map(() => 0)
        acc[electoralAreaCode] = {
          electoralAreaCode,
          results: timeserie.reduce((acc2, event) => {
            const { ts: thisTsSeconds } = event
            const thisTs = 1000 * thisTsSeconds;
            if (thisTs <= stepDate.getTime()) {
              previousEvent = event;
              return acc2;
            }
            const { ts: tsSeconds, metrics } = previousEvent || event
            const ts = 1000 * tsSeconds;
            const totalCount = metrics.reduce((acc3, m) => acc3 + m, 0);
            const totalThatDay = totalCount - (previousDayEvent ? previousDayEvent.metrics.reduce((acc3, m) => acc3 + m, 0) : 0)

            /* if (electoralAreaCode === 'ME') {
              console.log(electoralAreaCode, metrics)
              console.log(stepDate, totalCount, totalThatDay, previousDayEvent ? previousDayEvent.metrics.reduce((acc3, m) => acc3 + m, 0) : 0)
            } */
            const subdata = {
              ts,
              totalThatDay,
              totalCount,
              resultsThatDay: metrics.reduce((acc3, m, idx) => {
                acc3[metricsDesc[idx].lastName] = (m - (previousDayEvent ? previousDayEvent.metrics[idx] : 0)) / totalThatDay;
                return acc3;
              }, {}),
              countSoFar: metrics.reduce((acc3, m, idx) => {
                acc3[metricsDesc[idx].lastName] = m;
                return acc3;
              }, {}),
              resultsSoFar: metrics.reduce((acc3, m, idx) => {
                acc3[metricsDesc[idx].lastName] = m / totalCount;
                return acc3;
              }, {}),
            };
            acc2.push(subdata);
            const daysToAdd = Math.ceil((thisTs - stepDate.getTime()) / (24 * 60 * 60 * 1000));
            stepDate.setDate(stepDate.getDate() + daysToAdd);
            /* if (electoralAreaCode === 'ME') {
              console.log('thisTs', new Date(thisTs))
              console.log('daydata', subdata)
              console.log('day to add ', stepDate, stepDate.getDate() + daysToAdd, daysToAdd)
            } */
            previousDayEvent = previousEvent || event; 
            previousEvent = event;
            return acc2;
          }, []),
        };
        return acc;
      }, {});
      return data;
    },
    derivationByState() {
      if (!this.dataByStateByDay) {
        return null
      }
      // console.log(this.dataByStateByDay)
      const data = Object.entries(this.dataByStateByDay).reduce((acc, [electoralAreaCode, v]) => {
          if (v.results.length === 1) {
            return acc
          }
          const firstDayResult = v.results[0]
          const latestDayResult = v.results[v.results.length - 1]
          const totalCount = latestDayResult.totalCount
          const totalLateCount = totalCount - firstDayResult.totalCount
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
          // console.log(electoralAreaCode, 'biden', onTimeBidenProp, lateBidenProp)
          // console.log(electoralAreaCode, 'trump', onTimeTrumpProp, lateTrumpProp)
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
    batchesByElectoralAreaSorted() {
      return this.derivationByState.reduce((acc, deriv) => {
        const { electoralAreaCode } = deriv
        const timeserieInElectoralArea = importedData.presidentialTimeseriesByElectoralArea.find(p => p.electoralAreaCode === electoralAreaCode)
        const days = this.dataByStateByDay[electoralAreaCode].results.map(r => ({ ts: r.ts, totalCount: r.totalCount }))
        if (timeserieInElectoralArea) {
          acc.push({
            electoralAreaCode,
            timeserieInElectoralArea,
            days
          })
        }
        return acc;
      }, [])
    },
  },
  head() {
    return {
      title: 'Study on the impact of the late votes on the 2020 USA presidential election',
    }
  },
})
</script>

<style>
body {
  background-color: rgb(20, 22, 25);
  color: white;
}


.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
}

.subtitle {
  font-size: 110%;
}

.fullWidth {
  width: 100%;
}

.pageTitleWithSubtitle {
  margin-bottom: 0px;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.whatToLookAt {
  align-self: flex-start;
  text-align: justify;
}

.allWidth {
  width: 100%;
}

.explanation {
  align-self: flex-start;
  text-align: justify;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
