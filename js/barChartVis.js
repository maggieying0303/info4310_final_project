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
      .attr("id", d => "outline_" + d.replace("+", ""))
      .attr("height", yScale.bandwidth())
      .attr("width", function(d, i) {
        return xScale(totalMovies[d]) - xScale(0);
      })
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", "3px");
  svg.selectAll("#textTitle")
    .data(platforms)
    .enter()
    .append("text")
      .attr("id", d => "totalText_" + d.replace("+", ""))
      .attr("x", d => xScale(0))
      .attr("y", (d, i) => yScale(i) + padding*2)
      .text(d => d + ": " + data[selectedGenre][d])
      .style("font-weight", "bold")
      .style("font-size", "20px")
      .append("tspan")
      .attr("id", d => "tspan_" + d.replace("+", ""))
      .text(d => " / " + totalMovies[d] + " movies")
      .style("fill", "#d3d3d3")
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
    .style("fill", (d, i) => i == 0 ? "#d3d3d3" : "#ffffff")
    .style("stroke", "black")
    .style("stroke-width", "3px")
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
        d3.select("#totalText_" + p.replace("+", "")).remove();
        svg.append("text")
            .attr("id", "totalText_" + p.replace("+", ""))
            .attr("x", xScale(0))
            .attr("y", yScale(platforms.indexOf(p)) + padding*2)
            .text(p + ": " + data[d][p])
            .style("font-weight", "bold")
            .style("font-size", "20px")
            .append("tspan")
            .attr("id", "tspan_" + p.replace("+", ""))
            .text(" / " + totalMovies[p] + " movies")
            .style("fill", "#a6a4a4")
            .style("font-size", "20px");
      }

      // change color of filter button
      d3.selectAll(".filterButton")
        .style("fill", "#ffffff")
        .style("stroke", "black")
        .style("stroke-width", "3px");
      d3.select(this)
        .transition()
        .duration(300)
        .style("fill", "#d3d3d3")
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

      console.log("test")

      d3.selectAll(".netflix_hover_bar")
        .on('mouseover', function(){

          d3.select("#rect_Disney")
            .transition().duration(200)
            .style("fill-opacity", 0.3);

          d3.select("#rect_Prime")
            .transition().duration(200)
            .style("fill-opacity", 0.3);

          d3.select("#rect_Hulu")
            .transition().duration(200)
            .style("fill-opacity", 0.3);

            d3.select("#totalText_Disney")
              .transition().duration(200)
              .style("fill-opacity", 0.3);

            d3.select("#totalText_Prime")
              .transition().duration(200)
              .style("fill-opacity", 0.3);

            d3.select("#totalText_Hulu")
              .transition().duration(200)
              .style("fill-opacity", 0.3);

              d3.select("#outline_Disney")
                .transition().duration(200)
                .style("opacity", 0.3);

              d3.select("#outline_Prime")
                .transition().duration(200)
                .style("opacity", 0.3);

              d3.select("#outline_Hulu")
                .transition().duration(200)
                .style("opacity", 0.3);

        })
        .on('mouseout', function(){

          d3.select("#rect_Disney")
            .transition().duration(200)
            .style("fill-opacity", 1);

          d3.select("#rect_Prime")
            .transition().duration(200)
            .style("fill-opacity", 1);

          d3.select("#rect_Hulu")
            .transition().duration(200)
            .style("fill-opacity", 1);

            d3.select("#totalText_Disney")
              .transition().duration(200)
              .style("fill-opacity", 1);

            d3.select("#totalText_Prime")
              .transition().duration(200)
              .style("fill-opacity", 1);

            d3.select("#totalText_Hulu")
              .transition().duration(200)
              .style("fill-opacity", 1);

              d3.select("#outline_Disney")
                .transition().duration(200)
                .style("opacity", 1);

              d3.select("#outline_Prime")
                .transition().duration(200)
                .style("opacity", 1);

              d3.select("#outline_Hulu")
                .transition().duration(200)
                .style("opacity", 1);
        });

        d3.selectAll(".hulu_hover_bar")
          .on('mouseover', function(){

            d3.select("#rect_Disney")
              .transition().duration(200)
              .style("fill-opacity", 0.3);

            d3.select("#rect_Prime")
              .transition().duration(200)
              .style("fill-opacity", 0.3);

            d3.select("#rect_Netflix")
              .transition().duration(200)
              .style("fill-opacity", 0.3);

              d3.select("#totalText_Disney")
                .transition().duration(200)
                .style("fill-opacity", 0.3);

              d3.select("#totalText_Prime")
                .transition().duration(200)
                .style("fill-opacity", 0.3);

              d3.select("#totalText_Netflix")
                .transition().duration(200)
                .style("fill-opacity", 0.3);

                d3.select("#outline_Disney")
                  .transition().duration(200)
                  .style("opacity", 0.3);

                d3.select("#outline_Prime")
                  .transition().duration(200)
                  .style("opacity", 0.3);

                d3.select("#outline_Netflix")
                  .transition().duration(200)
                  .style("opacity", 0.3);

          })
          .on('mouseout', function(){

            d3.select("#rect_Disney")
              .transition().duration(200)
              .style("fill-opacity", 1);

            d3.select("#rect_Prime")
              .transition().duration(200)
              .style("fill-opacity", 1);

            d3.select("#rect_Netflix")
              .transition().duration(200)
              .style("fill-opacity", 1);

              d3.select("#totalText_Disney")
                .transition().duration(200)
                .style("fill-opacity", 1);

              d3.select("#totalText_Prime")
                .transition().duration(200)
                .style("fill-opacity", 1);

              d3.select("#totalText_Netflix")
                .transition().duration(200)
                .style("fill-opacity", 1);

                d3.select("#outline_Disney")
                  .transition().duration(200)
                  .style("opacity", 1);

                d3.select("#outline_Prime")
                  .transition().duration(200)
                  .style("opacity", 1);

                d3.select("#outline_Netflix")
                  .transition().duration(200)
                  .style("opacity", 1);
          });

          d3.selectAll(".disney_hover_bar")
            .on('mouseover', function(){

              console.log("hoho");

              d3.select("#rect_Netflix")
                .transition().duration(200)
                .style("fill-opacity", 0.3);

              d3.select("#rect_Prime")
                .transition().duration(200)
                .style("fill-opacity", 0.3);

              d3.select("#rect_Hulu")
                .transition().duration(200)
                .style("fill-opacity", 0.3);

                d3.select("#totalText_Hulu")
                  .transition().duration(200)
                  .style("fill-opacity", 0.3);

                d3.select("#totalText_Prime")
                  .transition().duration(200)
                  .style("fill-opacity", 0.3);

                d3.select("#totalText_Netflix")
                  .transition().duration(200)
                  .style("fill-opacity", 0.3);

                  d3.select("#outline_Netflix")
                    .transition().duration(200)
                    .style("opacity", 0.3);

                  d3.select("#outline_Prime")
                    .transition().duration(200)
                    .style("opacity", 0.3);

                  d3.select("#outline_Hulu")
                    .transition().duration(200)
                    .style("opacity", 0.3);

            })
            .on('mouseout', function(){

              d3.select("#rect_Netflix")
                .transition().duration(200)
                .style("fill-opacity", 1);

              d3.select("#rect_Prime")
                .transition().duration(200)
                .style("fill-opacity", 1);

              d3.select("#rect_Hulu")
                .transition().duration(200)
                .style("fill-opacity", 1);

                d3.select("#totalText_Hulu")
                  .transition().duration(200)
                  .style("fill-opacity", 1);

                d3.select("#totalText_Prime")
                  .transition().duration(200)
                  .style("fill-opacity", 1);

                d3.select("#totalText_Netflix")
                  .transition().duration(200)
                  .style("fill-opacity", 1);

                  d3.select("#outline_Netflix")
                    .transition().duration(200)
                    .style("opacity", 1);

                  d3.select("#outline_Prime")
                    .transition().duration(200)
                    .style("opacity", 1);

                  d3.select("#outline_Hulu")
                    .transition().duration(200)
                    .style("opacity", 1);
            });

            d3.selectAll(".prime_hover_bar")
              .on('mouseover', function(){

                console.log("okok");

                d3.select("#rect_Disney")
                  .transition().duration(200)
                  .style("fill-opacity", 0.3);

                d3.select("#rect_Netflix")
                  .transition().duration(200)
                  .style("fill-opacity", 0.3);

                d3.select("#rect_Hulu")
                  .transition().duration(200)
                  .style("fill-opacity", 0.3);

                  d3.select("#totalText_Disney")
                    .transition().duration(200)
                    .style("fill-opacity", 0.3);

                  d3.select("#totalText_Netflix")
                    .transition().duration(200)
                    .style("fill-opacity", 0.3);

                  d3.select("#totalText_Netflix")
                    .transition().duration(200)
                    .style("fill-opacity", 0.3);

                    d3.select("#outline_Disney")
                      .transition().duration(200)
                      .style("opacity", 0.3);

                    d3.select("#outline_Netflix")
                      .transition().duration(200)
                      .style("opacity", 0.3);

                    d3.select("#outline_Hulu")
                      .transition().duration(200)
                      .style("opacity", 0.3);


              })
              .on('mouseout', function(){

                d3.select("#rect_Disney")
                  .transition().duration(200)
                  .style("fill-opacity", 1);

                d3.select("#rect_Netflix")
                  .transition().duration(200)
                  .style("fill-opacity", 1);

                d3.select("#rect_Hulu")
                  .transition().duration(200)
                  .style("fill-opacity", 1);

                  d3.select("#totalText_Disney")
                    .transition().duration(200)
                    .style("fill-opacity", 1);

                  d3.select("#totalText_Netflix")
                    .transition().duration(200)
                    .style("fill-opacity", 1);

                  d3.select("#totalText_Netflix")
                    .transition().duration(200)
                    .style("fill-opacity", 1);

                    d3.select("#outline_Disney")
                      .transition().duration(200)
                      .style("opacity", 1);

                    d3.select("#outline_Netflix")
                      .transition().duration(200)
                      .style("opacity", 1);

                    d3.select("#outline_Hulu")
                      .transition().duration(200)
                      .style("opacity", 1);

              });
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
