'use strict';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

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

        console.log(chartData[20]);
	}
}