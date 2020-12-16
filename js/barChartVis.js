function drawBarChart(svgClass, topGenres, platforms, top20_genres) {
  let padding = 25;
  let barAttr = {
    "width": 900,
    "height": 600
  };
  let totalMovies = {
    "Netflix": 3560,
    "Hulu": 903,
    "Prime": 12354,
    "Disney+": 564
  };
  let platformColor = d3.scaleOrdinal().domain(['Netflix', 'Hulu', 'Prime', 'Disney+']).range(['#ED535B','#60EEA8','#4DC2EA','#9e9e9e']);

  let svg = d3.select(svgClass);
  let selectedGenre = "Drama";

  let data = parseGenreData(topGenres, top20_genres);
  console.log(data);

  let yScale = d3.scaleBand()
    .domain(d3.range(4))
    .range([padding*6, barAttr.height - padding*3])
    .padding(0.75)

  let xScale = d3.scaleLinear()
    .domain([0, 13000]) // hardcoded
    .range([padding*4, barAttr.width-padding*4]);

  // draw color rect for transitions
  svg.selectAll("#colorRect")
    .data(platforms)
    .enter()
    .append("rect")
      .attr("id", d => "rect_"+d.replace("+", ""))
      .attr("x", d => xScale(0))
      .attr("y", (d, i) => yScale(i))
      .attr("height", yScale.bandwidth())
      .attr("width", function(d, i) {
        return xScale(data[selectedGenre][d]) - xScale(0);
      })
      .style("fill", (d,i) => platformColor(i));
  svg.selectAll("#textRect")
    .data(platforms)
    .enter()
    .append("rect")
      .attr("x", d => xScale(0))
      .attr("y", (d, i) => yScale(i))
      .attr("height", yScale.bandwidth())
      .attr("width", function(d, i) {
        return xScale(totalMovies[d]) - xScale(0);
      })
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", 4);
  // add platform names
  svg.selectAll("#totalText")
    .data(platforms)
    .enter()
    .append("text")
      .attr("x", d => xScale(totalMovies[d]) + padding/2)
      .attr("y", (d, i) => yScale(i)+(padding*1.5)/2)
      .text(d => totalMovies[d])
      .style("font-weight", "bold")
      .style("font-size", "20px");
  svg.selectAll("#textTitle")
    .data(platforms)
    .enter()
    .append("text")
      .attr("id", d => "totalText_" + d)
      .attr("x", d => xScale(0))
      .attr("y", (d, i) => yScale(i) + padding*2)
      .text(d => d + ": " + data[selectedGenre][d] + " movies")
      .style("font-weight", "bold")
      .style("font-size", "20px");

  // add filter buttons
  svg.selectAll("#buttons")
    .data(topGenres)
    .enter()
    .append("rect")
    .attr("class", "filterButton")
    .attr("x", (d, i) => (barAttr.width/4)*(Math.trunc((i)/2))+padding*2)
    .attr("y", function (d,i) {
      if (i % 2 == 0) {
        return padding*2;
      } else {
        return padding*4;
      }
    })
    .attr("height", padding*1.5)
    .attr("width", padding*6)
    .style("fill", (d, i) => i == 0 ? "#a6a4a4" : "#dadada")
    .style("stroke", (d, i) => i==0 ? "black" : "none")
    .style("stroke-width", (d, i) => i==0 ? "3px" : "0px")
    .style("cursor", "pointer")
    .style("rx", 5)
    .on("click", function(d) {
      // transition colored rect
      for (var p of platforms) {
        d3.select("#rect_"+p.replace("+", ""))
          .transition()
          .duration(500)
          .attr("width", xScale(data[d][p]) - xScale(0));

        // change total text
        d3.select("#totalText_" + p.replace("+", ""))
          .transition()
          .duration(200)
          .text(p + ": " + data[d][p.replace("+", "")] + " movies");
      }

      // change color of filter button
      d3.selectAll(".filterButton")
        .style("fill", "#dadada")
        .style("stroke", "none");
      d3.select(this)
        .transition()
        .duration(300)
        .style("fill", "#A6A4A4")
        .style("stroke", "black")
        .style("stroke-width", "3px");
    });
  // add filter button labels
  svg.selectAll("#buttonText")
    .data(topGenres)
    .enter()
    .append("text")
      .attr("x", (d, i) => (barAttr.width/4)*(Math.trunc((i)/2))+padding*5)
      .attr("y", function (d,i) {
        if (i % 2 == 0) {
          return padding*2+(padding*1.75)/2;
        } else {
          return padding*4+(padding*1.75)/2;
        }
      })
      .text(d => d)
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("text-anchor", "middle");
}

function parseGenreData(topGenres, top20_genres) {
  var final = {};
  var genreSet = new Set(topGenres);
  for (var g of top20_genres) {
    if (genreSet.has(g["Genre"])) {
      final[g["Genre"]] = {
        "Netflix": g["Netflix"],
        "Disney+": g["Disney+"],
        "Hulu": g["Hulu"],
        "Prime": g["Prime Video"]
      }
    }
  }
  return final;
}
