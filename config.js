function monthsConverter(month) {  // convert months from integer and return string data 
  switch(month) {
    case 1:
    return 'January';
    case 2:
    return 'Febuary';
    case 3:
    return 'March';
    case 4:
    return 'April';
    case 5:
    return 'May';
    case 6:
    return 'June';
    case 7:
    return 'July';
    case 8:
    return 'August';
    case 9:
    return 'September';
    case 10:
    return 'October';
    case 11:
    return 'November';
    case 12:
    return 'December';
    default:
    return 'Please input valid number from 1 - 12';
  }
  }
function jsonCombinedArr(json) { // returns an obj with years key associated with arr of years and months with string verison of months so 1 is january etc
  let years = [];
  let months = [];
  let obj = {};
  for(let i = 0; i < json.monthlyVariance.length; i++) {
    let tempArr = [];
    years.push(json.monthlyVariance[i].year);
    months.push(monthsConverter(json.monthlyVariance[i].month));
  }
  obj.years = years;
  obj.months = months;
  return obj;
}
function makeHeatMap(json) {  //this provides logic for making graph
let box = document.querySelector('svg');
let w = box.clientWidth;
let h = box.clientHeight;
let margin = {top: 100, left: 70, right: 70, bottom: 30}; //adopt margin convention give elements a little margin
let combinedArr = jsonCombinedArr(json);
var xScale = d3.scaleBand() // this is an ordinal scal band makes width of bars equal
.domain(combinedArr.years) // takes values 1 - 9 maps one to x coordinate 0, 9 to width which is 600
.range([margin.left, w - margin.right]);
var yScale = d3.scaleBand()
.domain(combinedArr.months)
.range([margin.top, h - margin.bottom]);
var colorScale = d3.scaleOrdinal()
                    .domain(combinedArr.months)
                    .range(["#0066AE", "#8B0000"])
const svg = d3.select("svg");
const g = svg.append('g');
g.selectAll('rect')
  .data(json.monthlyVariance)
  .enter()
  .append("rect")
  .attr("x", (d,i) => {
    return xScale(combinedArr.years[i]);
  })
  .attr("y", (d, i) => {
    return yScale(combinedArr.months[i]);
  })
  .attr("width", xScale.bandwidth())
  .attr("height", yScale.bandwidth())
  .attr("fill", (d, i) => colorScale(combinedArr.months[i]))
  .attr("class", "cell")
  .attr("data-month", (d, i) =>  d.month - 1)
  .attr("data-year", (d, i) => {
    console.log("this is d.year" + d.year);
    return d.year})
  .attr("data-temp", (d, i) => d.variance);
const xAxis = d3.axisBottom(xScale)
                .tickValues(xScale.domain().filter(function(d,i){  
  // only show every 12 tick or every 3rdyear since there are 4 x values for every year and was crowding x-axis
                    if(d % 10 == 0) {
                      return d;
                    }
                                                           
                                        }));
const yAxis =d3.axisLeft(yScale); 
svg.append("g")
    .attr("transform", "translate(0," + (h - margin.bottom) + ")") // make x-axis
    .attr("id", "x-axis")
    .call(xAxis);   
svg.append("g")
    .attr("transform", "translate(" + (margin.left) + ", 0)") // make y -axis
    .attr("id", "y-axis")
    .call(yAxis);
let legend = svg.append("g").attr("id", "legend")
    .attr("height", 100)
    .attr("width", width / 7)  // thi holds key to interpet colors for scatterplot
    .attr('transform', 'translate(' + (width - 100) + ',200)')
    .attr("id", "legend");
};
$(document).ready(function() {  
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
      .then(response => response.json())
      .then(data => {
        let json = JSON.parse(JSON.stringify(data));
        makeHeatMap(json);
      });  
});