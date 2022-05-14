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
        this.root = null;
    }

    insert(data){
        // En caso de que no haya raiz
        var newNode = new Node(data)
        console.log(data)
        if(this.root == null){
            this.root = newNode;
        }
        else{
            this.insertNode(this.root, newNode)
        }
            
    }

    insertNode(node, newNode) {
        // . -> .0
        if(node.right == null){
            node.right = newNode;
            return node.right
        }
        else if (node.right == null){
            node.left = newNode;
            return node.left   
        }
        else {
            console.log("X")
            var tempNode = node.left;
            node.left = new Node(".");
            node.left.right = tempNode;
        }
    }
    preorder() {
        preOrderHelper(this.root);
    }
}

function preOrderHelper(root) {
    if (root !== null) {
        preOrderHelper(root.left);
        console.log(root.data);
        preOrderHelper(root.right);
    }
 }

tree =  new Tree()
tree.insert('.')
tree.insert('0')
tree.insert('1')
// cambiar el nodo izquierdo por una concatenacion, y mover a este mismo nodo a la derecha de conca
tree.insert('1')
tree.preorder();