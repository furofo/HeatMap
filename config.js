function makeHeatMap(json) {
let box = document.querySelector('svg');
let w = box.clientWidth;
let h = box.clientHeight;
console.log("this is width " + w);
console.log("this is height" + h);
console.log(json);
};





$(document).ready(function() {  
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
      .then(response => response.json())
      .then(data => {
        let json = JSON.parse(JSON.stringify(data));
        makeHeatMap(json);
      });  
});