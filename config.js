function monthsConverter(month) {  // convert months from integer and return string data 
  switch(month) {
    case 1:
    return 'January';
    case 2:
    return 'February';
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
const legendColors = [
  "DarkBlue", 
  "Blue", 
  "DeepSkyBlue",
  "LightBlue",
  "LightCyan",
  "LemonChiffon",
  "Moccasin", 
  "SandyBrown", 
  "Chocolate",
  "Brown",
  "Maroon"
];
const legendColorTemps = [0,2.8,3.9,5.0,6.1,7.2,8.3,9.5,10.6,11.7,12.8];
let colorMax = d3.max(json.monthlyVariance, d => d.variance);
let colorMin = d3.min(json.monthlyVariance, d => d.variance);
let margin = {top: 30, left: 70, right: 70, bottom: 230}; //adopt margin convention give elements a little margin
let combinedArr = jsonCombinedArr(json);
var xScale = d3.scaleBand() // this is an ordinal scal band makes width of bars equal
.domain(combinedArr.years) // takes values 1 - 9 maps one to x coordinate 0, 9 to width which is 600
.range([margin.left, w - margin.right]);
var yScale = d3.scaleBand()
.domain(combinedArr.months)
.range([margin.top, h - margin.bottom]);
var colorScale = d3.scaleLinear()
                    .domain(legendColorTemps)
                    .range(legendColors)
                    .interpolate(d3.interpolateHcl);
const svg = d3.select("svg");
const g = svg.append('g');
var tooltip = d3.select(".container")
    .append("div")
    .style("position", "absolute")  // asssigns a tooltip and sets display to hidden
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#ddd")
    .text("a simple tooltip")
    .attr("id", "tooltip")
    .attr("data-year", "hello");
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
  .attr("class", "cell")
  .attr("data-month", (d, i) =>  d.month - 1)
  .attr("data-year", (d, i) => {
    return d.year})
  .attr('data-temp', (d, i) => parseFloat(d.variance))
  .attr("fill", function (d, i)  {
    return colorScale((parseFloat(d3.select(this).attr('data-temp')) + 8.66));
  })
  .on("mouseover", function(d, i){
    d3.select(this).attr( "fill", "black");
    let trueTemp = parseFloat(d3.select(this).attr('data-temp')) + 8.66;
    tooltip                                        
           .style("left", d3.event.pageX - 50 + "px")
           .style("top", d3.event.pageY - 125 + "px")
           .style("visibility", "visible")
           .style("display", "inline-block")
           .style("background", "black")
           .style("color", "white")
           .style("opacity", "0.8")
           .style("padding-left", "10px")
           .style("padding-right", "10px")
           .style("padding-bottom", "10px")
           .style("padding-top", "10px")
           .attr("data-year", d3.select(this).attr("data-year"))
           .html("Year: " + d3.select(this).attr("data-year") + '<br />' + "Temp: " + Math.round(100 * trueTemp) / 100 + "℃" +'<br />' + "Month: " + combinedArr.months[i]
           + "<br />" + "Variance: " + Math.round( 100 * (parseFloat(d3.select(this).attr('data-temp')))) / 100); 
             })
  .on("mouseout", function(d){  
      d3.select(this).attr("fill", (d,i) => {       
        return colorScale((parseFloat(d3.select(this).attr('data-temp')) + 8.66)); 
              })                                                  
              tooltip.style("display", "none");});;
const xAxis = d3.axisBottom(xScale)
                .tickValues(xScale.domain().filter(function(d,i){  
  // only show every 10 tick or every 10th year
                    if(d % 10 == 0) {
                      return d;
                    }                                    
                                        }))
                .tickSizeOuter(0);
const yAxis =d3.axisLeft(yScale)
               .tickSizeOuter(0);; 
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
    .attr("width", 400)  
    .attr('transform', 'translate(' + margin.left +',' + (h - 160) + ')')
    .attr("id", "legend");

let legendXscale = d3.scaleBand() 
                  .domain(legendColorTemps) 
                  .range([0, 400]);

console.log("hello world" + legendXscale('2'));
legend.selectAll('rect')
      .data(legendColorTemps)
      .enter()
      .append('rect')
      .attr("x", (d, i) => {
        console.log("this is d" + d);
        console.log("this is xscale d" + legendXscale(d));
        return legendXscale(d);
      })
      .attr("y", (d, i) => {
          return 0;
      })
      .attr("width", legendXscale.bandwidth())
      .attr("fill", (d, i) => colorScale(d))
      .attr('height', 40);
const legendXaxis = d3.axisBottom(legendXscale);
legend.append("g")
    .attr("transform", "translate(0," + 40 + ")") // make x-axis
    .call(legendXaxis);
};
$(document).ready(function() {  
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
      .then(response => response.json())
      .then(data => {
        let json = JSON.parse(JSON.stringify(data));
        makeHeatMap(json);
      });  
});