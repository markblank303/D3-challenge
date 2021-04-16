// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = 'poverty';
var chosenYAxis = 'healthcare';

function xScale(stateData, chosenXAxis) {
  var xLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenXAxis])*0.8,d3.max(stateData, d => d[chosenXAxis])*1.2])
      .range([0, width]);

  return xLinearScale;
};

function yScale(stateData, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenYAxis])*0.8, d3.max(stateData, d => d[chosenYAxis])*1.2])
      .range([height, 0]);
  
  return yLinearScale;
};

function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
};

function renderYAxis(yLinearScale, yAxis) {
  var leftAxis = d3.axisLeft(yLinearScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

function renderXCirles(circleGroup, newXScale, chosenXAxis){
  circleGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circleGroup;
};

function renderXText(textGroup, newXScale,chosenXAxis, stateData) {

  textGroup.transition()
  .duration(1000)
  .attr("dx", d => newXScale(d[chosenXAxis]));

  return textGroup;
};

function renderYCirles(circleGroup, newYScale, chosenYAxis,stateData){

  circleGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circleGroup;
};

function renderYText(textGroup, newYScale,chosenYAxis) {
  textGroup.transition()
  .duration(1000)
  .attr("dy", d => newYScale(d[chosenYAxis]));

  return textGroup;
};

d3.csv("assets/data/data.csv").then(function(stateData) {
    
    stateData.forEach(data => {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.income = +data.income;
        data.obesity = +data.obesity;
    });

    var xLinearScale = xScale(stateData, chosenXAxis);

    var yLinearScale = yScale(stateData, chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
      .classed('x-axis',true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append("g")
      .classed('y-axis',true)
      .call(leftAxis);

    var circleGroup =chartGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", "15")
      .attr("fill", "lightblue")
      .attr("opacity", "1")
      ;
    

    var textGroup = chartGroup.selectAll("text.states")
      .data(stateData)
      .enter()
      .append("text")
      .classed("states", true)
      .attr("dx", d => xLinearScale(d.poverty))
      .attr("dy", d => yLinearScale(d.healthcare)+4)
      .style("text-anchor","middle")
      .attr("fill", "white")
      .text(d=> d.abbr);
    
    var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`);
  
      
    var povertyLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("value","poverty")
      .classed("active",true)
      .text("In Poverty (%)");
      
    var ageLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 15)
      .attr("value","age")
      .classed("inactive",true)
      .text("Age (Median)");

    var incomeLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 30)
      .attr("value","income")
      .classed("inactive",true)
      .text("Income (Median)");


    var yLabelsGroup = chartGroup.append("g")
      .attr("transform","rotate(-90)");
      

    var healthcareLabel = yLabelsGroup.append("text")
      .attr("y", 0 - 25)
      .attr("x", - (height /2))
      .attr("value","healthcare")
      .classed("active",true)
      .text("Lacks Healthcare (%)");

    var smokesLabel = yLabelsGroup.append("text")
      .attr("y", 0 - 40)
      .attr("x", - (height /2))
      .attr("value","smokes")
      .classed("inactive",true)
      .text("Smokes (%)");
    
    var obeseLabel = yLabelsGroup.append("text")
      .attr("y", 0 - 55)
      .attr("x", - (height /2))
      .attr("value","obesity")
      .classed("inactive",true)
      .text("Obese (%)");

    
    xLabelsGroup.selectAll("text").on("click",function() {
      var value = d3.select(this).attr("value");

      if (value !== chosenXAxis) {
        chosenXAxis = value;

        xLinearScale = xScale(stateData, chosenXAxis);

        xAxis = renderXAxis(xLinearScale, xAxis);

        circleGroup = renderXCirles(circleGroup, xLinearScale, chosenXAxis);
        textGroup = renderXText(textGroup, xLinearScale, chosenXAxis,stateData);

        if (chosenXAxis === 'poverty') {
          povertyLabel
            .classed("active",true)
            .classed("inactive", false);
          ageLabel
            .classed("active",false)
            .classed("inactive", true);
          incomeLabel
            .classed("active",false)
            .classed("inactive", true);
        } else if (chosenXAxis === 'age') {
          povertyLabel
            .classed("active",false)
            .classed("inactive", true);
          ageLabel
            .classed("active",true)
            .classed("inactive", false);
          incomeLabel
            .classed("active",false)
            .classed("inactive", true);
        } else {
          povertyLabel
            .classed("active",false)
            .classed("inactive", true);
          ageLabel
            .classed("active",false)
            .classed("inactive", true);
          incomeLabel
            .classed("active",true)
            .classed("inactive", false);
        };
      };

    });

  
    yLabelsGroup.selectAll("text").on("click",function() {
      var value = d3.select(this).attr("value");

      if (value !== chosenYAxis) {
        chosenYAxis = value;

        yLinearScale = yScale(stateData, chosenYAxis);

        yAxis = renderYAxis(yLinearScale, yAxis);

        circleGroup = renderYCirles(circleGroup, yLinearScale, chosenYAxis,stateData);
        textGroup = renderYText(textGroup, yLinearScale, chosenYAxis);

        if (chosenYAxis === 'healthcare') {
          healthcareLabel
            .classed("active",true)
            .classed("inactive", false);
          smokesLabel
            .classed("active",false)
            .classed("inactive", true);
          obeseLabel
            .classed("active",false)
            .classed("inactive", true);
        } else if (chosenYAxis === 'smokes') {
          healthcareLabel
            .classed("active",false)
            .classed("inactive", true);
          smokesLabel
            .classed("active",true)
            .classed("inactive", false);
          obeseLabel
            .classed("active",false)
            .classed("inactive", true);
        } else {
          healthcareLabel
            .classed("active",false)
            .classed("inactive", true);
          smokesLabel
            .classed("active",false)
            .classed("inactive", true);
          obeseLabel
            .classed("active",true)
            .classed("inactive", false);
        };
      };


    });
    


});