const SECRETKEY = '$2a$10$95O3pYS8s40pMgpxV.LKI.n5pC9JTNFa3MODMZzfDG2JAZ3mhrIFe';

function regionClick(region) {
  getElectionsData(region);
}

function mean(arr) {
  return arr.reduce((p, c, _, a) => p + c / a.length, 0);
}

function groupBy(data, key) {
  return data.reduce((acc, row) => {
    if (!acc[row[key]]) {
      acc[row[key]] = [];
    }
    acc[row[key]].push(row);
    return acc;
  }, {});
}

function getElectionsData(regionInput) {
  const req = new XMLHttpRequest();
  req.open('GET', 'https://api.jsonbin.io/b/5d01889058196b429f531883', true);
  req.setRequestHeader('secret-key', SECRETKEY);
  req.onload = () => {
    const jsonResponse = req.response;
    const countryData = JSON.parse(jsonResponse);
    const regions = [...new Set(countryData.map(d => d.Region))];
    const regionData = [];

    regions.forEach(region => {
      const specificRegion = {};
      const regionDataFirstMean = mean(
        countryData
          .filter(d => d.Region === region && d.ElectionYear <= 2005)
          .map(d => d.WeightedElectionScore)
      );
      const regionDataLastMean = mean(
        countryData
          .filter(d => d.Region === region && d.ElectionYear > 2005)
          .map(d => d.WeightedElectionScore)
      );
      specificRegion.Region = region;
      specificRegion.MeanScore = mean([regionDataFirstMean, regionDataLastMean]);
      regionData.push(specificRegion);
    });

    const chart = document.getElementById('RegionsBarChart');
    const regionDataR = groupBy(regionData, 'Region');
    const regionDataM = groupBy(regionData, 'MeanScore');

    const regionsBarChart = new Chart(chart, {
      type: 'bar',
      data: {
        labels: Object.keys(regionDataR),
        datasets: [
          {
            label: 'Mean Political Leaning',
            data: Object.keys(regionDataM).map(x => parseFloat(x).toFixed(2)),
            backgroundColor: [
              'rgba(166, 206, 227, 0.5)',
              'rgba(31, 120, 180, 0.5)',
              'rgba(178, 223, 138, 0.5)',
              'rgba(51, 160, 44, 0.5)',
              'rgba(251, 154, 153, 0.5)',
              'rgba(227, 26, 28, 0.5)',
              'rgba(253, 191, 111, 0.5)',
              'rgba(255, 127, 0, 0.5)',
              'rgba(202, 178, 214, 0.5)',
              'rgba(106, 61, 154, 0.5)',
              'rgba(177, 89, 40, 0.5)'
            ],
            borderColor: [
              'rgba(166, 206, 227, 1)',
              'rgba(31, 120, 180, 1)',
              'rgba(178, 223, 138, 1)',
              'rgba(51, 160, 44, 1)',
              'rgba(251, 154, 153, 1)',
              'rgba(227, 26, 28, 1)',
              'rgba(253, 191, 111, 1)',
              'rgba(255, 127, 0, 1)',
              'rgba(202, 178, 214, 1)',
              'rgba(106, 61, 154, 1)',
              'rgba(177, 89, 40, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Weighted Probability Score'
              }
            }
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Regions'
              }
            }
          ]
        },
        legend: {
          display: false
        }
      }
    });

    if (regionInput !== undefined && regionInput !== 'reset') {
      const countriesInRegion = countryData.filter(d => d.Region === regionInput && d.ElectionYear > 2005);

      const countryDataC = groupBy(countriesInRegion, 'Country');
      const countryDataM = groupBy(countriesInRegion, 'WeightedCountryScore');

      $('RegionsBarChart').remove();
      $('barChart1Vis').append('<canvas id="RegionsBarChart"><canvas>');

      const countriesBarChart = new Chart(chart, {
        type: 'bar',
        data: {
          labels: Object.keys(countryDataC),
          datasets: [
            {
              label: 'Mean Political Leaning in Region',
              data: Object.keys(countryDataM).map(x => parseFloat(x).toFixed(2)),
              backgroundColor: [
                'rgba(166, 206, 227, 0.5)',
                'rgba(31, 120, 180, 0.5)',
                'rgba(178, 223, 138, 0.5)',
                'rgba(51, 160, 44, 0.5)',
                'rgba(251, 154, 153, 0.5)',
                'rgba(227, 26, 28, 0.5)',
                'rgba(253, 191, 111, 0.5)',
                'rgba(255, 127, 0, 0.5)',
                'rgba(202, 178, 214, 0.5)',
                'rgba(106, 61, 154, 0.5)',
                'rgba(177, 89, 40, 0.5)'
              ],
              borderColor: [
                'rgba(166, 206, 227, 1)',
                'rgba(31, 120, 180, 1)',
                'rgba(178, 223, 138, 1)',
                'rgba(51, 160, 44, 1)',
                'rgba(251, 154, 153, 1)',
                'rgba(227, 26, 28, 1)',
                'rgba(253, 191, 111, 1)',
                'rgba(255, 127, 0, 1)',
                'rgba(202, 178, 214, 1)',
                'rgba(106, 61, 154, 1)',
                'rgba(177, 89, 40, 1)'
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Weighted Probability Score'
                }
              }
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: `Countries in ${regionInput}`
                }
              }
            ]
          },
          legend: {
            display: false
          }
        }
      });
    } else if (regionInput === 'reset') {
      $('#RegionsBarChart').remove();
      $('#barChart1Vis').append('<canvas id="RegionsBarChart"><canvas>');

      const regionsBarChart = new Chart(chart, {
        type: 'bar',
        data: {
          labels: Object.keys(regionDataR),
          datasets: [
            {
              label: 'Mean Political Leaning',
              data: Object.keys(regionDataM).map(x => parseFloat(x).toFixed(2)),
              backgroundColor: [
                'rgba(166, 206, 227, 0.5)',
                'rgba(31, 120, 180, 0.5)',
                'rgba(178, 223, 138, 0.5)',
                'rgba(51, 160, 44, 0.5)',
                'rgba(251, 154, 153, 0.5)',
                'rgba(227, 26, 28, 0.5)',
                'rgba(253, 191, 111, 0.5)',
                'rgba(255, 127, 0, 0.5)',
                'rgba(202, 178, 214, 0.5)',
                'rgba(106, 61, 154, 0.5)',
                'rgba(177, 89, 40, 0.5)'
              ],
              borderColor: [
                'rgba(166, 206, 227, 1)',
                'rgba(31, 120, 180, 1)',
                'rgba(178, 223, 138, 1)',
                'rgba(51, 160, 44, 1)',
                'rgba(251, 154, 153, 1)',
                'rgba(227, 26, 28, 1)',
                'rgba(253, 191, 111, 1)',
                'rgba(255, 127, 0, 1)',
                'rgba(202, 178, 214, 1)',
                'rgba(106, 61, 154, 1)',
                'rgba(177, 89, 40, 1)'
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Weighted Probability Score'
                }
              }
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'Countries in Region'
                }
              }
            ]
          },
          legend: {
            display: false
          }
        }
      });
    }
  };
  req.send();
}

function drawScatter1() {
  // determine whether user has selected first or last election
  const selectedFirst = !document.getElementById('first-last-switch').checked;

  const req = new XMLHttpRequest();
  req.open('GET', 'https://api.jsonbin.io/b/5d01889058196b429f531883', true);
  req.setRequestHeader('secret-key', SECRETKEY);
  req.onload = () => {
    const jsonResponse = req.response;
    const countryData = JSON.parse(jsonResponse);
    const regions = [...new Set(countryData.map(d => d.Region))];
    const regionData = [];

    regions.forEach(region => {
      const specificRegion = {};

      const regionDataFirstMean = mean(
        countryData
          .filter(d => d.Region === region && d.ElectionYear <= 2005)
          .map(d => d.WeightedElectionScore)
      );

      const regionDataLastMean = mean(
        countryData
          .filter(d => d.Region === region && d.ElectionYear > 2005)
          .map(d => d.WeightedElectionScore)
      );
      specificRegion.Region = region;
      specificRegion.FirstScore = regionDataFirstMean;
      specificRegion.SecondScore = regionDataLastMean;
      regionData.push(specificRegion);
    });

    const regionDataR = groupBy(regionData, 'Region');

    // draw chart
    const chartNode = document.getElementById('MapAllRegions');
    const scatterPlot = new Chart(chartNode, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: `Political Leaning ${selectedFirst ? 'First Election' : 'Last Election'}`,
            data: selectedFirst ?
              Object.values(regionDataR).map(x => x[0].FirstScore.toFixed(2)) :
              Object.values(regionDataR).map(x => x[0].SecondScore.toFixed(2)),
            backgroundColor: selectedFirst ? 'rgba(255, 100, 100, 1)' : 'rgba(100, 100, 255, 1)',
            radius: 7,
            hoverRadius: 10
          }
        ],
        labels: Object.keys(regionDataR)
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'category',
              position: 'bottom',
              ticks: {
                min: 'Eastern Europe',
                max: 'Middle East'
              }
            }
          ]
        }
      }
    });
  };
  req.send();
}

function drawPieChart1() {
  // determine whether user has checked the box
  const useDefault = !document.getElementById('checkbox2').checked;

  const req = new XMLHttpRequest();
  let countryData = null;

  req.open('GET', 'https://api.jsonbin.io/b/5d01889058196b429f531883', true);
  req.setRequestHeader('secret-key', SECRETKEY);
  req.onload = () => {
    const jsonResponse = req.response;
    countryData = JSON.parse(jsonResponse);
    const regions = [...new Set(countryData.map(d => d.Region))];
    const regionData = [];

    regions.forEach(region => {
      const specificRegion = {};

      const regionDataFirstMean = mean(
        countryData
          .filter(d => d.Region === region && d.ElectionYear <= 2005)
          .map(d => d.WeightedElectionScore)
      );

      const regionDataLastMean = mean(
        countryData
          .filter(d => d.Region === region && d.ElectionYear > 2005)
          .map(d => d.WeightedElectionScore)
      );
      specificRegion.Region = region;
      specificRegion.FirstScore = regionDataFirstMean;
      specificRegion.SecondScore = regionDataLastMean;
      const absRegionScore = Math.abs(regionDataLastMean - regionDataFirstMean);
      if (absRegionScore < 3) {
        specificRegion.Moved = 1;
      } else if (regionDataLastMean > regionDataFirstMean) {
        specificRegion.Moved = 2;
      } else {
        specificRegion.Moved = 0;
      }
      regionData.push(specificRegion);
    });

    const countryLabels = ['Shifted Left', 'Stayed Roughly the Same', 'Shifted Right'];

    const groupedCountryData = groupBy(countryData, 'Country');
    const groupedCountryDataCountries = Object.keys(groupedCountryData);

    const countryShifts = groupedCountryDataCountries.reduce((total, countryName) => {
      countryData = groupedCountryData[countryName];
      const absScore = Math.abs(countryData[1].WeightedElectionScore - countryData[0].WeightedElectionScore);
      if (absScore < 3) {
        if (total[countryLabels[1]]) {
          total[countryLabels[1]] += 1;
        } else {
          total[countryLabels[1]] = 1;
        }
      } else if (countryData[1].WeightedElectionScore > countryData[0].WeightedElectionScore) {
        if (total[countryLabels[2]]) {
          total[countryLabels[2]] += 1;
        } else {
          total[countryLabels[2]] = 1;
        }
      } else if (total[countryLabels[0]]) {
        total[countryLabels[0]] += 1;
      } else {
        total[countryLabels[0]] = 1;
      }
      return total;
    }, {});

    const chart = document.getElementById('RegionsBarChart');
    const regionDataR = groupBy(regionData, 'Region');
    const regionDataV1 = groupBy(regionData, 'FirstScore');
    const regionDataV2 = groupBy(regionData, 'SecondScore');
    const regionDataMoved = groupBy(regionData, 'Moved');

    const regionShifts = {'Shifted Left': 0, 'Stayed Roughly the Same': 0, 'Shifted Right': 0};

    // draw chart
    const chartNode = document.getElementById('PieChartRegions');
    const regionsBarChart = new Chart(chartNode, {
      type: 'bar',
      data: {
        labels: useDefault ? Object.keys(countryShifts) : Object.keys(regionShifts),
        datasets: [
          {
            label: useDefault ? '# of Countries' : '# of Regions',
            data: useDefault ? Object.values(countryShifts) : Object.values(regionShifts),
            backgroundColor: ['#e6194b', '#3cb44b', '#ffe119'],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: useDefault ? 'Number of Countries' : 'Number of Regions'
              }
            }
          ],
          xAxes: [
            {
              scaleLabel: {
                display: false,
                labelString: ''
              }
            }
          ]
        }
      }
    });
  };

  req.send();
}

document.addEventListener('DOMContentLoaded', event => {
  getElectionsData();
  drawScatter1();
  drawPieChart1();
});
