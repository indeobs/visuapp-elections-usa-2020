const fs = require('fs');

const fsPromises = fs.promises

async function listDir() {
  const {
    data: { races }
  } = JSON.parse(
    await fsPromises.readFile('nyt-2020-election-scraper/results.json')
  )
  const data = races.map((race) => {
    const candidateKeys = race.candidates.reduce((acc, c, idx) => {
      acc[c.candidate_key] = {
        lastName: c.last_name,
        idx,
      };
      return acc
    }, {})
    return {
      electoralAreaCode: race.state_id,
      availableDelegates: race.electoral_votes,
      metricsDesc: Object.keys(
        race.timeseries[race.timeseries.length - 1].vote_shares
      ).map((key) => ({ lastName: candidateKeys[key].lastName })),
      timeserie: race.timeseries.reduce((acc, timeserie) => {
        if (timeserie.votes === 0) {
          // what is this first event about?
          // NH has a strange beginning
          return []
        }
        acc.push({
          ts: Date.parse(timeserie.timestamp) / 1000,
          metrics: Object.entries(timeserie.vote_shares).reduce((acc, [k, v]) => {
              // v is only 3 digit after comma, not precise
              acc[candidateKeys[k].idx] = Math.floor(v * timeserie.votes)
              return acc
            },
            []
          ),
        })
        return acc
      }, []),
    }
  });

  console.log(JSON.stringify(data))
}

listDir();
