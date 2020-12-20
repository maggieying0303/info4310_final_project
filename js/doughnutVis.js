function drawDoughnutVis(svgClass, topGenres, platforms, top20_genres) {
  let width = 250;
  let height = 250;
  let margin = 10;

  let padding = 25;
  let barAttr = {
    "width": 900,
    "height": 600
  };

  var radius = Math.min(width, height) / 2 - margin; // radius is 1/2 smallest of width or height
  var innerRadius = 75;

  let totalMovies = {
    "Netflix": 3560,
    "Hulu": 903,
    "Prime": 12354,
    "Disney+": 564
  };

  let svg = d3.select(svgClass)
              .append("svg")
              .attr("width", 1000)
              .attr("height", 1000)
              .append("g")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  let selectedGenre = "Drama";

  let data = parseGenreData(topGenres, top20_genres);

  let genreList = {};
  // for every genre
  for (i in data) {
    // for every provider in that genre
    genreList[i] = [];
    for (j in data[i]) {
      if (j == "Netflix") {
        genreList[i].push({[j]: data[i][j], "Netflix_Remainder": 3560 - data[i][j]});
      }
      else if (j == "Hulu") {
        genreList[i].push({[j]: data[i][j], "Hulu_Remainder": 903 - data[i][j]});
      }
      else if (j == "Disney+") {
        genreList[i].push({[j]: data[i][j], "Disney+_Remainder": 564 - data[i][j]});
      }
      else {
        genreList[i].push({[j]: data[i][j], "Prime_Remainder": 12354 - data[i][j]});
      }
    }
  }
  // console.log("huh")
  // console.log(genreList[selectedGenre]);
  // for (x in genreList[selectedGenre]) {
  //   if ()
  // }

  let netflixColor = d3.scaleOrdinal()
                        .domain(['Netflix', 'Netflix_Remainder'])
                        .range(['#ED535B', '#FFFFFF']);
  let huluColor = d3.scaleOrdinal()
                        .domain(['Hulu', 'Hulu_Remainder'])
                        .range(['#60EEA8', '#FFFFFF']);
  let disneyColor = d3.scaleOrdinal()
                        .domain(['Disney+', 'Disney+_Remainder'])
                        .range(['#4DC2EA', '#FFFFFF']);
  let primeColor = d3.scaleOrdinal()
                        .domain(['Prime', 'Prime_Remainder'])
                        .range(['#9e9e9e', '#FFFFFF']);

  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .value(function(d) {return d.value; })

  var data_ready = {}
  for (i in genreList) {
    data_ready[i] = [];
    for (j in genreList[i]) {
      data_ready[i].push(pie(d3.entries(genreList[i][j])));
    }
  }
  // console.log("Data format:")
  // console.log(data_ready);

  console.log("NEW IDEA")
  for (i in data_ready) {
    if (i == selectedGenre) {
      for (j in data_ready[selectedGenre]) {
        if (data_ready[i][j][0].data.key == "Netflix") {
            // draw prop of doughnut
            svg.selectAll('#colorPie')
               .data(data_ready[i][j])
               .enter()
               .append('path')
               .attr('d', d3.arc()
                  .innerRadius(innerRadius)
                  .outerRadius(radius)
               )
               .attr("transform", "translate(" + 0 + "," + 200 + ")")
               .attr('fill', function(d) {
                 return(netflixColor(d.data.key))
               })
               .attr("stroke", "black")
               .attr("stroke-width", "2px")
               .style("opacity", 1)

           svg.selectAll('#percentText')
              .data(data_ready[i][j])
              .enter()
              .append('text')
                .attr("x", -25)
                .attr("y", 10 + 200)
                .text(Math.round((data_ready[i][j][0].data.value /
                  totalMovies["Netflix"] * 100)).toString() + "%")
                .style("font-weight", "bold")
                .style("font-size", "24px")
                .style("text-align", "center")

           svg.selectAll('captionText')
              .data(data_ready[i][j])
              .enter()
              .append('text')
                .attr("x", -40) // manually adjusted centering
                .attr("y", 160 + 200)
                .text("Netflix")
                .style("font-weight", "bold")
                .style("font-size", "24px")
                .style("text-align", "center")

           svg.selectAll('metadata')
              .data(data_ready[i][j])
              .enter()
              .append('text')
                .attr("x", -80) // manually adjusted centering
                .attr("y", 200 + 200)
                .text((data_ready[i][j][0].data.value).toString() + " of " + totalMovies["Netflix"] + " movies")
                .style("font-weight", "regular")
                .style("font-size", "16")
                .style("text-align", "center")
                .style("opacity", 0.6)
        }
        else if (data_ready[i][j][0].data.key == "Hulu") {
          // draw prop of doughnut
          svg.selectAll('#colorPie')
             .data(data_ready[i][j])
             .enter()
             .append('path')
             .attr('d', d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(radius)
             )
             .attr("transform", "translate(" + 250 + "," + 200 + ")")
             .attr('fill', function(d) {
               return(huluColor(d.data.key))
             })
             .attr("stroke", "black")
             .attr("stroke-width", "2px")
             .style("opacity", 1)

           svg.selectAll('#percentText')
              .data(data_ready[i][j])
              .enter()
              .append('text')
                .attr("x", -25+250) // based on relative position of next circle
                .attr("y", 10 + 200)
                .text(Math.round((data_ready[i][j][0].data.value /
                  totalMovies["Hulu"] * 100)).toString() + "%")
                .style("font-weight", "bold")
                .style("font-size", "24px")
                .style("text-align", "center")

            svg.selectAll('captionText')
               .data(data_ready[i][j])
               .enter()
               .append('text')
                 .attr("x", -40+260) // manually adjusted centering
                 .attr("y", 160 + 200)
                 .text("Hulu")
                 .style("font-weight", "bold")
                 .style("font-size", "24px")
                 .style("text-align", "center")

             svg.selectAll('metadata')
                .data(data_ready[i][j])
                .enter()
                .append('text')
                  .attr("x", -80 + 260) // manually adjusted centering
                  .attr("y", 200 + 200)
                  .text((data_ready[i][j][0].data.value).toString() + " of " + totalMovies["Hulu"] + " movies")
                  .style("font-weight", "regular")
                  .style("font-size", "16")
                  .style("text-align", "center")
                  .style("opacity", 0.6)
        }
        else if (data_ready[i][j][0].data.key == "Disney+") {
          // draw prop of doughnut
          svg.selectAll('#colorPie')
             .data(data_ready[i][j])
             .enter()
             .append('path')
             .attr('d', d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(radius)
             )
             .attr("transform", "translate(" + 500 + "," + 200 + ")")
             .attr('fill', function(d) {
               return(disneyColor(d.data.key))
             })
             .attr("stroke", "black")
             .attr("stroke-width", "2px")
             .style("opacity", 1)

           svg.selectAll('#percentText')
              .data(data_ready[i][j])
              .enter()
              .append('text')
                .attr("x", -25+250+250) // based on relative position of next circle
                .attr("y", 10 + 200)
                .text(Math.round((data_ready[i][j][0].data.value /
                  totalMovies["Disney+"] * 100)).toString() + "%")
                .style("font-weight", "bold")
                .style("font-size", "24px")
                .style("text-align", "center")

            svg.selectAll('captionText')
               .data(data_ready[i][j])
               .enter()
               .append('text')
                 .attr("x", -40+260+230) // manually adjusted centering
                 .attr("y", 160 + 200)
                 .text("Disney+")
                 .style("font-weight", "bold")
                 .style("font-size", "24px")
                 .style("text-align", "center")

             svg.selectAll('metadata')
                .data(data_ready[i][j])
                .enter()
                .append('text')
                  .attr("x", -80 + 260 + 250) // manually adjusted centering
                  .attr("y", 200 + 200)
                  .text((data_ready[i][j][0].data.value).toString() + " of " + totalMovies["Disney+"] + " movies")
                  .style("font-weight", "regular")
                  .style("font-size", "16")
                  .style("text-align", "center")
                  .style("opacity", 0.6)
        }
        else {
          // draw prop of doughnut
          svg.selectAll('#colorPie')
             .data(data_ready[i][j])
             .enter()
             .append('path')
             .attr('d', d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(radius)
             )
             .attr("transform", "translate(" + 750 + "," + 200 + ")")
             .attr('fill', function(d) {
               return(primeColor(d.data.key))
             })
             .attr("stroke", "black")
             .attr("stroke-width", "2px")
             .style("opacity", 1)

           svg.selectAll('#percentText')
              .data(data_ready[i][j])
              .enter()
              .append('text')
                .attr("x", -25+250+250+250) // based on relative position of next circle
                .attr("y", 10 + 200)
                .text(Math.round((data_ready[i][j][0].data.value /
                  totalMovies["Prime"] * 100)).toString() + "%")
                .style("font-weight", "bold")
                .style("font-size", "24px")
                .style("text-align", "center")

            svg.selectAll('captionText')
               .data(data_ready[i][j])
               .enter()
               .append('text')
                 .attr("x", -40+260+240+250) // manually adjusted centering
                 .attr("y", 160 + 200)
                 .text("Prime")
                 .style("font-weight", "bold")
                 .style("font-size", "24px")
                 .style("text-align", "center")

             svg.selectAll('metadata')
                .data(data_ready[i][j])
                .enter()
                .append('text')
                  .attr("x", -80 + 260 + 260 + 225) // manually adjusted centering
                  .attr("y", 200 + 200)
                  .text((data_ready[i][j][0].data.value).toString() + " of " + totalMovies["Prime"] + " movies")
                  .style("font-weight", "regular")
                  .style("font-size", "16")
                  .style("text-align", "center")
                  .style("opacity", 0.6)
        }
      }
    }
  }

  // filter buttons
  svg.selectAll("#buttons")
    .data(topGenres)
    .enter()
    .append("rect")
    .attr("class", "filterButton")
    .attr("x", (d, i) => (barAttr.width/4)*(Math.trunc((i)/2))+padding*2 - 100)
    .attr("y", function (d,i) {
      if (i % 2 == 0) {
        return padding*2 - 150;
      } else {
        return padding*4 - 150;
      }
    })
    .attr("height", padding*1.5)
    .attr("width", padding*6)
    .style("fill", (d, i) => i == 0 ? "#a6a4a4" : "#dadada")
    .style("stroke", (d, i) => i==0 ? "black" : "none")
    .style("stroke-width", (d, i) => i==0 ? "3px" : "0px")
    .style("cursor", "pointer")
    .style("rx", 5)

  // filter button labels
  svg.selectAll("#buttonText")
    .data(topGenres)
    .enter()
    .append("text")
      .attr("x", (d, i) => (barAttr.width/4)*(Math.trunc((i)/2))+padding*5 - 100)
      .attr("y", function (d,i) {
        if (i % 2 == 0) {
          return padding*2+(padding*1.75)/2 - 150;
        } else {
          return padding*4+(padding*1.75)/2 - 150;
        }
      })
      .text(d => d)
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("text-anchor", "middle");
  // draw color rect for transitions
  // svg.selectAll("#colorRect")
  //   .data(platforms)
  //   .enter()
  //   .append("rect")
  //     .attr("id", d => "rect_"+d.replace("+", ""))
  //     .attr("x", d => xScale(0))
  //     .attr("y", (d, i) => yScale(i))
  //     .attr("height", yScale.bandwidth())
  //     .attr("width", function(d, i) {
  //       return xScale(data[selectedGenre][d]) - xScale(0);
  //     })
  //     .style("fill", (d,i) => platformColor(i));
  // svg.selectAll("#textRect")
  //   .data(platforms)
  //   .enter()
  //   .append("rect")
  //     .attr("x", d => xScale(0))
  //     .attr("y", (d, i) => yScale(i))
  //     .attr("height", yScale.bandwidth())
  //     .attr("width", function(d, i) {
  //       return xScale(totalMovies[d]) - xScale(0);
  //     })
  //     .style("fill", "none")
  //     .style("stroke", "black")
  //     .style("stroke-width", 4);
  // // add platform names
  // svg.selectAll("#totalText")
  //   .data(platforms)
  //   .enter()
  //   .append("text")
  //     .attr("x", d => xScale(totalMovies[d]) + padding/2)
  //     .attr("y", (d, i) => yScale(i)+(padding*1.5)/2)
  //     .text(d => totalMovies[d])
  //     .style("font-weight", "bold")
  //     .style("font-size", "20px");
  // svg.selectAll("#textTitle")
  //   .data(platforms)
  //   .enter()
  //   .append("text")
  //     .attr("id", d => "totalText_" + d)
  //     .attr("x", d => xScale(0))
  //     .attr("y", (d, i) => yScale(i) + padding*2)
  //     .text(d => d + ": " + data[selectedGenre][d] + " movies")
  //     .style("font-weight", "bold")
  //     .style("font-size", "20px");
  //
  // // add filter buttons
  // svg.selectAll("#buttons")
  //   .data(topGenres)
  //   .enter()
  //   .append("rect")
  //   .attr("class", "filterButton")
  //   .attr("x", (d, i) => (barAttr.width/4)*(Math.trunc((i)/2))+padding*2)
  //   .attr("y", function (d,i) {
  //     if (i % 2 == 0) {
  //       return padding*2;
  //     } else {
  //       return padding*4;
  //     }
  //   })
  //   .attr("height", padding*1.5)
  //   .attr("width", padding*6)
  //   .style("fill", (d, i) => i == 0 ? "#a6a4a4" : "#dadada")
  //   .style("stroke", (d, i) => i==0 ? "black" : "none")
  //   .style("stroke-width", (d, i) => i==0 ? "3px" : "0px")
  //   .style("cursor", "pointer")
  //   .style("rx", 5)
  //   .on("click", function(d) {
  //     // transition colored rect
  //     for (var p of platforms) {
  //       d3.select("#rect_"+p.replace("+", ""))
  //         .transition()
  //         .duration(500)
  //         .attr("width", xScale(data[d][p]) - xScale(0));
  //
  //       // change total text
  //       d3.select("#totalText_" + p.replace("+", ""))
  //         .transition()
  //         .duration(200)
  //         .text(p + ": " + data[d][p.replace("+", "")] + " movies");
  //     }
  //
  //     // change color of filter button
  //     d3.selectAll(".filterButton")
  //       .style("fill", "#dadada")
  //       .style("stroke", "none");
  //     d3.select(this)
  //       .transition()
  //       .duration(300)
  //       .style("fill", "#A6A4A4")
  //       .style("stroke", "black")
  //       .style("stroke-width", "3px");
  //   });
  // // add filter button labels
  // svg.selectAll("#buttonText")
  //   .data(topGenres)
  //   .enter()
  //   .append("text")
  //     .attr("x", (d, i) => (barAttr.width/4)*(Math.trunc((i)/2))+padding*5)
  //     .attr("y", function (d,i) {
  //       if (i % 2 == 0) {
  //         return padding*2+(padding*1.75)/2;
  //       } else {
  //         return padding*4+(padding*1.75)/2;
  //       }
  //     })
  //     .text(d => d)
  //     .style("font-size", "16px")
  //     .style("font-weight", "bold")
  //     .style("text-anchor", "middle");
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
