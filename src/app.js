import React, { Component } from 'react';

import covid19ImpactEstimator, {covid19ImpactEstimator as estimator} from './estimator';

import './app.css';

const periodUnits = {"days": 1, "weeks": 7, "months": 30};

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			'population': '',
			'timeToElapse': '',
			'reportedCases': '',
			'totalHospitalBeds': '',
			'periodType': '',
			'estimations': ''
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handlePopulationChange = this.handlePopulationChange.bind(this);
		this.handleReportedCasesChange = this.handleReportedCasesChange.bind(this);
		this.handleTotalHospitalBedsChange = this.handleTotalHospitalBedsChange.bind(this);
		this.handleTimeToElapseChange = this.handleTimeToElapseChange.bind(this);
		this.handlePeriodTypeChange = this.handlePeriodTypeChange.bind(this);
	}
	
	handlePopulationChange(event) {
		this.setState({population: event.target.value});
	}
	
	handleReportedCasesChange(event) {
		this.setState({reportedCases: event.target.value});
	}
	
	handleTotalHospitalBedsChange(event) {
		this.setState({totalHospitalBeds: event.target.value});
	}
	
	handleTimeToElapseChange(event) {
		this.setState({timeToElapse: event.target.value});
	}
	
	handlePeriodTypeChange(event) {
		this.setState({periodType: event.target.value});
	}
	
	handleSubmit(event) {
		event.preventDefault();
		const data = {
			region: {
				name: "Africa",
				avgAge: 19.7,
				avgDailyIncomeInUSD: 5,
				avgDailyIncomePopulation: 0.71
			},
			periodType: this.state.periodType,
			timeToElapse: this.state.timeToElapse,
			reportedCases: this.state.reportedCases,
			population: this.state.population,
			totalHospitalBeds: this.state.totalHospitalBeds
		};
		const previsions = estimator(data);
		this.setState({estimations: (
			<div>
				<p><strong>Region's informations:</strong></p>
				<ul>
					<li>name <strong>"Africa"</strong></li>
					<li>average age <strong>"19.7"</strong></li>
					<li>average daily income in USD <strong>"5"</strong></li>
					<li>average daily income population <strong>"0.71"</strong></li>
					<li>population <strong>{this.state.population}</strong></li>
					<li>reported cases <strong>{this.state.reportedCases}</strong></li>
					<li>total hospital beds <strong>{this.state.totalHospitalBeds}</strong></li>
					<li>time to elapse <strong>{this.state.timeToElapse}</strong></li>
					<li>time to elapse <strong>{this.state.timeToElapse}</strong></li>
					<li>period type <strong>{this.state.periodType}</strong></li>
				</ul>
				<div>
					<p><strong>Predictions:</strong></p>
					<table>
						<tr>
							<th rowspan={3}>Impact</th>
							<td>currentlyInfected</td>
							<td>{previsions.impact.currentlyInfected}</td>
						</tr>
						<tr>
							<td>infectionsByRequestedTime</td>
							<td>{previsions.impact.infectionsByRequestedTime}</td>
						</tr>
						<tr>
							<td>dollarsInFlight</td>
							<td>{previsions.impact.dollarsInFlight}</td>
						</tr>
						<tr>
							<th rowspan={7}>Severe impact</th>
							<td>currentlyInfected</td>
							<td>{previsions.severeImpact.currentlyInfected}</td>
						</tr>
						<tr>
							<td>infectionsByRequestedTime</td>
							<td>{previsions.severeImpact.infectionsByRequestedTime}</td>
						</tr>
						<tr>
							<td>severeCasesByRequestedTime</td>
							<td>{previsions.severeImpact.severeCasesByRequestedTime}</td>
						</tr>
						<tr>
							<td>hospitalBedsByRequestedTime</td>
							<td>{previsions.severeImpact.hospitalBedsByRequestedTime}</td>
						</tr>
						<tr>
							<td>casesForICUByRequestedTime</td>
							<td>{previsions.severeImpact.casesForICUByRequestedTime}</td>
						</tr>
						<tr>
							<td>casesForVentilatorsByRequestedTime</td>
							<td>{previsions.severeImpact.casesForVentilatorsByRequestedTime}</td>
						</tr>
						<tr>
							<td>dollarsInFlight</td>
							<td>{previsions.severeImpact.dollarsInFlight}</td>
						</tr>
					</table>
				</div>
			</div>
		)});
	}
	
	render() {
		return (
			<div className="container">
				<div className="div-form">
					<form onSubmit={this.handleSubmit}>
						<fieldset>
							<legend>Informations regarding the COVID-19 in your zone</legend>
							<div>
								<label for="in_pop">population:</label>
								<input type="number" min="1" required data-population={this.state.population} value={this.state.population} onChange={this.handlePopulationChange} id="in_pop" placeholder="Enter the population number" />
							</div>
							<div>
								<label for="in_reported_cases">Reported cases:</label>
								<input type="number" min="1" required reported-cases={this.state.reportedCases} value={this.state.reportedCases} onChange={this.handleReportedCasesChange} id="in_reported_cases" placeholder="Enter the current number of reported cases" />
							</div>
							<div>
								<label for="in_totalHospitalBeds">Total hospital beds:</label>
								<input type="number" min="1" required total-hospital-beds={this.state.totalHospitalBeds} value={this.state.totalHospitalBeds} onChange={this.handleTotalHospitalBedsChange} id="in_totalHospitalBeds" placeholder="Enter the total number of hospital beds" />
							</div>
							<div>
								<label for="in_timeToElapse">Time to elapse:</label>
								<input type="number" min="1" required time-to-elapse={this.state.timeToElapse} value={this.state.timeToElapse} onChange={this.handleTimeToElapseChange} id="in_timeToElapse" placeholder="Enter the time to elapse" />
							</div>
							<div>
								<label for="in_periodType">Period type:</label>
								<select period-type={this.state.periodType} value={this.state.periodType} onChange={this.handlePeriodTypeChange} id="in_periodType">
									{Object.entries(periodUnits).map(([periodKey,periodValue]) => (
										<option key={periodKey} value={periodKey}>{periodKey}</option>
										)
									)}
								</select>
							</div>
							<div>
								<button type='submit'>Submit</button>
							</div>
						</fieldset>
					</form>
				</div>
				<div className="div-impact">
					<header>Estimation of the  impact</header>
					{this.state.estimations}
				</div>
			</div>
		);
	}
}

export default App;
