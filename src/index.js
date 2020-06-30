import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";



import './css/index.css'
import GPXAnalyzer from './js/GPXAnalyzer'

// const p = document.createElement('p')
// p.textContent = 'Hello from webpack2!'
// document.body.appendChild(p)

// const p2 = document.createElement('p')
// const numbers1 = [1, 2, 3, 4, 5, 6]
// const numbers2 = [7, 8, 9, 10]
// const numbers3 = [...numbers1, ...numbers2]
// p2.textContent = numbers3.join(' ')
// document.body.appendChild(p2)

var fileInput = document.getElementById('xmlFile');

fileInput.addEventListener('change', function (e) {
    // var file = fileInput.files[0];
    // var textType = /text.*/;

    // console.log(file.name);

    // if(file.name.toLowerCase().includes('.gpx') || file.name.toLowerCase().includes('.tcx')) {
    // // if (file.type.match(textType)) {
    //     let reader = new FileReader();

    //     reader.onload = readFile(reader.result, file.name.toLowerCase());
    //     reader.readAsText(file);
    // }
    for (let file of fileInput.files) {
        (new Blob([file])).text().then(xml => {
            let chartData = new GPXAnalyzer({
                xml: xml,
                fileName: file.name.toLowerCase()
            });

            addSeries(chartData, file.name.toLowerCase());
        });
    }
    
    // } else {
        // xmlFileInfo.innerText = "File not supported!"
    // }
});



let chart = am4core.create("chartdiv", am4charts.XYChart);

chart.data = [];

// Create axes
let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.minGridDistance = 60;

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

chart.cursor = new am4charts.XYCursor();
// chart.cursor.snapToSeries = series;
chart.cursor.xAxis = dateAxis;

//chart.scrollbarY = new am4core.Scrollbar();
chart.scrollbarX = new am4core.Scrollbar();

chart.legend = new am4charts.Legend();


function addSeries(chartData, fileName) {  
    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.name = fileName;
    series.data = chartData;
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.tooltipText = "{value}"

    series.tooltip.pointerOrientation = "vertical";

    chart.invalidateData()
}



