function fillColorSetter(rectTemp) {
    if(rectTemp > 12.8) {
      return "#313695";
    }
    else if (rectTemp > 11.7) {
      return "#D73027";
    }
    else if (rectTemp > 10.6) {
      return "#F46D43";
    }
    else if (rectTemp > 9.5) {
      return "#FDAE61";
    }
    else if (rectTemp > 8.3) {
      return "#FEE090";
    }
    else if (rectTemp > 7.2) {
      return "#FFFFBF";
    }
    else if (rectTemp > 6.1) {
      return "#E0F3F8";
    }
    else if (rectTemp > 5.0) {
      return "#ABD9E9";
    }
    else if (rectTemp > 3.9) {
      return "#74ADD1";
    }
    else if (rectTemp > 2.8) {
      return "#4575B4";
    }
    else {
      return "#313695";
    }
}

// look into d3. interpolate

function makeHeatMap(json) {
let box = document.querySelector('svg');
let w = box.clientWidth;
let h = box.clientHeight;
let colors = ["#313695", "#4575B4", "#74ADD1", "#ABD9E9", "#E0F3F8", "#FFFFBF", "#FEE090", "#FDAE61", "#F46D43", "#D73027", "#A50026"];
let years = [];
let months1 = [];
for (let i = 0; i < json.monthlyVariance.length; i++) {
years.push(json.monthlyVariance[i].year);          // collect years and months for scale band domain
 months1.push(json.monthlyVariance[i].month);
}
let months = [1,2,3,4,5,6,7,8,9,10,11,12];
let finMonths = months.map(x => monthsConveter(x));
var xScale = d3.scaleBand() // this is an ordinal scal band makes width of bars equal
.domain(years) // takes values 1 - 9 maps one to x coordinate 0, 9 to width which is 600
.range([0, w]);
var yScale = d3.scaleBand()
.domain(months1)
.range([0, h]);
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
    console.log("this is y scale d" + d + " this is x scale i " + i);
    console.log("this is xyscale of years[i] " + yScale(years[i]))
    return yScale(months1[i]);
  })
  .attr("width", xScale.bandwidth())
  .attr("height", yScale.bandwidth())

  .attr("fill", (d, i) => colorScale(months1[i]));

const xAxis = d3.axisBottom(xScale)
                .tickValues(xScale.domain().filter(function(d,i){  
  // only show every 12 tick or every 3rdyear since there are 4 x values for every year and was crowding x-axis
                         return !(i%12)                                   
                                        }));
const yAxis =d3.axisLeft(yScale); 

svg.append("g")
    .attr("transform", "translate(0," + (h - 25) + ")") // make x-axis
    .attr("id", "x-axis")
    .call(xAxis);   
svg.append("g")
    .attr("transform", "translate(40," + 0 + ")") // make y -axis
    .attr("id", "y-axis")
    .call(yAxis);

//let legend = svg.append("g").attr("id", "legend")
    //.attr("height", 100)
   // .attr("width", width / 7)  // thi holds key to interpet colors for scatterplot
   // .attr('transform', 'translate(' + (width - 100) + ',200)')
    //.attr("id", "legend");

};

function monthsConveter(month) {
  
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
