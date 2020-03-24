function makeHeatMap(json) {
console.log("this worked");
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