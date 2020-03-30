function makeHeatMap(json) {
let box = document.querySelector('svg');
let w = box.clientWidth;
let h = box.clientHeight;
let colors = ["#313695", "#4575B4", "#74ADD1", "#ABD9E9", "#E0F3F8", "#FFFFBF", "#FEE090", "#FDAE61", "#F46D43", "#D73027", "#A50026"];
let years = [];
let months1 = [];
let margin = {top: 100, left: 70, right: 70, bottom: 30};
for (let i = 0; i < json.monthlyVariance.length; i++) {
years.push(json.monthlyVariance[i].year);          // collect years and months for scale band domain
 months1.push(json.monthlyVariance[i].month);
}
let months = [1,2,3,4,5,6,7,8,9,10,11,12];
let monthsConverted = months1.map((x => monthsConverter(x)));


let finMonths = months.map(x => monthsConverter(x));
var xScale = d3.scaleBand() // this is an ordinal scal band makes width of bars equal
.domain(years) // takes values 1 - 9 maps one to x coordinate 0, 9 to width which is 600
.range([margin.left, w - margin.right]);
var yScale = d3.scaleBand()
.domain(monthsConverted)
.range([margin.top, h - margin.bottom]);
console.log(yScale('January') + "this is yscale");
var colorScale = d3.scaleLinear()
                    .domain([1, 12])
                    
                    .range(["#0066AE", "#8B0000"])

const svg = d3.select("svg");
const g = svg.append('g');

//var colorScale = d3.scaleOrdinal()
                   // .domain(months)
                  //  .range(colors);
g.selectAll('rect')
  .data(json.monthlyVariance)
  .enter()
  .append("rect")
  .attr("x", (d,i) => {
    return xScale(years[i]);
  })
  .attr("y", (d, i) => {
    return yScale(monthsConverted[i]);
  })
  .attr("width", xScale.bandwidth())
  .attr("height", yScale.bandwidth())

  .attr("fill", (d, i) => colorScale(months1[i]));

const xAxis = d3.axisBottom(xScale)
                .tickValues(xScale.domain().filter(function(d,i){  
  // only show every 12 tick or every 3rdyear since there are 4 x values for every year and was crowding x-axis
                    console.log("these are tick values" + d);
                    if(d % 10 == 0) {
                      console.log("this is succes??? " + d);
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

//let legend = svg.append("g").attr("id", "legend")
    //.attr("height", 100)
   // .attr("width", width / 7)  // thi holds key to interpet colors for scatterplot
   // .attr('transform', 'translate(' + (width - 100) + ',200)')
    //.attr("id", "legend");

};

function monthsConverter(month) {
  
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
  }

  }


$(document).ready(function() {  
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
      .then(response => response.json())
      .then(data => {
        let json = JSON.parse(JSON.stringify(data));
        makeHeatMap(json);
      });  
});

//adds (variance) to temperatue tool tip shows value rounded down to tenths of each
