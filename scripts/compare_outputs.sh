# Run a .js file both on tiny.js and node.js and diff the output.

# Run on tiny.js
node tiny.js $1 > __tiny_output.txt

# Run on node and replace some property names.
node $1 > __node_output.txt

echo "$1:"
diff __tiny_output.txt __node_output.txt && echo "ok"

rm __tiny_output.txt __node_output.txt