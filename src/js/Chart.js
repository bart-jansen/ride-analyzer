'use strict';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
var { jStat } = require('jstat')


export default class Chart {
	constructor(chartDiv) {
        this.createChart(chartDiv)
    }
    
    createChart (chartDiv) {
        this.chart = am4core.create(chartDiv, am4charts.XYChart);

        this.chart.data = [];

        // Create axes
        let dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 60;

        dateAxis.events.on("startendchanged", ev => {
            console.log('event changed');
            let start = new Date(ev.target.minZoomed),
                end = new Date(ev.target.maxZoomed);

            this.chart.series.values.forEach((series, seriesIndex) => {
                let newDataRange = [];

                series.data.forEach(dataPt => {
                    if(dataPt.date >= start && dataPt.date <= end) {
                        newDataRange.push(dataPt.value);
                    }
                });

                let statList = ['mean', 'max', 'min', 'stdev']
                var jObj = jStat(newDataRange);

                // todo: refactor
                statList.forEach(stat => {
                    document.querySelector(`#statsdiv > div:nth-child(${seriesIndex+1}) .stats-${stat}`).innerHTML = 
                        Math.round(jObj[stat]() * 100) / 100
                })
            });
        });

        let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());

        this.chart.cursor = new am4charts.XYCursor();
        // this.chart.cursor.snapToSeries = series;
        this.chart.cursor.xAxis = dateAxis;

        //this.chart.scrollbarY = new am4core.Scrollbar();
        this.chart.scrollbarX = new am4core.Scrollbar();

        this.chart.legend = new am4charts.Legend();
    }

	addSeries (chartData, fileName) {
	    // Create series
        let series = this.chart.series.push(new am4charts.LineSeries());
        series.name = fileName;
        series.data = chartData;
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.tooltipText = "{value}"
    
        series.tooltip.pointerOrientation = "vertical";
    
        // reload data
        this.chart.invalidateData();
	}
}