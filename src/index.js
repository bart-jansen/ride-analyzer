import './css/index.css'
import FileAnalyzer from './js/FileAnalyzer'
import Chart from './js/Chart'
import Stats from './js/Stats'

// const Dropzone = require('dropzone');

let ChartObj = new Chart('chartdiv')

let fileInput = document.querySelector('input[type="file"]');

fileInput.addEventListener('change', () => {

	for (let file of fileInput.files) {
		let fileName = file.name.toLowerCase(),
			fileExtension = fileName.split('.').pop();

		
		if(fileExtension === 'fit') {
			(new Blob([file])).arrayBuffer().then(readFile.bind(fileName));
		}
		else {
			(new Blob([file])).text().then(readFile.bind(fileName));
		}
	}
});

function readFile (contents) {
	let fileName = this;

	let chartData = new FileAnalyzer({
		fileContents: contents,
		fileName: fileName
	});

	let StatsObj = new Stats({
		data: chartData,
		fileName: fileName,
		divName:'statsdiv'
	})

	ChartObj.addSeries(chartData, fileName);
}