function controls(graphOFICIAL) {
    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        node, edgepaths, edgelabels,
        link;

    svg.append('defs').append('marker')
        .attrs({'id':'arrowhead',
            'viewBox':'0 -5 10 10',
            'refX':15,
            'refY':0,
            'orient':'auto',
            'markerWidth':13,
            'markerHeight':13,
            'xoverflow':'visible'})
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .style('stroke','black');

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(100).strength(1))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    update(graphOFICIAL.links, graphOFICIAL.nodes)

    function update(links, nodes) {
        link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr('marker-end','url(#arrowhead)')

        link.append("title")
            .text(function (d) {return d.type;});

        edgepaths = svg.selectAll(".edgepath")
            .data(links)
            .enter()
            .append('path')
            .attrs({
                'class': 'edgepath',
                'fill-opacity': 0,
                'stroke-opacity': 0,
                'fill': '#010203',
                'stroke': "black",
                'stroke-width': 3,
                'id': function (d, i) {return 'edgepath' + i}
            })
            .style("pointer-events", "none");

        edgelabels = svg.selectAll(".edgelabel")
            .data(links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attrs({
                'class': 'edgelabel',
                'fill': '#010203',
                'stroke': 'black',
                'id': function (d, i) {return 'edgelabel' + i},
                'font-size': 10
                
            });

        edgelabels.append('textPath')
            .attr('xlink:href', function (d, i) {return '#edgepath' + i})
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(function (d) {return d.type});

        node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    //.on("end", dragended)
            );

        node.append("circle")
            .attr("r", 12)
            .style("fill", function (d, i) {return colors(i);})

        simulation
            .nodes(nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(links);
    }

    function ticked() {
        link
            .attr("x1", function (d) {return d.source.x;})
            .attr("y1", function (d) {return d.source.y;})
            .attr("x2", function (d) {return d.target.x;})
            .attr("y2", function (d) {return d.target.y;});

        node
            .attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});

        edgepaths.attr('d', function (d) {
            return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
        });

        edgelabels.attr('transform', function (d) {
            if (d.target.x < d.source.x) {
                var bbox = this.getBBox();

                rx = bbox.x + bbox.width / 2;
                ry = bbox.y + bbox.height / 2;
                return 'rotate(180 ' + rx + ' ' + ry + ')';
            }
            else {
                return 'rotate(0)';
            }
        });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.7).restart()
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
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
    // creo que el nombre lo dice, ademas no acepta parametros
    concat_symbols(){
        // definimos un indice que cuente los nodos agregados
        let index = 0
        // iteramos sobre el regex (se espera que sea una lista)
        this.regex.forEach( item => {
            // agregamos dos nodos para cada simbolo en el regex: nodo inicial y final en un regex de un solo simbolo
            // por el momento ignoren set y center
            this.nodes.push( {"name": taken_values.toString(), "id": taken_values, "set": 5, "center": 5} )
            this.nodes.push( {"name": (taken_values+1).toString(), "id": (taken_values+1), "set": 5, "center": 5} )
            // agregamos la arista entre los nodos
            this.links.push({"source": taken_values, "target": (taken_values+1), "type": item.toString()})
            // agregamos el valor del nodo actual como inicial si no se ha agregado uno en la instancia actual de Graph
            if (this.initial == null){
                this.initial = taken_values;
            } 
            // cuando queremos concatenar symbolos, se agrega la arista con epsilon como etqiueta entre el nodo final e inicial
            // de los simbolos 
            if (index > 0){
                // taken_values-1 hace refeencia al final, taken_values al inicial
                this.links.push({"source": (taken_values-1), "target": taken_values, "type": "ε"})
            }
            // agregamos dos nodos, por lo que index y taken values aumentan en 2
            index+=2
            taken_values +=2
        } )
        // al ser una concatenacion de simbolos, solo tenemos un nodo de aceptacion
        this.acceptance = [taken_values-1];
        // regresamos la instancia de Graph
        return this
    }
    // recibimos una expresion, la cual es una instancia de Graph
    concat_expressions(exp_b){
        // le agregamos a la instancia actual, los nodos y links de Graph recibido como parametro
        this.nodes = this.nodes.concat( exp_b.nodes )
        this.links = this.links.concat( exp_b.links )
        // definimos un temporal con los nodos de aceptacion sin alterar de la instacia actual
        let temp = this.acceptance;
        console.log("aceptacion:",temp, this.nodes.length, exp_b.nodes.length)
        // iteramos sobre los nodos de aceptacion actuales
        temp.forEach( node => {
            // agregamos una arista entre el estado de aceptacion y el nodo inicial de exp_b
            this.links.push( {"source": node, "target": exp_b.initial, "type": "ε" } )
        } )
        // los estados de aceptacion se vuelven los de b, ya que los anteriores ahora apuntan hacia
        // el incial de b
        this.acceptance = exp_b.acceptance;
        return this
    }
    // recibimos una instancia de Graph
    union(graph_b){
        // agregamos el nuevo nodo inicial
        this.nodes.push( {"name": (taken_values).toString(), "id":taken_values, "set": 5, "center": 5} )
        // concatenamos los nodos y links de ambas instancias de Graph
        this.nodes = this.nodes.concat(graph_b.nodes)
        this.links = this.links.concat(graph_b.links)
        // agregamos los links entre el nuevo nodo inicial y los estados iniciales de la instancia
        // actual y la recibida como parametro
        this.links.push( {"source": taken_values, "target": this.initial,  "type": "ε"} )
        this.links.push( {"source": taken_values, "target": graph_b.initial,  "type": "ε"} )
        // el nuevo estado inicial es el nodo agregado
        this.initial = taken_values
        // los estados de aceptacion son la union de los estados de aceptacion de la instancia actual y graph_b
        this.acceptance = this.acceptance.concat( graph_b.acceptance )
        // solo agregamos un nodo nuevo
        taken_values += 1
        return this
    }
    // operacion unaria
    star(){
        // agregamos un nuevo nodo inicial
        this.nodes.push( {"name": taken_values.toString(), "id":taken_values, "set": 5, "center": 5} );
        // agregamos el nuevo nodo inicial a los estados de aceptacion
        this.acceptance.push(taken_values);
        // para cada estado de aceptacion, agregamos una arista entre si y el estado inicial anterior
        this.acceptance.forEach( node => {
            this.links.push( {"source": node, "target": this.initial,  "type": "ε"} )
        } )
        // el nuevo estado inicial es el nodo agregado
        this.initial = taken_values;
        taken_values +=1;
    }
}

function idk(cosa){

}


// NO FUNCIONA
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
// creo que tendremos que hacer una especie de arbol de sintaxis para poder descomponer el regex y convertitlo en objetos 
// pero idk


// NO FUNCIONA 

// SPLITTER PSEUDO CODE
// ((1)*00((01)U(1)*)U(01U011(1U0)*U01))U1
// (01 U 011 (1 U 0)*) U 01
// yea we might need a syntax tree
//

function regex_splitter(regex){
    return regex.split()
}

function parentheses_matcher(regex){
    let matches = [];
    let open = finder(regex, '(');
    let closed = finder(regex, ')');
    let parentheses = regex.match(/(\(|\))/gmi);
    let last_seen = null, current_closed = 0;
    // function to get the parentheses order(agrupation)
    parentheses.forEach( par => {
        if (par == '('){
            if (last_seen == null){
                last_seen = 0
            }
            else {
                // agrega al contador cada vez que vea un (
                last_seen += 1;
            }
        }
        else {
            // si ve un ), entonces agregar el scope de los parentesis actuales
            matches.push( [open[last_seen], closed[current_closed]] );
            // eliinamos el indice del parentesis abiertto ya tomado
            open.splice(last_seen, 1)
            // recorremos en 1 para parentesis cerrados
            current_closed += 1;
            // vamos para atras 1 en parentesis abiertos
            last_seen -= 1;
        }
    })
    return matches
}

//0U((01 U 011 (1 U 0)*) U 01)
function regex_splitter_(regex){
    let cuack = parentheses_matcher(regex)
    
}

var taken_values = 0 

let btn_submit = document.getElementById("btn")
btn_submit.addEventListener("click", () => {
    let regex = document.getElementById("regex").value;
    //regex_splitter(regex)
    regex = regex.replace(' ', '')
    regex_splitter_(regex)

// DO NOT ERASE
// first of all, check for the different individual graphs that can be created
    /*let g1 = new Graph(regex_splitter("01"))
    g1 = g1.concat_symbols()
    let g2 = new Graph(regex_splitter("1"))
    g2 = g2.concat_symbols()
    g1 = g1.union(g2)
    let g3 = new Graph(regex_splitter("0"))
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