const periodUnits = {"days": 1, "weeks": 7, "months": 30};
const progressionRatio = 3;

export const covid19ImpactEstimator = (data) => {
	const input = data;
	return {
		"data": input,
		"impact": computeImpact(data),
		"severeImpact": computeSevereImpact(data)
	}
};

function computeImpact(data){
	let currentlyInfected = data.reportedCases * 10;
	
	let infectionsByRequestedTime = predictInfections(currentlyInfected, data.timeToElapse, periodUnits[data.periodType]);
	
	let dollarsInFlight = economyLossByRequestedTime(infectionsByRequestedTime, data.timeToElapse, periodUnits[data.periodType], data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD);
	
	return {
		'currentlyInfected' : currentlyInfected,
		'infectionsByRequestedTime' : infectionsByRequestedTime,
		'dollarsInFlight' : dollarsInFlight
	};
}

function computeSevereImpact(data){
	let currentlyInfected = data.reportedCases * 50;
	
	let infectionsByRequestedTime = predictInfections(currentlyInfected, data.timeToElapse, periodUnits[data.periodType])
	
	let severeCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTime);
	
	let availableHospitalBeds = Math.trunc(0.35 * data.totalHospitalBeds);
	let hospitalBedsByRequestedTime = availableHospitalBeds - severeCasesByRequestedTime;
	 
	let casesForICUByRequestedTime =  Math.trunc(0.05 * infectionsByRequestedTime);
	
	let casesForVentilatorsByRequestedTime = Math.trunc(0.02 * infectionsByRequestedTime);
	
	let dollarsInFlight = economyLossByRequestedTime(infectionsByRequestedTime, data.timeToElapse, periodUnits[data.periodType], data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD);
	
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
	let factor = Math.trunc(timeValue * timeUnit / progressionRatio);
	return currentlyInfected * 2 ** factor;
}

function economyLossByRequestedTime(infectionsByRequestedTime, timeValue, timeUnit, adip, adiiu){
	return Math.trunc(infectionsByRequestedTime * adip * adiiu * timeValue * timeUnit * 100) / 100;
}

export default covid19ImpactEstimator;