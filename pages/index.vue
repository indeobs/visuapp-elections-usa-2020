<template>
  <div class="container">
    <h1 class="pageTitleWithSubtitle">USA Election 2020</h1>
    <div class="subtitle">Votes per state</div>
    <div>{{`Last updated: ${new Date(buildTime).toLocaleString()}`}}</div>
    <p />
    <div class="whatToLookAt">Abstract</div>
    <div class="whatToLookAt">
      Looking at late-ballots results, they evolves
      significantly differently depending on the state. They make Trump improve
      his score in several states, but it makes several
      few critical states switch to Biden.
    </div>

    <div class="whatToLookAt">
      This goes against the general idea that there was so many Democratic Party
      presidential candidate late votes because the Republican candidates asked
      not to use mail-in ballots.
    </div>

    <div class="whatToLookAt">
      Data is from <a href="https://www.foxnews.com" target="_blank">foxnews.com</a>, and is freely available to use from our <a href="https://github.com/indieobs/dataset-elections-usa-2020-presidential-foxnewsfeed" target="_blank">github</a> account.
    </div>
    
    <MapCountryUsaElectionFederal
        :data-by-state="tooltipProcessingballotByStateByDayData"
    />
    
    <p class="explanation">
      The "On 11/x" column is only about votes accounted between 6am Eastern time that
      day and 6am Eastern time the following day. Except for the "On 11/4" column, where
      the count starts at 12:09:09 East Time.
    </p>

    <p class="explanation">
      On-time ballots, votes "At 11/04 18:09:09" contains :
      <ul>
        <li>ballots cast on 11/3</li>
        <li>ballots cast on 11/4 before 12:09:09 East Time (we're looking for official results on 11/3 6am Eastern Time to remove this)</li>
        <li>ballots from voted-early at the polls that could be counted before 11/4 12:09:09 East Time</li>
        <li>early-returned vote-by-mail ballots that could be counted before 11/4 12:09:09 East Time</li>
      </ul>

      Late-ballots contains :
      <ul>
        <li>mail-in ballots that couldn't be counted before 11/3 evening</li>
        <li>mail-in ballots that couldn't be counted before 11/4 12:09:09 East Time </li>
        <li>provisional ballots (marginally, <a href="https://www.azcentral.com/story/news/politics/elections/2020/11/05/arizona-vote-counting-slowed-early-ballots-arriving-election-day/6180648002/" target="_blank">less than 1% of late votes in Maricopa County in AZ</a>, but may vary greatly by county?)</li>
      </ul>
      
      Provisional ballots are given to voters who can't verify their ID at the polls or who received a mail-in ballot but decided to vote in person.
      We will try to make each state vote policy more easily understandable in a later update.
    </p>

    <p class="explanation">
      Data starts on 11/04 12:09:09 East Coast because we only started to grab it from that time. If by any chance, someone
      has more data, please contact us at <a href="https://github.com/indieobs/dataset-elections-usa-2020-presidential-foxnewsfeed" target="_blank">github</a>
      or by email at github@indieobs.com. This would be important data to have for Wisconsin and Michigan.
    </p>

    <TableTrumpVsBidenAndOnTimeVsLate
      :data-by-state="tooltipProcessingballotByStateByDayData"
    />

    <p class="explanation">
      We value transparency. We also realize we purposefully try to expose bias with statistics. If you don't agree with something,
      or think that the data is misleading, please open an issue on the github project to talk about it.
    </p>

    <p class="explanation">You're also welcomed to contribute to make this page better. This app is opensource and based on <a href="https://www.nuxtjs.org" target="_blank">Nuxt.js</a></p>

    <p class="explanation">
      <a href="https://people.csail.mit.edu/rivest/Rivest-ElectronicVoting.pdf" target="_blank">Here is a study</a> that explains how electronic voting is not reliable.
      It is written by Turing award winner Ronald Rivest.
      There is yet to be found a security expert that would disagree with Ron. 
    
      We could probably extend the study to any election process where electronic
      devices are used, with possible way to check how each batch results are accounted for.
    </p>
    
    <p class="explanation">
      We don't want to imply an electronic device or software is at fault here to explain the bias. We have no idea, and there
      could be a lot of reason, and maybe even legal ones. But there are many other ways USA
      election could be improved and become more trustworthy to everyone, and the cause of the bias should be investigated to improve trust in it.
    </p>
    
    <p class="explanation">
      You're welcome to take screenshot of this page and share it, as long as you add the date and time at which you take the screenshot and a mention to IndieObs to the screenshot, and you provide a easily clickable link to https://www.indieobs.com/ when sharing.
      Timestamping screenshot is wanted because we're hopefully get more acurate data from 11/3 & 11/4 sooner, and we'll update then.
    </p>

    <p class="explanation">
      Aucun obstacle, aucun mécompte, aucun chagrin ne me détourne ou me ralentit dans le but unique de ma vie : le bien-être de tous, et la liberté partout. Marquis De La Fayette.
    </p>

    <div class="links">
      <a
        href="https://github.com/indieobs/indieobs-visuapp-elections-usa-2020"
        target="_blank"
        rel="noopener noreferrer"
        class="button--grey"
      >
        GitHub
      </a>
    </div>

    <p>
      #PardonSnowdenPlease
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue' //
// import TooltipProcessingballotByStateByDay from '~/components/TooltipProcessingballotByStateByDay'
import tooltipProcessingballotByStateByDayData from '~/gen/processingballot-by-state-by-day.json'

export default Vue.extend({
  data() {
    return {
      // TooltipProcessingballotByStateByDay,
      tooltipProcessingballotByStateByDayData,
      buildTime: process.env.BUILD_TIME,
    }
  },
  head() {
    return {
      title: 'Democratic biases of late-ballots results in Swing States',
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
