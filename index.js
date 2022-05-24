function controls(graphOFICIAL) {
    var colors = d3.scaleOrdinal(d3.schemeCategory10);
    console.log(graphOFICIAL)
    var svg = d3.select("svg").call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform)
        })).append('g'),
        width = +svg.attr("width")+900,  
        height = +svg.attr("height")+400,
        node, edgepaths, edgelabels,
        link;
    //svg.html(null)
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
        .attr('d', 'M 0,-5 L 10 , 0 L 0,5')
        .style('stroke','black')
        
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
            .text(function (d) {return d.id;});

        edgepaths = svg.selectAll(".edgepath")
            .data(links)
            .enter()
            .append('path')
            .attrs({
                'class': 'edgepath',
                'fill-opacity': 1,
                'stroke-opacity': 1,
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
                'font-size': 25
                
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
            .style("fill", function (d, i) { return colors(d.set);})

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

let all = [];

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
        all.push(Object.assign(Object.create(Object.getPrototypeOf(this)), this))
        return this
    }
    // recibimos una expresion, la cual es una instancia de Graph
    concat_expressions(exp_b){
        // le agregamos a la instancia actual, los nodos y links de Graph recibido como parametro
        this.nodes = this.nodes.concat( exp_b.nodes )
        this.links = this.links.concat( exp_b.links )
        // definimos un temporal con los nodos de aceptacion sin alterar de la instacia actual
        let temp = this.acceptance;
        //console.log("aceptacion:",temp, this.nodes.length, exp_b.nodes.length)
        // iteramos sobre los nodos de aceptacion actuales
        temp.forEach( node => {
            // agregamos una arista entre el estado de aceptacion y el nodo inicial de exp_b
            this.links.push( {"source": node, "target": exp_b.initial, "type": "ε" } )
        } )
        // los estados de aceptacion se vuelven los de b, ya que los anteriores ahora apuntan hacia
        // el incial de b
        this.acceptance = exp_b.acceptance;
        all.push(Object.assign(Object.create(Object.getPrototypeOf(this)), this))
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
        all.push(Object.assign(Object.create(Object.getPrototypeOf(this)), this))
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
        all.push(Object.assign(Object.create(Object.getPrototypeOf(this)), this))
    }
}

function prepare_graph(regex){
    let cosa = recursiva(regex, 0);
    cosa.nodes.forEach( node => {
        if (cosa.initial == node.id && cosa.acceptance.includes(node.id)){
            node.set = 10
        }
        else if (cosa.acceptance.includes(node.id)){
            node.set = 0 // verde
        }
        else if (cosa.initial == node.id){
            console.log(node)
            node.set = 2; // azul
        }
    })
    let graph = {
        "nodes":cosa.nodes,
        "links": cosa.links
    }
    //console.log(cosa)
    return graph
}

var taken_values = 0 
let btn_submit = document.getElementById("btn");
let dict = null;
btn_submit.addEventListener("click", () => {
    d3.selectAll("svg > *").remove();
    let regex = document.getElementById("regex").value;
    regex = regex.replace(' ', '');

    let dictTemp = findParenthesisPairs(regex);
    dict = dictTemp;
    controls(prepare_graph(regex));
    console.log(all) 
})

const terminales = ["0","1","2","3","4","5","6","7","8","9", 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', "ñ", 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
let my_graph = null;
let offset = 0;

function findParenthesisPairs(regex){
    let stack = [];
    let dict = {};
    for (const pos in regex) {
        const element = regex[pos]; // Caracter individual del regex
        if(element == '('){ stack.push(pos); } // Se agrega al stack el indice del parentesis cuando se encuentre (
        if(element == ')'){ dict[stack.pop()] = pos; } // Se quita del stack cuando se encuentre un ) y se agrega el indice correspondiente a su parentesis par
    }
    return dict;
}

function terminal(regex, offset, temp=null){
    let temp2 = new Graph([regex[0]]);
    temp2.concat_symbols(); // o --0--> o
    console.log('regex', regex.substring(1))
    if ( regex.substring(1)!='' && regex.substring(1)!=')'){
        if (regex[1] == '(' || terminales.includes(regex[1])){
            temp = temp2.concat_expressions(recursiva( regex.substring(1), offset+1, temp2 ));
        }
        else if (regex[1] == 'U'){
            temp = temp2.union(recursiva( regex.substring(2), offset+2, temp2 ));
        }
        else{ 
            temp = recursiva( regex.substring(1), offset+1, temp2 ); 
        }
    }
    else{
        temp = temp2
    }
    return temp
}

function has_parenthesis(regex, offset, temp){
    let pos_star = parseInt(dict[offset])+1;
    //console.log(pos_star, offset, regex)
    if (pos_star - offset <= regex.length){
        if(regex[pos_star - offset] == "*"){
            let temp3 = recursiva( regex.substring(1, pos_star-offset-1), offset+1, temp);
            temp3.star();
            let newRegex = regex.substring(pos_star-offset+1);
            if (terminales.includes(newRegex[0]) || newRegex[0] == '('){
                temp = temp3.concat_expressions(recursiva(newRegex, pos_star+1, temp3))
            }
            else if (newRegex[0] == 'U'){
                //console.log(newRegex.substring(1), pos_star+1)
                temp = temp3.union(recursiva(newRegex.substring(1), pos_star+2, temp3))
            }
            else { 
                temp = recursiva( regex.substring(pos_star-offset+1), pos_star+1, temp3);
            }
        }
        else{
            temp = recursiva(regex.substring(1, pos_star-1), pos_star+1, temp);
            console.log(regex, offset, pos_star)
            if (regex.substring(pos_star-offset)!=''  && regex.substring(pos_star-offset)!=')'){
                if (regex.substring(pos_star-offset)[0] == '('|| terminales.includes(regex.substring(pos_star-offset)[0]) ){
                    temp = temp.concat_expressions(recursiva(regex.substring(pos_star+1),pos_star+1,temp))
                }
                else if (regex.substring(pos_star-offset)[0]=='U'){
                    temp = temp.union(recursiva(regex.substring(pos_star-offset+1),pos_star+1,temp))
                }
                else{
                    temp = recursiva(regex.substring(pos_star+1),pos_star+1,temp)   
                }
            }
        }
    }
    return temp
}

function recursiva(regex, offset, temp=null){
    console.log(regex)
    if( terminales.includes(regex[0])){
        temp = terminal(regex, offset, temp);
    } 
    else if (regex[0] == 'U'){
        console.log('eee', temp)
        temp.union( recursiva(regex.substring(1), offset+1, temp ));
    }
    else if (regex[0] == '(' ){
        temp = has_parenthesis(regex, offset, temp);
    }
    return temp;
}


