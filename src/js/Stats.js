'use strict';

var { jStat } = require('jstat')

export default class Stats {
    constructor(options) {
        let rawData = options.data
        let cleanData = this.cleanseData(rawData)

        var jObj = jStat(cleanData);
        let statList = ['mean', 'max', 'min', 'stdev']
        let boxes = this.createBoxes(jObj, statList)

        this.appendHTML(boxes, options.fileName, options.divName)
    }

    cleanseData(rawData) {
        return rawData.map(item => Number.parseFloat(item.value))
    }

    createBoxes(data, stats) {
        let result = ``;
        stats.forEach(stat => {
            result = `${result} 
            <div class="stats-box">
                <p class="stats-title">${stat}</p>
                <p class="stats-value stats-${stat}">${Math.round(data[stat]() * 100) / 100}</p>
            </div>`
        });
        return result
    }

    appendHTML(boxes, title, divId) {
        let HTML = `
        <div>
            <p class="stats-title">${title}</p>
            <div class="stats-container">
                ${boxes}
            </div>
            </div>`

        var div = document.getElementById(divId);

        div.innerHTML += HTML;
    }


}
