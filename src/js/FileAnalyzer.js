'use strict';

const parser = require('xml-js');

export default class FileAnalyzer {
	constructor(options) {
		const data = JSON.parse(parser.xml2json(options.xml, { compact: true }));

		let dataPoints = [],
			cleanData = [],
			wattPropertyPrefix = ``; // If garmin connect is being used the property name is ns3:TPX insted of just TPX

		if(options.fileName.includes('.gpx')) {
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
		else if(options.fileName.includes('.tcx')) {
			this.findNested(data, 'Trackpoint', dataPoints);

			dataPoints = dataPoints[0];

			if(dataPoints[0].Extensions[`ns3:TPX`]){
				//Garming connect is being used so add the property prefix
				wattPropertyPrefix = `ns3:`
			}

			for (let i = 0; i < dataPoints.length; i++) {
				cleanData.push({date: new Date(dataPoints[i].Time._text), 
					value: dataPoints[i].Extensions[`${wattPropertyPrefix}TPX`][`${wattPropertyPrefix}Watts`] ? dataPoints[i].Extensions[`${wattPropertyPrefix}TPX`][`${wattPropertyPrefix}Watts`]._text : 0
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