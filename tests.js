// Run via node.js
var assert = require('assert'),
    dijkstra = require('./dijkstra.js'),
    find_path = dijkstra.find_path,
    graph,
    path,
    paths;

// A B C
// D E F
// G H I
graph = {
  a: {b: 10, d: 1},
  b: {a: 1, c: 1, e: 1},
  c: {b: 1, f: 1},
  d: {a: 1, e: 1, g: 1},
  e: {b: 1, d: 1, f: 1, h: 1},
  f: {c: 1, e: 1, i: 1},
  g: {d: 1, h: 1},
  h: {e: 1, g: 1, i: 1},
  i: {f: 1, h: 1}
};
path = find_path(graph, 'a', 'i');
assert.deepEqual(path, ['a', 'd', 'e', 'f', 'i']);


graph = {
  a: {b: 1, c: 100},
  b: {c: 1},
  d: {b: 1}
};
// Reachable destination
path = find_path(graph, 'a', 'c');
assert.deepEqual(path, ['a', 'b', 'c']);
path = find_path(graph, 'd', 'b');
assert.deepEqual(path, ['d', 'b']);
// Unreachable destination
assert.throws(function () {
  find_path(graph, 'c', 'a');
}, Error);
assert.throws(function () {
  find_path(graph, 'a', 'd');
}, Error);
// Nonexistent destination
assert.throws(function () {
  find_path(graph, 'a', 'z');
}, Error);
// All paths from 'a'
paths = dijkstra.single_source_shortest_paths(graph, 'a');
assert.deepEqual(paths, {b: 'a', c: 'b'});
