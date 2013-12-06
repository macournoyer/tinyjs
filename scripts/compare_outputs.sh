# Run a .js file both on tiny.js and node.js and diff the output.

# Run on tiny.js
node tiny.js $1 > __tiny_output.txt

# Run on node and replace some property names.
cat $1 | sed 's/__tinyProto__/__proto__/g' > node_tmp.js
node node_tmp.js > __node_output.txt

echo "$1:"
diff __tiny_output.txt __node_output.txt && echo "ok"

rm __tiny_output.txt __node_output.txt node_tmp.js