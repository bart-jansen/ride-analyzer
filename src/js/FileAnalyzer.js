'use strict';

const parser = require('xml-js');
const EasyFit = require('easy-fit').default;
var FitParser = require('fit-file-parser').default;

export default class FileAnalyzer {
	constructor(options) {
		let data,
			dataPoints = [],
			cleanData = [];

		if (options.fileName.includes('.fit')) {
			var easyFit = new FitParser({
				force: true,
				speedUnit: 'km/h',
				lengthUnit: 'km',
				temperatureUnit: 'celsius',
				elapsedRecordField: true,
				mode: 'cascade',
			});

			// Parse your file
			easyFit.parse(options.fileContents, function (error, data) {

				// Handle result of parse method
				if (error) {
					console.log(error);
				} else {
					this.findNested(data, 'records', dataPoints);

					dataPoints = dataPoints[0];

					console.log(dataPoints.length);

					for (let i = 0; i < dataPoints.length; i++) {
						let date = new Date(dataPoints[i].timestamp);
				 		date.setSeconds(date.getSeconds() - 378);

						cleanData.push({
							date: date,
							value: dataPoints[i].power ? dataPoints[i].power : 0
						})
					}

				}

			}.bind(this));

		}

		else if (options.fileName.includes('.gpx')) {
			data = JSON.parse(parser.xml2json(options.fileContents, { compact: true }));

			this.findNested(data, 'trkpt', dataPoints);

			dataPoints = dataPoints[0];

			for (let i = 0; i < dataPoints.length; i++) {
				let date = new Date(dataPoints[i].time._text);
				//  date.setSeconds(date.getSeconds() - 21);

				cleanData.push({
					date: date,
					value: dataPoints[i].extensions.power ? dataPoints[i].extensions.power._text : 0
				})
			}
		}
		else if (options.fileName.includes('.tcx')) {
			data = JSON.parse(parser.xml2json(options.fileContents, { compact: true }));

			this.findNested(data, 'Trackpoint', dataPoints);

			dataPoints = dataPoints[0];

			let TPXKey = 'TPX',
				WattsKey = 'Watts';

			// adds support for Garmin Connect TCX files
			if (dataPoints[0].Extensions['ns3:TPX']) {
				TPXKey = 'ns3:TPX';
				WattsKey = 'ns3:Watts';
			}

			for (let i = 0; i < dataPoints.length; i++) {
				cleanData.push({
					date: new Date(dataPoints[i].Time._text),
					value: dataPoints[i].Extensions[TPXKey][WattsKey] ? dataPoints[i].Extensions[TPXKey][WattsKey]._text : 0
				})
			}
		}

		return cleanData;
	}

	findNested(obj, key, res) {
		let i,
			proto = Object.prototype,
			ts = proto.toString,
			hasOwn = proto.hasOwnProperty.bind(obj);

		if ('[object Array]' !== ts.call(res)) res = [];

		for (i in obj) {
			if (hasOwn(i)) {
				if (i === key) {
					res.push(obj[i]);
				} else if ('[object Array]' === ts.call(obj[i]) || '[object Object]' === ts.call(obj[i])) {
					this.findNested(obj[i], key, res);
				}
			}
		}

		return res[0];
	}
}