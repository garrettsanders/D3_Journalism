var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 70
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data

d3.csv("../data/data.csv").then(function(HealthData) {

    console.log(HealthData);
    //parse data
    HealthData.forEach(function(FilteredData) {
      FilteredData.healthcare = +FilteredData.healthcare;
      FilteredData.poverty = +FilteredData.poverty;
    });
    
    

    var xLinearScale = d3.scaleLinear()
      .domain([5, d3.max(HealthData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(HealthData, d => d.healthcare)])
      .range([height,0]);

    //create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append Axes to the graph
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis)

    var circlesGroup = chartGroup.selectAll("circle")
      .data(HealthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", 15)
      .attr("fill", "blue")
      .attr("opacity", ".5")
      .attr("stroke", "black");

      var circleLabels = chartGroup.selectAll(null).data(HealthData).enter().append("text");

      circleLabels
        .attr("x", function(d) {
          return xLinearScale(d.poverty);
        })
        .attr("y", function(d) {
          return yLinearScale(d.healthcare);
        })
        .text(function(d) {
          return d.abbr
        })
        .attr("font-size", "10px")
        .attr("text-anchor", "middle");


      //set up tool tip
      var toolTip = d3.tip()
        .attr("id", "toolTip")
        .offset([80, -60])
        .html(function(d) {
          return(`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
        });
        

      //create tooltip in graph
      chartGroup.call(toolTip);

      circlesGroup.call(toolTip);

      //event listeners
      circlesGroup.on("click", function(FilteredData) {
        toolTip.show(FilteredData, this);
      })

      //onmouseout event
      .on("mouseover", function(data) {
        toolTip.show(data, this);
      })
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
// Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);


          
        });


