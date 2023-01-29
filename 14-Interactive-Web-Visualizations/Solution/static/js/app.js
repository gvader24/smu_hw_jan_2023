var data = {};

d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function (inp_data) {
  console.log(inp_data);
  data = inp_data; // save to global variable

  makeDropdown();
  makeBar("940");
  makeMeta("940");
  makeBubbles("940");
});


function makeDropdown() {
  for (let i = 0; i < data.names.length; i++){
    let name = data.names[i];
    d3.select("#selDataset").append("option").text(name);
  }
}

function optionChanged(val) {
  makeBar(val);
  makeMeta(val);
  makeBubbles(val);
}

function makeBar(val) {
  let new_data = data.samples.filter(x => x.id === val)[0];

  let trace1 = {
    x: new_data.sample_values.slice(0, 10).reverse(),
    y: new_data.otu_ids.slice(0, 10).reverse().map(x => `OTU ID: ${x}`),
    name: 'Bacteria',
    type: 'bar',
    orientation: "h",
    hovertext: new_data.otu_labels
  };

  let traces = [trace1];

  let layout = {title: 'Bacteria Bar Chart', margin: {l: 100}};

  Plotly.newPlot('bar', traces, layout);
}


function makeMeta(val) {
  let new_data = data.metadata.filter(x => x.id == val)[0];
  console.log(new_data);
  d3.select("#sample-metadata").html("");
  Object.entries(new_data).forEach(function (key) {
    d3.select("#sample-metadata").append("h6").text(`${key[0]}: ${key[1]}`);
  });
}


function makeBubbles(val) {
  let new_data = data.samples.filter(x => x.id === val)[0];

  let trace1 = {
    x: new_data.otu_ids,
    y: new_data.sample_values,
    name: 'Bacteria',
    mode: 'markers',
    marker: {
      color: new_data.otu_ids,
      size: new_data.sample_values
    },
    hovertext: new_data.otu_labels
  };

  let traces = [trace1];

  let layout = {title: 'Bacteria Bubbles', xaxis: {title: 'OTU ID'}};

  Plotly.newPlot('bubble', traces, layout);
}
