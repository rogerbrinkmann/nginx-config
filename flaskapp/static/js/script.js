var node = document.createElement("p");
var textnode = document.createTextNode("Hello from JavaScript");
node.appendChild(textnode);
document.getElementsByTagName("body")[0].appendChild(node);
