const periodUnits = { days: 1, weeks: 7, months: 30 };
const progressionRatio = 3;

function computeImpact(data){
  const currentlyInfected = data.reportedCases * 10;

  const infectionsByRequestedTime = predictInfections(currentlyInfected, data.timeToElapse,
	    periodUnits[data.periodType]);

  const dollarsInFlight = economyLossByRequestedTime(infectionsByRequestedTime, data.timeToElapse, periodUnits[data.periodType], data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD);

  return {
    'currentlyInfected' : currentlyInfected,
    'infectionsByRequestedTime' : infectionsByRequestedTime,
    'dollarsInFlight' : dollarsInFlight
  };
}

function computeSevereImpact(data){
  const currentlyInfected = data.reportedCases * 50;

  const infectionsByRequestedTime = predictInfections(currentlyInfected, data.timeToElapse, periodUnits[data.periodType])

  const severeCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTime);

  const availableHospitalBeds = Math.trunc(0.35 * data.totalHospitalBeds);
  const hospitalBedsByRequestedTime = availableHospitalBeds - severeCasesByRequestedTime;

  const casesForICUByRequestedTime =  Math.trunc(0.05 * infectionsByRequestedTime);

  const casesForVentilatorsByRequestedTime = Math.trunc(0.02 * infectionsByRequestedTime);

  const dollarsInFlight = economyLossByRequestedTime(infectionsByRequestedTime, data.timeToElapse, periodUnits[data.periodType], data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD);

  return {
    'currentlyInfected' : currentlyInfected,
    'infectionsByRequestedTime' : infectionsByRequestedTime,
    'severeCasesByRequestedTime' : severeCasesByRequestedTime,
    'hospitalBedsByRequestedTime' : hospitalBedsByRequestedTime,
    'casesForICUByRequestedTime': casesForICUByRequestedTime,
    'casesForVentilatorsByRequestedTime' : casesForVentilatorsByRequestedTime,
    'dollarsInFlight' : dollarsInFlight
  };
}

function predictInfections(currentlyInfected, timeValue, timeUnit){
  const factor = Math.trunc(timeValue * timeUnit / progressionRatio);
  return currentlyInfected * 2 ** factor;
}

function economyLossByRequestedTime(infectionsByRequestedTime, timeValue, timeUnit, adip, adiiu){
  return Math.trunc(infectionsByRequestedTime * adip * adiiu * timeValue * timeUnit * 100) / 100;
}

export const covid19ImpactEstimator = (data) => {
  const input = data;
  return {
    "data": input,
    "impact": computeImpact(data),
    "severeImpact": computeSevereImpact(data)
  }
};

export default covid19ImpactEstimator;