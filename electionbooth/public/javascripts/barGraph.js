  window.onload = function()
  {


  var apiendpoint = [
			{"count": 32, "mastername": "brigade"}, 
			{"count": 28, "mastername": "balu"}, 
			{"count": 22, "mastername": "vc"}, 
			{"count": 12, "mastername": "sp2"}, 
			{"count": 7, "mastername": "sp1"}, 
			{"count": 2, "mastername": "sbm"}, 
			{"count": 1, "mastername": "raju"}
		]; 

	apiendpoint = "timegraphdata";
		
		d3.json(apiendpoint, function(dataset){
    
			//Width and height
			var margin = {top: 20, right: 20, bottom: 30, left: 40};           
			var width = 1400 - margin.left - margin.right;
			var height= 500 - margin.top - margin.bottom;
			var w = width;
			var h = height;
			var padding = 100;
			var barWidth = 5;
			var pad1px = 1;
			
			var colorScale = d3.scale.linear()
                       .domain([0, d3.max(dataset, function(d){
											return d.count; })])
                       .range(["yellow", "red"]);
			
			var xScale = d3.scale.ordinal()
				.domain(dataset.map(function (d) {return d.date; }))
				.rangeRoundBands([margin.left, width], 0.05);

			var xScaleLinear = d3.scale.linear()
				.domain([0, dataset.length])
				.range([margin.left, width])
			
			var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

			var yScale = d3.scale.linear()
				.domain([0, d3.max(dataset, function(d) {return d.count; })])
				.range([h,0]);

			var yAxis = d3.svg.axis().scale(yScale).orient("left");
				
			//Create SVG element
			var svg = d3.select("body")
				.append("svg")
				.attr("width", w)
				.attr("height", h+padding);

			//Create bars
			svg.selectAll("rect")
				.data(dataset)
				.enter().append("rect")
					.attr("x", function(d, i) {
						return xScale(d.date);
					})
					.attr("y", function(d) {
						return yScale(d.count);
					})
					//.attr("width", xScale.rangeBand())
					.attr("width", barWidth)
					.attr("height", function(d) {
						return h - yScale(d.count);
					})
					/*
					.attr("fill", function(d) {
						return "rgb(0, 0, " + (d.count * 10) + ")";
					});
					*/
					.attr("fill", function(d){ return colorScale(d.count);})
			
			//Create counts on bars
			svg.selectAll("text")
				.data(dataset)
				.enter()
					.append("text")
					.attr("x", function(d, i){ 
						//console.log(xScaleLinear(i));
						//return 50 + 50*(i+1);
						return xScaleLinear(i) + barWidth*1;
					})
					.attr("y", function(d){ 
						//console.log("value of count = " + d.count);
						if (d.count > 5)
							return yScale(d.count);
						else
							return yScale(d.count) - 20;
					})
					//.attr("dx", -xScale.rangeBand()/2)
					.attr("dx", -barWidth/2)
					.attr("dy", "1.2em")
					.attr("text-anchor", "middle")
					.text(function(d){ return d.count; })
					.attr("class", "value");
			
			//Create x axis
			var xAxisOffset = h + 2;
			svg.append("g")
				.attr("class", "xaxis")
				.attr("transform", "translate(0," + xAxisOffset + ")")
				//.attr("transform", "rotate(-50)")
				.call(xAxis);
			
			//Create y axis
			svg.append("g")
				.attr("class", "yaxis")
				.attr("transform", "translate(" + 30 + ", 0)")
				.call(yAxis);
			
			//Rotate xaxis text by 90 degrees
			svg.selectAll(".xaxis text")
				.attr("transform", function(d){
				
					return "translate(" + this.getBBox().height * -1 + "," + 		this.getBBox().height*2 + ") rotate(-90)";
					
					//return "rotate(-90)";
				});
			
			//Add legend/label to the graph
			svg.append("text")
				.attr("x", 280)
				.attr("y", 550)
				.style("text-anchor", "middle")
				.text("Disconnects less than 1-min duration")
			
			//Add date legend/label to the graph
			svg.append("text")
				.attr("x", 350)
				.attr("y", 20)
				.style("text-anchor", "middle")
				.attr("fill", "blue")
				.text("Date Range :: 01-Oct to 17-Oct")
				
						 var focus = svg.append("g")
						.attr("class", "focus")
						.style("display", "none");

				focus.append("circle")
						.attr("r", 4.5);

				focus.append("text")
						.attr("x", 9)
						.attr("dy", ".35em");
        
				var bisectDate = d3.bisector(function(d) { return d.date; });
				 
	
	/*
	append("rect")
					.attr("class", "overlay")
					.attr("width", width)
					.attr("height", height)
					*/
					
				// svg.on("mouseover", function() {focus.style("display" , null) ;})
				// 	.on("mouseout", function() { focus.style("display", "none"); })
				// 	.on("mousemove", mousemove);

	
	
	
	// function mousemove()
	// {
	// var x0 = xScaleLinear.invert(d3.mouse(this)[0]),
 //        i = bisectDate(dataset, x0, 1),
 //        d0 = dataset[i - 1],
 //        d1 = dataset[i],
 //        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
 //    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
 //    focus.select("text").text(d);
	// }

	//	});
});}