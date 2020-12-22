function drawDoughnutVis(svgClass, topGenres, platforms, top20_genres) {
  let width = 250;
  let height = 250;
  let margin = 10;
  let visHeight = 700;
  let visWidth = 1000;

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
              // .append("svg")
              // .attr("width", 1000)
              // .attr("height", 1000)
              .append("g")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  let selectedGenre = "Drama";

  // console.log("initial:")
  // console.log(selectedGenre);

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

  let netflixColor = d3.scaleOrdinal()
                        .domain(['Netflix', 'Netflix_Remainder'])
                        .range(['#ED535B', '#FFFFFF']);
  let huluColor = d3.scaleOrdinal()
                        .domain(['Hulu', 'Hulu_Remainder'])
                        .range(['#60EEA8', '#FFFFFF']);
  let disneyColor = d3.scaleOrdinal()
                        .domain(['Disney+', 'Disney+_Remainder'])
                        .range(['#9e9e9e', '#FFFFFF']);
  let primeColor = d3.scaleOrdinal()
                        .domain(['Prime', 'Prime_Remainder'])
                        .range(['#4DC2EA', '#FFFFFF']);

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

  // console.log(topGenres)
  // filter buttons
  svg.selectAll("#buttons")
    .data(topGenres)
    .enter()
    .append("rect")
    .attr("class", "filterButton2")
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
    .style("fill", (d, i) => i == 0 ? "#d3d3d3" : "#ffffff")
    .style("stroke", "black")
    .style("stroke-width", "3px")
    .style("cursor", "pointer")
    .style("rx", 5)
    .on("click", function(d) {
      // set the selected genre to be what's clicked
      selectedGenre = d;
      // console.log("new:")
      // console.log(selectedGenre);

      svg.selectAll(".topGenreTag").remove();

      // clear the previously drawn doughnuts
      svg.selectAll('#colorPie').remove();
      svg.selectAll('.percentText').remove();
      svg.selectAll('.captionText').remove();
      svg.selectAll('.metadata').remove();

      draw();

      // change color of filter button
      d3.selectAll(".filterButton2")
        .style("fill", "#ffffff")
        .style("stroke", "black")
        .style("stroke-width", "3px");
      d3.select(this)
        .transition()
        .duration(300)
        .style("fill", "#d3d3d3")
        .style("stroke", "black")
        .style("stroke-width", "3px");
    })

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

  // drawing proportions of each doughnut for given genre
  function draw() {
  for (i in data_ready) {
    if (i == selectedGenre) {
      for (j in data_ready[selectedGenre]) {
        if (data_ready[i][j][0].data.key == "Netflix") {
            // draw prop of doughnut
            svg.selectAll('#colorPie')
               .data(data_ready[i][j])
               .enter()
               .append('path')
               .attr("class", "netflix_donut")
               .attr("class", "donut")
               .attr('d', d3.arc()
                  .innerRadius(innerRadius)
                  .outerRadius(radius)
               )
               .attr("transform", "translate(" + 0 + "," + 200 + ")")
               .attr('fill', function(d) {
                 return(netflixColor(d.data.key))
               })
               .attr("stroke", "black")
               .attr("stroke-width", "3px")
               .style("opacity", 1)

           svg.selectAll('#percentText')
              .data(data_ready[i][j])
              .enter()
              .append('text')
              .attr("class", "netflix_donut")
              .attr("class", "donut")
                .attr("x", -25)
                .attr("y", 10 + 200)
                .text(Math.round((data_ready[i][j][0].data.value /
                  totalMovies["Netflix"] * 100)).toString() + "%")
                .attr("class", "percentText")
                .style("font-weight", "bold")
                .style("font-size", "24px")
                .style("text-align", "center")

           svg.selectAll('#captionText')
              .data(data_ready[i][j])
              .enter()
              .append('text')
              .attr("class", "netflix_donut")
              .attr("class", "donut")
                .attr("x", -40) // manually adjusted centering
                .attr("y", 160 + 200)
                .text("Netflix")
                .attr("class", "captionText")
                .style("font-weight", "bold")
                .style("font-size", "24px")
                .style("text-align", "center")

           svg.selectAll('#metadata')
              .data(data_ready[i][j])
              .enter()
              .append('text')
              .attr("class", "netflix_donut")
              .attr("class", "donut")
                .attr("x", -80) // manually adjusted centering
                .attr("y", 200 + 200)
                .text((data_ready[i][j][0].data.value).toString() + " of " + totalMovies["Netflix"] + " movies")
                .attr("class", "metadata")
                .style("font-weight", "regular")
                .style("font-size", "16")
                .style("text-align", "center")
                .style("opacity", 0.6)

                //text hover effect
                d3.selectAll(".netflix_hover")
                  .on('mouseover', function(){

                    console.log("hover");

                    // d3.selectAll("#colorPie")
                    //   .transition().duration(200)
                    //   .style("opacity", 0.1);

                    d3.selectAll(".netflix_donut")
                      .transition().duration(200)
                      .style("opacity", 0.1);
                  })
                  .on('mouseout', function(){
                    // d3.selectAll(".donut")
                    //   .transition().duration(200)
                    //   .style("opacity", 1);

                  });
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
             .attr("stroke-width", "3px")
             .style("opacity", 1)

           svg.selectAll('#percentText')
              .data(data_ready[i][j])
              .enter()
              .append('text')
                .attr("x", -25+250) // based on relative position of next circle
                .attr("y", 10 + 200)
                .text(Math.round((data_ready[i][j][0].data.value /
                  totalMovies["Hulu"] * 100)).toString() + "%")
                .attr("class", "percentText")
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
                 .attr("class", "captionText")
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
                  .attr("class", "metadata")
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
             .attr("stroke-width", "3px")
             .style("opacity", 1)

           svg.selectAll('#percentText')
              .data(data_ready[i][j])
              .enter()
              .append('text')
                .attr("x", -25+250+250) // based on relative position of next circle
                .attr("y", 10 + 200)
                .text(Math.round((data_ready[i][j][0].data.value /
                  totalMovies["Disney+"] * 100)).toString() + "%")
                .attr("class", "percentText")
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
                 .attr("class", "captionText")
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
                  .attr("class", "metadata")
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
             .attr("stroke-width", "3px")
             .style("opacity", 1)

           svg.selectAll('#percentText')
              .data(data_ready[i][j])
              .enter()
              .append('text')
                .attr("x", -25+250+250+250) // based on relative position of next circle
                .attr("y", 10 + 200)
                .text(Math.round((data_ready[i][j][0].data.value /
                  totalMovies["Prime"] * 100)).toString() + "%")
                .attr("class", "percentText")
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
                 .attr("class", "captionText")
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
                  .attr("class", "metadata")
                  .style("font-weight", "regular")
                  .style("font-size", "16")
                  .style("text-align", "center")
                  .style("opacity", 0.6)
        }
      }
    }
  }
  let topGenreTempLst = ["Netflix", "Hulu", "Disney+", "Prime"];
  let topGenrePieOrder = ["Netflix", "Disney+", "Hulu", "Prime"];
  let count = 0;
   for (var platform of topGenreTempLst) {
     let platformNum = data_ready[selectedGenre][count];
     let percentage = platformNum[0]["value"] / (platformNum[0]["value"] + platformNum[1]["value"]);
     let index = topGenrePieOrder.indexOf(platform);
     if (percentage > 0.42) {
       drawTopGenreTag(svg, visWidth/4 * (index) - 60);
     }
     count = count + 1;
   }
  }
  // initialize Drama
  draw();
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

function drawTopGenreTag(svg, x) {
  svg.append("rect")
    .attr("class", "topGenreTag")
    .attr("x", x)
    .attr("y", 430)
    .attr("width", 120)
    .attr("height", 50)
    .style("rx", 10)
    .style("fill", "#d3d3d3")
    .style("stroke", "black")
    .style("stroke-width", "3px");
  svg.append("text")
    .attr("class", "topGenreTag")
    .attr("x", x + 60)
    .attr("y", 430 + 25 + 5)
    .text("Top Genre")
    .style("text-anchor", "middle")
    .style("font-weight", "bold");
}
