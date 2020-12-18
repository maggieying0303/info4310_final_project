// constants used in this visualization
let platformMinPrice = {
  "Netflix": 8.99,
  "Hulu": 5.99,
  "Prime": 8.99,
  "Disney+": 6.99
};
let platformDetailPrice = {
  "Netflix": {
    "Basic": 8.99,
    "Standard": 13.99,
    "Premium": 17.99
  },
  "Hulu": {
    "Basic": 5.99,
    "Standard": 11.99,
    "BasicTV": 54.99,
    "StandardTV": 60.99
  },
  "Prime": {
    "Basic": 8.99,
    "Standard": 12.99
  },
  "Disney+": {
    "Standard": 6.99,
    "Bundle": 12.99
  }
};

let isFilterWatchParty = false;
let isFilterAddOn = false;
let isFilterPayToWatch = false;

// list of streaming platform that does not have requirement
let filterButtonMap = {
  "watch party": ["Netflix"],
  "add ons": ["Netflix", "Disney+"],
  "pay to watch": ["Netflix", "Hulu"]
}

let sliderUserPrice = 0;

function drawSliderVis(svgClass) {
  let padding = 25;
  let sliderAttr = {
    "width": 1000,
    "height": 700
  };
  let platforms = ["Netflix", "Hulu", "Prime", "Disney+"];

  let shortToLongNames = {
    "Hulu_Basic": "Basic",
    "Hulu_Standard": "Standard",
    "Hulu_BasicTV": "Basic + Live TV",
    "Hulu_StandardTV": "Standard + Live TV",
    "Prime_Basic": "Prime Video",
    "Prime_Standard": "Prime Membership"
  }

  // hulu has add ons and support for watch parties
  // amazon also have add ons for HBO, CINEMAX, SHOWTIME, STARZ, AND watch party
  // disney supports group watch
  let platformDetailText = {
    "Netflix_Basic": ["SD resolution", "Supports one screen"],
    "Netflix_Standard": ["HD resolution", "Supports two screens"],
    "Netflix_Premium": ["4k HD resolution", "Supports four screens"],
    "Hulu_Basic": ["HD resolution", "Includes ads", "Supports two screens"],
    "Hulu_Standard": ["Basic Hulu plan", "Includes no ads"],
    "Hulu_BasicTV": ["Basic Hulu plan with live TV", "Supports unlimited screens"],
    "Hulu_StandardTV": ["Basic Hulu plan with live TV", "Includes no ads"],
    "Prime_Basic": ["4k HD resolution", "Supports three screens"],
    "Prime_Standard": ["Prime Video Plan", "Includes other Prime benefits"],
    "Disney_Standard": ["4k HD resolution", "Supports four screens"],
    "Disney_Bundle": ["Standard plan with ESPN+ and Hulu"]
  }

  let svg = d3.select(svgClass);

  // inspiration from https://bl.ocks.org/mbostock/6499018
  let budgetScale = d3.scaleLinear()
    .domain([0, 61])
    .range([padding*4, sliderAttr.width-padding*12])
    .clamp(true);

  let slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + padding*10 + "," + sliderAttr.height/5 + ")");
  slider.append("line")
      .attr("class", "track")
      .attr("x1", budgetScale.range()[0])
      .attr("x2", budgetScale.range()[1])
      .attr("transform", "translate(" + 0 + "," + padding/2 + ")") // padding for middle of handle
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-overlay")
      .call(d3.drag()
          .on("start.interrupt", function() { slider.interrupt(); })
          .on("start drag", function() {
            sliderUserPrice = budgetScale.invert(d3.event.x)
            handleDrag(sliderUserPrice);
          }));
    // for x axis text label
    slider.insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(" + padding*4 + "," + -1*padding + ")")
    // add ticket stub handle
    var handle = slider.insert("image", ".track-overlay")
      .attr("class", "handle")
      .attr("xlink:href", "ticket_stub.svg")
      .attr("width", padding*2)
      .attr("height", padding)
      .attr("transform", "translate(" + padding*3 + "," + 0 + ")");

    // add filter buttons after slider
    addFilterButton(svg, padding*4, sliderAttr.height/4 + 30, "supports watch parties", "watch party");
    addFilterButton(svg, sliderAttr.width/2 - padding*5, sliderAttr.height/4 + 30, "supports add-ons", "add ons")
    addFilterButton(svg, sliderAttr.width/2 + padding*4, sliderAttr.height/4 + 30, "includes pay-to-watch content", "pay to watch")

    function handleDrag(userPrice) {
      handle.attr("x", budgetScale(userPrice)-padding*4);

      // show price tooltip on slider handle
      d3.select(".priceText").remove();
      slider.insert("text", ".track-overlay")
        .attr("class", "priceText")
        .attr("x", budgetScale(userPrice))
        .attr("y", -1*padding)
        .text("$" + userPrice.toFixed(2))
        .style("text-anchor", "middle");

      // change opacity of text based on user selected price
      d3.selectAll(".platformText")
        .style("opacity", function(d) {
          return handleFiltering(userPrice, d);
        });
    }

    // add budget title
    svg.append("text")
      .text("Your monthly budget:")
      .attr("x", padding)
      .attr("y", sliderAttr.height/5 + 20)
      .style("font-size", "25px")
      .style("font-weight", "bold");

    // add titles for platforms
    svg.selectAll(".platformText")
      .data(platforms)
      .enter()
      .append("text")
        .attr("class", "platformText")
        .attr("id", function(d) { return d.replace("+", "") + "_text";})
        .attr("x", function(d, i) {
          return sliderAttr.width/4 * (i) + padding/2;
        })
        .attr("y", sliderAttr.height*0.45)
        .text(function(d) {return d;})
        .style("text-anchor", "start")
        .style("font-weight", "bold")
        .style("opacity", 0.3)
        .style("font-size", "32px");

    // add platform details
    var count = 0;
    for (var p of platforms) {
      var yCount = 45;
      for (var detail of Object.keys(platformDetailPrice[p])) {
        let tempName = p.replace("+", "") + "_" + detail;
        // add streaming plan name
        svg.append("text")
          .attr("class", p.replace("+", "") + "_platformTextDetails")
          .attr("id", function() { return p.replace("+", "") + "_" + detail + "_text";})
          .attr("x", function() {
            return sliderAttr.width/4 * (count) + padding/2;
          })
          .attr("y", sliderAttr.height*0.45 + yCount)
          .text(function() {
            return (tempName in shortToLongNames ? shortToLongNames[tempName] : detail);
          })
          .style("text-anchor", "start")
          .style("font-weight", "bold")
          .style("opacity", 0.3)
          .style("font-size", "14px");

        // add plan price
        svg.append("text")
          .attr("class", p.replace("+", "") + "_platformTextDetails")
          .attr("id", function() { return p.replace("+", "") + "_" + detail + "_text";})
          .attr("x", function() {
            return sliderAttr.width/4 * (count+1) - padding*1.25;
          })
          .attr("y", sliderAttr.height*0.45 + yCount)
          .text(platformDetailPrice[p][detail])
          .style("text-anchor", "end")
          .style("font-weight", "bold")
          .style("opacity", 0.3)
          .style("font-size", "14px");

        // add plan detail text
        svg.selectAll(".random")
          .data(platformDetailText[tempName])
          .enter()
          .append("text")
            .attr("class", p.replace("+", "") + "_platformTextDetails")
            .attr("id", function() { return p.replace("+", "") + "_" + detail + "_text";})
            .attr("x", function() {
              return sliderAttr.width/4 * (count) + padding/2;
            })
            .attr("y", function(d,i) {
              return sliderAttr.height*0.45 + yCount + 15*(i+1);
            })
            .text(function(d) {
              return d;
            })
            .style("text-anchor", "start")
            .style("opacity", 0.3)
            .style("font-size", "12px");
        yCount = yCount +80;
      }
      count = count+1;
    }
}

function addFilterButton(svg, x, y, text, filterMapKey) {
  let boxLength = 20;
  svg.append("rect")
    .attr("x", x)
    .attr("y", y)
    .attr("width", boxLength)
    .attr("height", boxLength)
    .attr("rx", 4)
    .attr("ry", 4)
    .style("stroke", "black")
    .style("stroke-width", 3)
    .style("fill", "white")
    .on("mouseover", function() {
      d3.select(this).style("cursor", "pointer");
    })
    .on("click", function() {
      // toggle color of filter buttons
      let currentColor = d3.select(this).style("fill");
      if (currentColor == "white" || currentColor == "rgb(255, 255, 255)") {
        d3.select(this)
          .transition()
          .duration(400)
          .style("fill", "#a6a4a4");
      } else {
        d3.select(this)
          .transition()
          .duration(400)
          .style("fill", "white");
      }

      // handle filtering
      isFilterWatchParty = (filterMapKey == "watch party") ? !isFilterWatchParty : isFilterWatchParty;
      isFilterAddOn = (filterMapKey == "add ons") ? !isFilterAddOn : isFilterAddOn;
      isFilterPayToWatch = (filterMapKey == "pay to watch") ? !isFilterPayToWatch : isFilterPayToWatch;

      // change opacity of text based on user selected price
      d3.selectAll(".platformText")
        .style("opacity", function(d) {
          return handleFiltering(sliderUserPrice, d);
        });

    });
  svg.append("text")
    .attr("x", x + 25 + boxLength/2)
    .attr("y", y + boxLength/2)
    .text(text)
    .style("alignment-baseline", "middle");
}

// d is the platform name
function handleFiltering(userPrice, d) {
  // build list of platforms that do not qualify for reqs
  let banList = [];

  banList = !isFilterWatchParty ? banList : banList.concat(filterButtonMap["watch party"]);
  banList = !isFilterAddOn ? banList : banList.concat(filterButtonMap["add ons"]);
  banList = !isFilterPayToWatch ? banList : banList.concat(filterButtonMap["pay to watch"]);

  let banSet = new Set(banList);
  if (platformMinPrice[d] < userPrice && !banSet.has(d)) {
    for (var plan in platformDetailPrice[d]) {
      if (platformDetailPrice[d][plan] < userPrice) {
        d3.selectAll("#" + d.replace("+", "") + "_" + plan + "_text")
          .style("opacity", 1);
      } else {
        d3.selectAll("#" + d.replace("+", "") + "_" + plan + "_text")
          .style("opacity", 0.3);
      }
    }
    return 1;
  } else {
    d3.selectAll("." + d.replace("+", "") + "_platformTextDetails")
      .style("opacity", 0.3);
    return 0.3;
  }
}
