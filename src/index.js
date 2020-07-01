import './css/index.css'
import FileAnalyzer from './js/FileAnalyzer'
import Chart from './js/Chart'

let ChartObj = new Chart('chartdiv')
let fileInput = document.getElementById('xmlFile');

fileInput.addEventListener('change', function (e) {
    for (let file of fileInput.files) {
        (new Blob([file])).text().then(xml => {
            let chartData = new FileAnalyzer({
                xml: xml,
                fileName: file.name.toLowerCase()
            });

            ChartObj.addSeries(chartData, file.name.toLowerCase());
        });
    }
});

