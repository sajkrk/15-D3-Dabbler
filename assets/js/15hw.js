// @TODO: YOUR CODE HERE!

// setting up our chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
	top:20,
	right: 40,
	bottom: 60,
	left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an svg wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
	.select('#scatter')
	.append('svg')
	.attr('width', svgWidth)
	.attr('height', svgHeight);

// The <g> SVG element is a container used to group other SVG elements
var plot = svg.append("g")
//this is the presentation stage
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
 
// Import data 
d3.csv("data.csv").then(function(Datacsv){
	//console.log(Datacsv);

	Datacsv.forEach(function(data){
		 
		// parse data
		data.poverty = +data.poverty;
		//console.log(data.poverty)
		data.healthcare = +data.healthcare;
		//console.log(data.healthcare)
			
	});

	//create scale function
	var xLinearScale = d3.scaleLinear()
	//.domain([d3.min(Datacsv, d => d.poverty), d3.max(Datacsv, d => d.poverty)])
	.domain([8, d3.max(Datacsv, d => d.poverty)])
	.range([0, width]);

	var yLinearScale = d3.scaleLinear()
	//.domain([d3.min(Datacsv, d => d.healthcare), d3.max(Datacsv, d => d.healthcare)])
	.domain([3, d3.max(Datacsv, d => d.healthcare)])
	.range([height, 0]);

	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);

	 // append axis to the plot
	plot.append("g")
	  .attr("transform", `translate(0, ${height})`)
	  .call(bottomAxis);

	plot.append("g")
	  .call(leftAxis);

	// create circles
	var circlesGroup = plot.selectAll("circle")
	  .data(Datacsv)
	  .enter()
	  
	var cTip = circlesGroup
	  .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "coral")
	  .attr("opacity", ".5");

	// create text labels with state abbreviation for each circles
	circlesGroup.append("text")
	  .attr("x", d => xLinearScale(d.poverty))
	  .attr("y", d => yLinearScale(d.healthcare))
	  .attr("stroke", "gray")
	  .attr("font-size", "10px")
	  .text(d => d.abbr)
	
	// initialize tool tip
	var toolTip = d3.tip()
	  .attr("class", "tooltip")
	  .offset([80, -60])
	  .html(function(d) {
		return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
	  });

	// create tool tip in the plot
	cTip.call(toolTip);

	// create event listener to display and hide the tooltip
	circlesGroup.on("click", function(data) {
		toolTip.show(data, this);
	})

	// onmouseout event
		.on("mouseout", function(data, index) {
			toolTip.hide(data);
	  });

	//  Create X-axis and Y-axis labels
	plot.append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
	  .text("Lacks Healthcare (%)");
	  
	plot.append("text")
	  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
	  .attr("class", "axisText")
      .text("In Poverty (%)");
  }).catch(function(error) {
	console.log(error); 
  }); 






























    