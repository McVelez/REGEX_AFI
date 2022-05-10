function controls(graph){
    var svg = d3.select("svg");
    var width = +svg.attr("width");
    var height = +svg.attr("height");
  
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  console.log(color)
  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.name; }))
      .force("charge", d3.forceManyBody()
          .strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2));
  
    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
    console.log(graph.nodes)
    
    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("cx", function (d) { return d.cx; })
        .attr("cy", function (d) { return d.cy; })
        .attr("r", 15)
        .attr("fill", function(d) { return color(d.set); })
        .call(d3.drag()
            .on("start", (d) => { dragstarted(d, simulation) })
            .on("drag", dragged)
            .on("end", (d) => { dragended(d, simulation) }));
  
  var label = svg.selectAll(".mytext")
      .data(graph.nodes)
      .enter()
      .append("text")
      .text(function (d) { return d.name; })
      .style("text-anchor", "middle")
      .style("fill", "#555")
      .style("font-family", "Arial")
      .style("font-size", 10);
  
    simulation
        .nodes(graph.nodes)
        .on("tick", () => {
            ticked(link, node, label)
        });
    
    simulation.force("link")
        .links(graph.links);
    
    svg.append("svg:defs").selectAll("marker")
        .data(["end"])
        .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 18)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");
}

  
  function ticked(link, node, label) {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; })
          .attr("marker-end", "url(#end)");
  
      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
  
      label
          .attr("x", function(d){ return d.x; })
          .attr("y", function (d) {return d.y - 10; });
  }
  
  function dragstarted(d, simulation) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d, simulation) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

class Graph{
    constructor(REGEX){
        this.nodes = [];
        this.links = [];
        this.acceptance = [];
        this.initial = null;
        this.stack = [];
        this.regex = REGEX;
    }

    concat_symbols(){
        let index = 0
        this.regex.forEach( item => {
            this.nodes.push( {"name": taken_values, "id": taken_values, "set": 5, "center": 5} )
            this.nodes.push( {"name": taken_values+1, "id": (taken_values+1), "set": 5, "center": 5} )
            this.links.push({"source": taken_values, "target": (taken_values+1), "value": item.toString()})
            if (this.initial == null){
                this.initial = taken_values;
            } 
            if (index > 0){
                this.links.push({"source": (taken_values-1), "target": taken_values, "value": "ε"})
            }
            index+=2
            taken_values +=2
        } )
        this.acceptance = [taken_values-1];
        return this
    }

    concat_expressions(exp_b){
        this.nodes = this.nodes.concat( exp_b.nodes )
        this.links = this.links.concat( exp_b.links )
        let temp = this.acceptance;
        console.log("aceptacion:",temp, this.nodes.length, exp_b.nodes.length)
        temp.forEach( node => {
            this.links.push( {"source": node, "target": exp_b.initial, "value": "ε" } )
        } )
        this.acceptance = exp_b.acceptance;
        return this
    }

    union(graph_b){
        this.nodes.push( {"name": taken_values, "id":taken_values, "set": 5, "center": 5} )
        this.nodes = this.nodes.concat(graph_b.nodes)
        this.links = this.links.concat(graph_b.links)
        this.links.push( {"source": taken_values, "target": this.initial,  "value": "ε"} )
        this.links.push( {"source": taken_values, "target": graph_b.initial,  "value": "ε"} )
        this.initial = taken_values
        this.acceptance = this.acceptance.concat( graph_b.acceptance )
        taken_values += 1
        return this
    }

    star(){
        // add new initial node
        this.nodes.push( {"name": taken_values, "id":taken_values, "set": 5, "center": 5} );
        this.acceptance.push(taken_values);
        this.acceptance.forEach( node => {
            this.links.push( {"source": node, "target": this.initial,  "value": "ε"} )
        } )
        this.initial = taken_values;
        taken_values +=1;
    }
}


// check for correspondence between parentheses
// 
function idk(cosa){

}

let e = 'dedede'
function finder(regex, symbol){
    let occurences = [], count = 0;
    let position = regex.indexOf(symbol)
    while (position !== -1) {
        count++
        occurences.push(position)
        position = regex.indexOf(symbol, position + 1)
    }
    return occurences
}

function regex_splitter(regex){
    let cuack = [];
    //let reg = regex.split(/(\(|\))/gmi);
    let open = finder(regex, '(');
    let closed = finder(regex, ')');
    let e = regex.match(/(\(|\))/gmi);
    let indices = [], index = 0;
    let l = []
 
    console.log(e)
    //((1)*00((01)U(1)*)U(01U011(1U0)*U01))U1
        /*for (let index = 0; index < a.length; index++) {
        let temp = a[index].split(')')
        if (temp.length == 1){
            u.push(a[index])
        }        
        else {
            u = u.concat(temp)
        }
    }
    console.log(u) */
}

var taken_values = 0 

let btn_submit = document.getElementById("btn")
btn_submit.addEventListener("click", () => {
    let regex = document.getElementById("regex").value;
    regex_splitter(regex)
    /*
// first of all, check for the different individual graphs that can be created
    let g1 = new Graph(regex_splitter("01"))
    g1 = g1.concat_symbols()
    let g2 = new Graph(regex_splitter("1"))
    g2 = g2.concat_symbols()
    g1 = g1.union(g2)
    /*let g3 = new Graph(regex_splitter("0"))
    g3 = g3.concat_symbols()
    g1 = g1.concat_expressions(g3)
    g1.star()
    g1.nodes.forEach( node => {
        if (g1.acceptance.includes(node.id)){
            node.set = 0
        }
    } )
    let graph = {
        "nodes":g1.nodes,
        "links": g1.links
    }
    console.log(graph)
    controls(graph) */
    
})