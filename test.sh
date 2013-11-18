# Run a .js file both on tiny.js and node.js and diff the output.
./tiny $1 > __tiny_output.txt
node $1 > __node_output.txt
echo "$1:"
diff __tiny_output.txt __node_output.txt && echo "ok"
rm __tiny_output.txt __node_output.txt