function drawYolkVis(svgClass, data, axes) {
  let yolkAttr = {
    "width": 700,
    "height": 700,
    "circleWidth": 600,
    "circleHeight": 600,
    "margin": 40
  };
  let levels = 5;
  let maxValue = 7;
  let dotRadius = 4;
  let platformColor = d3.scaleOrdinal().domain(['Disney+', 'Hulu', 'Netflix', 'Prime Video']).range(['#9e9e9e','#60EEA8','#ED535B','#4DC2EA']);

  var allAxis = (axes),	//Names of each axis
  total = allAxis.length,	//The number of different axes
  radius = Math.min((yolkAttr.circleWidth-yolkAttr.margin*2)/2, (yolkAttr.circleHeight-yolkAttr.margin*2)/2), 	//Radius of the outermost circle
  angleSlice = Math.PI * 2 / total;	//The width in radians of each "slice"

  // translate rating values to radius
  var rScale = d3.scaleLinear().domain([5, 7.5]).range([0, radius]);

  var svg = d3.select(svgClass);
  // .attr("class", "radar"+"#yolk");

  //Append a g element
  var g = svg.append("g")
     .attr("transform", "translate(" + (yolkAttr.circleWidth/2 + yolkAttr.margin) + "," + (yolkAttr.circleHeight/2 + yolkAttr.margin) + ")");

  var axisGrid = g.append("g").attr("class", "axisWrapper");

  //Draw the background circles
  axisGrid.selectAll(".levels")
    .data(d3.range(1,levels+1).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", d => radius/levels*d)
    .style("fill", "#e5e5e5")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", 0.1);

  //Text indicating at what rating each level is
  axisGrid.selectAll(".axisLabel")
     .data(d3.range(1,(levels+1)).reverse())
     .enter()
     .append("text")
     .attr("class", "axisLabel")
     .attr("x", 4)
     .attr("y", d => -d*radius/levels)
     .attr("dy", "0.4em")
     .style("font-size", "14px")
     .attr("fill", "#737373")
     .text(d => maxValue + d/2 - 2);

  //Create the straight lines radiating outward from the center
  var axis = axisGrid.selectAll(".axis")
     .data(allAxis)
     .enter()
     .append("g")
     .attr("class", "axis");

  //Append the lines
  axis.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", (d, i) => rScale(maxValue) * Math.cos(angleSlice*i - Math.PI/2))
    .attr("y2", (d, i) => rScale(maxValue) * Math.sin(angleSlice*i - Math.PI/2))
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "2px");

  //Append the labels at each axis
  axis.append("text")
    .attr("class", "legend")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", (d, i) => rScale(maxValue * 1.13) * Math.cos(angleSlice*i - Math.PI/2))
    .attr("y", (d, i) => rScale(maxValue * 1.13) * Math.sin(angleSlice*i - Math.PI/2))
    .text(d => d);
    // .call(wrap, wrapWidth);

  //The radial line function
  var radarLine = d3.lineRadial()
    .radius(d => rScale(d.ratings))
    .angle((d,i) => i*angleSlice)
    .curve(d3.curveCardinalClosed);

  // if(roundStrokes) {
  //   radarLine.curve(d3.curveCardinalClosed);
  // }

  // Create a wrapper for the blobs
  var blobWrapper = g.selectAll(".radarWrapper")
     .data(data)
     .enter()
     .append("g")
     .attr("class", "radarWrapper");

  blobWrapper.append("path")
    .attr("class", "radarArea")
    .attr("d", d => radarLine(d) )
    .style("fill", (d,i) => platformColor(i))
    .style("fill-opacity", 0.15)
    .on('mouseover', function (d,i) {
        //Dim all blobs
        d3.selectAll(".radarArea")
          .transition().duration(200)
          .style("fill-opacity", 0.1);

        //dim the outlines as well
        d3.selectAll(".radarStroke")
          .transition().duration(200)
          .style("opacity", 0.2);

        //Bring back the hovered over blob
        d3.select(this)
          .transition().duration(200)
          .style("fill-opacity", 0.7);

        let dict = { 0:["Disney+", "Documentary", "Comedy"], 1:["Hulu", "Documentary", "Family"], 2:["Netflix","Documentary", "Thriller"], 3:["Prime Video", "Documentary", "Thriller"]};

        d3.select("#yolk_hover")
          .append("text")
          .attr("class", "yolk_hover_text")
          .style("text-align", "center")
          .style("font-size", "20px")
          .style("font-weight", "bold")
          .style("display", "block")
          .style("margin-bottom", "10px")
          .text(dict[i][0]);

        d3.select("#yolk_hover")
          .append("text")
          .attr("class", "yolk_hover_text")
          .style("display", "block")
          .style("margin-bottom", "10px")
          .text("Highest rated genre: " + dict[i][1])

        d3.select("#yolk_hover")
          .append("text")
          .attr("class", "yolk_hover_text")
          .style("display", "block")
          .style("margin-bottom", "10px")
          .text("Lowest rated genre: " + dict[i][2])
      })
      .on('mouseout', function(){
        //Bring back all blobs
        d3.selectAll(".radarArea")
          .transition().duration(200)
          .style("fill-opacity", 0.15);

        //bring back stroke-width
        d3.selectAll(".radarStroke")
          .transition().duration(200)
          .style("opacity", 1);

        d3.selectAll(".yolk_hover_text")
          .text("")
     });

  //Create the outlines
  blobWrapper.append("path")
     .attr("class", "radarStroke")
     .attr("d", (d,i) => radarLine(d))
     .style("stroke-width", "3px")
     .style("stroke", (d,i) => platformColor(i))
     .style("fill", "none");

  //Append the circles
  blobWrapper.selectAll(".radarCircle")
    .data( d => d)
    .enter().append("circle")
    .attr("class", "radarCircle")
    .attr("r", dotRadius)
    .attr("cx", (d,i) => rScale(d.ratings) * Math.cos(angleSlice*i - Math.PI/2))
    .attr("cy", (d,i) => rScale(d.ratings) * Math.sin(angleSlice*i - Math.PI/2))
    .style("fill", (d, i, j) => platformColor(j) )
    .style("fill-opacity", 0.8);

  //hovering interaction
  var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
     .data(data)
     .enter().append("g")
     .attr("class", "radarCircleWrapper");

  //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper.selectAll(".radarInvisibleCircle")
      .data((d,i) => d)
      .enter().append("circle")
      .attr("class", "radarInvisibleCircle")
      .attr("r", dotRadius*1.5)
      .attr("cx", (d,i) => rScale(d.ratings) * Math.cos(angleSlice*i - Math.PI/2))
      .attr("cy", (d,i) => rScale(d.ratings) * Math.sin(angleSlice*i - Math.PI/2))
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function(d,i) {
        newX =  parseFloat(d3.select(this).attr('cx')) - 10;
        newY =  parseFloat(d3.select(this).attr('cy')) - 10;

        tooltip.attr('x', newX)
               .attr('y', newY)
               .text(d.ratings)
               .transition().duration(200)
               .style('opacity', 1);
      })
      .on("mouseout", function(){
        tooltip.transition().duration(200)
           .style("opacity", 0);
      });


    var tooltip = g.append("text")
       .attr("class", "tooltip")
       .style("opacity", 0);


  // helper function
  // function wrap(text, width) {
  //
  // text.each(function(){
  //
  //   var text = d3.select(this),
  //       words = text.text().split(/\s+/).reverse(),
  //       word,
  //       line = [],
  //       lineNumber = 0,
  //       lineHeight = 1.4, // ems
  //       y = text.attr("y"),
  //       x = text.attr("x"),
  //       dy = parseFloat(text.attr("dy")),
  //       tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
  //
  //   while (word = words.pop()) {
  //       line.push(word);
  //       tspan.text(line.join(" "));
  //       if (tspan.node().getComputedTextLength() > width) {
  //         line.pop();
  //         tspan.text(line.join(" "));
  //         line = [word];
  //         tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
  //       }
    // }
}
