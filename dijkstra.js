/******************************************************************************
 * Created 2008-08-19.
 *
 * Dijkstra path-finding functions. Adapted from the Dijkstar Python project.
 *
 * Copyright (C) 2008
 *   Wyatt Baldwin <self@wyattbaldwin.com>
 *   All rights reserved
 *
 * Licensed under the MIT license.
 *
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *****************************************************************************/
var dijkstra = {
  single_source_shortest_paths: function(graph, s, d) {
    // Costs of shortest paths from s to all nodes encountered
    var costs = {};
    costs[s] = 0;

    // cost => [bucket of nodes with cost from s]
    var open = {'0': [s]};

    // Predecessor of each node that has been encountered
    var predecessors = {/* node: predecessor, ... */};

    var sorter = function (a, b) {
      return parseFloat(a) - parseFloat(b);
    };

    var add_to_open =  function (cost, v) {
      var key = '' + cost;
      open[key] = open[key] || [];
      open[key].push(v);
    };

    var keys,
        key,
        bucket,
        closest,
        w_of_s_to_u, u,
        adjacent_nodes,
        w_of_e,
        w_of_s_to_u_plus_w_of_e,
        w_of_s_to_v,
        first_visit;
    while (open) {
      // In the nodes remaining in graph that have a known cost from s,
      // find the node, u, that currently has the shortest path from s.
      keys = [];
      for (var key in open) {
        keys.push(key);
      }
      if (keys.length == 0) {
        // This means that open is empty, {}, so there's nowhere to go.
        break;
      }
      key = keys.sort(sorter)[0];
      bucket = open[key];
      u = bucket.shift();

      if (bucket.length == 0) {
        delete open[key];
      }

      // Current cost of path from s to u.
      w_of_s_to_u = parseFloat(key);

      // Get nodes adjacent to u...
      adjacent_nodes = graph[u] || {};

      // ...and explore the edges that connect u to those nodes, updating
      // the cost of the shortest paths to any or all of those nodes as
      // necessary. v is the node across the current edge from u.
      for (var v in adjacent_nodes) {
        // Get the cost of the edge running from u to v.
        w_of_e = adjacent_nodes[v];

        // Weight of s to u plus the cost of u to v across e--this is *a*
        // cost from s to v that may or may not be less than the current
        // known cost to v.
        w_of_s_to_u_plus_w_of_e = w_of_s_to_u + w_of_e;

        // If we haven't visited v yet OR if the current known cost from s to
        // v is greater than the new cost we just found (cost of s to u plus
        // cost of u to v across e), update v's cost in the cost list and
        // update v's predecessor in the predecessor list (it's now u).
        w_of_s_to_v = costs[v];
        first_visit = typeof(costs[v]) == 'undefined';
        if (first_visit || w_of_s_to_v > w_of_s_to_u_plus_w_of_e) {
          costs[v] = w_of_s_to_u_plus_w_of_e;
          add_to_open(w_of_s_to_u_plus_w_of_e, v);
          predecessors[v] = u;
        }

        // If a destination node was specified and we reached it, we're done.
        if (v == d) {
          open = null;
          break;
        }
      }
    }

    if (typeof(costs[d]) == 'undefined') {
      var msg = ['Could not find a path from ', s, ' to ', d, '.'].join('');
      throw new Error(msg);
    }

    return predecessors;
  },

  extract_shortest_path_from_predecessor_list: function(predecessors, d) {
    var nodes = [];
    var u = d;
    var predecessor;
    while (u) {
      nodes.push(u);
      predecessor = predecessors[u];
      u = predecessors[u];
    }
    nodes.reverse();
    return nodes;
  },

  find_path: function(graph, s, d) {
    var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
    return dijkstra.extract_shortest_path_from_predecessor_list(
      predecessors, d);
  },

  test: function() {
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
    var path = dijkstra.find_path(graph, 'a', 'i');
    if (path.join() !== ['a', 'd', 'e', 'f', 'i'].join()) {
      throw new Error('Path finding error!');
    }
  }
};
