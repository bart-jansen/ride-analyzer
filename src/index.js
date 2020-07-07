import './css/index.css'
import FileAnalyzer from './js/FileAnalyzer'
import Chart from './js/Chart'

// const Dropzone = require('dropzone');

let ChartObj = new Chart('chartdiv')


// import * as FilePond from 'filepond';
// import 'filepond/dist/filepond.min.css';

// // Create a multi file upload component
// const pond = FilePond.create({
// 	multiple: true,
// 	name: 'filepond'
// });

// // Add it to the DOM
// document.body.appendChild(pond.element);


let fileInput = document.querySelector('input[type="file"]');

fileInput.addEventListener('change', () => {

	// let reader = new FileReader(),
	// 	file = fileInput.files[0],
	// 	fileExtension = file.name.match(/\.[0-9a-z]+$/i);

	// reader.onload = readFile(reader.result, file.name.toLowerCase());

	// fileExtension === 'fit' ? reader.readAsArrayBuffer(file) : reader.readAsText(file);


	for (let file of fileInput.files) {
		let fileName = file.name.toLowerCase(),
			fileExtension = fileName.split('.').pop();

		
		if(fileExtension === 'fit') {
			console.log('ja nud us');
			(new Blob([file])).arrayBuffer().then(readFile.bind(fileName));
		}
		else {
			(new Blob([file])).text().then(readFile.bind(fileName));
		}

			// eader.readAsArrayBuffer(file) : reader.readAsText(file);



	    // (new Blob([file])).arrayBuffer().then(xml => {
		// 	console.log(xml);

	    //     let chartData = new FileAnalyzer({
	    //         xml: xml,
	    //         fileName: file.name.toLowerCase()
	    //     });

	    //     ChartObj.addSeries(chartData, file.name.toLowerCase());
		// });
	}

	//         var buffer = await xml.arrayBuffer();




	//         let chartData = new FileAnalyzer({
	//             xml: buffer,
	//             fileName: file.name.toLowerCase()
	//         });

	//         ChartObj.addSeries(chartData, file.name.toLowerCase());
	//     });
	// }
});

function readFile (contents) {
	let fileName = this;

	let chartData = new FileAnalyzer({
		fileContents: contents,
		fileName: fileName
	});

	ChartObj.addSeries(chartData, fileName);

}




// let myDropzone = new Dropzone("div#myId", { url: "/file/post"});

// myDropzone.options.PDFDrop = {
//     maxFilesize: 10, // Mb
//     accept: function(file, done) {
//         var reader = new FileReader();
//         reader.addEventListener("loadend", function(event) { console.log(event.target.result);});
//         reader.readAsText(file);
//     }
// };

