// a.b.c#
// a*
// a * #
// Agregar nodo al arbol que tenga caracter, operacion y caracter a agregar

class Node {
    constructor(data)
    {
        this.left = null;
        this.data = data;
        this.right = null;
    }
}

class Tree {
    constructor()
    {
        this.root = null
    }

    insert(data){
        var newNode = new Node(data)
        if(this.root == null){
            this.root = newNode;
        }
        else
            this.insertNode(this.root, newNode)
            
    }

    insertNode(node, newNode) {
        if(node.left == null){
            node.left = newNode;
        }
        else
            this.insertNode(node.left, newNode);

        }
        

    }
}