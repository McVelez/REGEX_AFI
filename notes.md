Si la profe quiere lo s pasos, solo hay que renderizar cuando se llame una operacion en Graph

let pos_star = parseInt(dict[offset])+1;
    // si es terminal 
    if( terminales.includes(regex[0])){
        /* otro if dentro que v[erifique que antes no venia otro caracter concat_expression*/
        let temp2 = new Graph([regex[0]]);
        temp2.concat_symbols(); // o --0--> o
        if(was_char){
            temp.concat_expressions(temp2);
            temp2 = temp;
        }
        if (regex.substring(1) != ''){
            if (regex[1] == '(' && isNaN(pos_star)){
                console.log('1',  regex.substring(1), offset+1)
                temp = temp2.concat_expressions(recursiva( regex.substring(1), offset+1, true, temp2 ));
            }
            else{
                console.log('2',  regex.substring(1), offset+1)
                temp = recursiva( regex.substring(1), offset+1, true, temp2 );
            }
        }
        else{
            temp = temp2
        }
    } 
    else if (regex[0] == 'U'){
        temp = temp.union( recursiva(regex.substring(1), offset+1, false, temp ));
    }
    else if (regex[0] == '(' ){
        if(pos_star - offset <= regex.length){
            pos_star = parseInt(dict[offset])+1;
            //console.log('dentro',dict, offset)
            if(regex[pos_star - offset] == "*"){
                //console.log('estrella', regex.substring(1, pos_star-offset-1))
                console.log('3',  regex.substring(1,  pos_star-offset-1), offset+1)
                let temp3 = recursiva( regex.substring(1, pos_star-offset-1), offset+1, false, temp);
                temp3.star();
                if (''!=regex.substring(pos_star-offset+1)){
                    
                    if ((terminales.includes(regex.substring(pos_star-offset+1)[0]) ) && (pos_star - offset <= regex.length && regex[pos_star - offset] == "*") ) {
                        console.log('4',regex.substring(pos_star-offset+1), offset)
                        temp = temp3.concat_expressions(recursiva( regex.substring(pos_star-offset+1), offset-1 , false, temp3))
                    }
                    else{
                        console.log('5',  regex.substring(pos_star-offset+1), offset)
                        temp = recursiva( regex.substring(pos_star-offset+1), offset-1 , false, temp3);
                    }
                }
                else{
                    temp = temp3;
                }
            }
            else{
                temp = recursiva(regex.substring(1, pos_star), offset+1, false, temp);
                temp = recursiva(regex.substring(pos_star-offset),offset, true,temp)
            }
        }
    }


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