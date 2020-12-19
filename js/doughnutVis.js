function drawDoughnutVis(svgClass, topGenres, platforms, top20_genres) {
  let width = 250;
  let height = 250;
  let margin = 10;

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
  console.log("huh")
  console.log(genreList);

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
  //
  console.log("TESTING AREA")
  for (j in data_ready["Drama"]) {
    console.log(data_ready["Drama"][j][0].data.key == "Netflix")
    if (data_ready["Drama"][j][0].data.key == "Netflix") {
        // console.log(data_ready["Drama"][j][0].data.key);
        console.log("success! just one time")
    }
  }

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
               .attr("transform", "translate(" + 0 + "," + 0 + ")")
               .attr('fill', function(d) {
                 return(netflixColor(d.data.key))
               })
               .attr("stroke", "black")
               .attr("stroke-width", "2px")
               .style("opacity", 0.7)
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
             .attr("transform", "translate(" + 250 + "," + 0 + ")")
             .attr('fill', function(d) {
               return(huluColor(d.data.key))
             })
             .attr("stroke", "black")
             .attr("stroke-width", "2px")
             .style("opacity", 0.7)
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
             .attr("transform", "translate(" + 500 + "," + 0 + ")")
             .attr('fill', function(d) {
               return(disneyColor(d.data.key))
             })
             .attr("stroke", "black")
             .attr("stroke-width", "2px")
             .style("opacity", 0.7)
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
             .attr("transform", "translate(" + 750 + "," + 0 + ")")
             .attr('fill', function(d) {
               return(primeColor(d.data.key))
             })
             .attr("stroke", "black")
             .attr("stroke-width", "2px")
             .style("opacity", 0.7)
        }
      }
    }
  }

  // for (i in data_ready) {
  //   if (i == selectedGenre) {
  //     // draw prop of doughnut
  //     svg.selectAll('#colorPie')
  //        .data(data_ready[selectedGenre])
  //        .enter()
  //        .append('path')
  //        .attr('d', d3.arc()
  //           .innerRadius(100)
  //           .outerRadius(radius)
  //        )
  //        .attr('fill', function(d) {
  //          for (j in data_ready[selectedGenre]) {
  //            if (data_ready[selectedGenre][j][0].data.key == "Netflix") {
  //              return(netflixColor(d[j].data.key))
  //            }
  //          }
  //        })
  //        .attr("stroke", "black")
  //        .attr("stroke-width", "2px")
  //        .style("opacity", 0.7)
  //   }
  // }

  // draw proportions of doughnut
  // svg.selectAll("#colorPie")
  //    // .data(data_ready)
  //    .data(data_ready["Drama"][0])
  //    .enter()
  //    .append('path')
  //    .attr('d', d3.arc()
  //       .innerRadius(100)
  //       .outerRadius(radius)
  //    )
  //    .attr('fill', function(d) {
  //      return(netflixColor(d.data.key))
  //      // for (i in data_ready) {
  //      //   if (i == selectedGenre) {
  //      //     for (j in data_ready[i]) {
  //      //       if (data_ready[i][j][0].data.key == "Netflix") {
  //      //         return(netflixColor(d[i][j].data.key))
  //      //       }
  //      //     }
  //      //   }
  //      // }
  //    })
  //    .attr("stroke", "black")
  //    .attr("stroke-width", "2px")
  //    .style("opacity", 0.7)




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
