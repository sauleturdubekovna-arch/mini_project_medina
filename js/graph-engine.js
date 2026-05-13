/* ===========================
   GRAPH-ENGINE.JS - Graph Visualization & Interaction
   =========================== */

class GraphEngine {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.nodes = [];
    this.links = [];
    this.graph = null;
    this.svg = null;
    this.simulation = null;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.selectedNode = null;
    this.draggedNode = null;
    this.hoverNode = null;

    this.init();
  }

  /**
   * Initialize the graph
   */
  init() {
    // Clear container
    this.container.innerHTML = '';

    // Create SVG
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);
    this.svg.style.background = 'white';
    this.svg.style.borderRadius = '20px';
    this.container.appendChild(this.svg);

    // Create defs for markers (arrows)
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '10');
    marker.setAttribute('refX', '25');
    marker.setAttribute('refY', '5');
    marker.setAttribute('orient', 'auto');

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 5, 0 10');
    polygon.setAttribute('fill', '#b8c5d6');

    marker.appendChild(polygon);
    defs.appendChild(marker);
    this.svg.appendChild(defs);

    // Create groups for links and nodes
    this.linksGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.linksGroup.setAttribute('class', 'links');
    this.svg.appendChild(this.linksGroup);

    this.nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.nodesGroup.setAttribute('class', 'nodes');
    this.svg.appendChild(this.nodesGroup);

    this.initSimulation();
  }

  /**
   * Initialize D3 simulation
   */
  initSimulation() {
    this.simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.links)
        .id(d => d.id)
        .distance(100)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('collision', d3.forceCollide().radius(30))
      .on('tick', () => this.update());
  }

  /**
   * Add node to graph
   */
  addNode(id, label = id) {
    if (this.nodes.some(n => n.id === id)) return false;

    this.nodes.push({
      id,
      label: label || id,
      color: AppUtils.getRandomGradientColor(),
      vx: 0,
      vy: 0
    });

    this.initSimulation();
    this.update();
    return true;
  }

  /**
   * Remove node from graph
   */
  removeNode(id) {
    this.nodes = this.nodes.filter(n => n.id !== id);
    this.links = this.links.filter(l => l.source.id !== id && l.target.id !== id);

    this.initSimulation();
    this.update();
    return true;
  }

  /**
   * Add link to graph
   */
  addLink(source, target) {
    // Find actual node objects
    const sourceNode = this.nodes.find(n => n.id === source);
    const targetNode = this.nodes.find(n => n.id === target);

    if (!sourceNode || !targetNode) return false;

    // Check if link already exists
    if (this.links.some(l => l.source.id === source && l.target.id === target)) {
      return false;
    }

    this.links.push({
      source: sourceNode,
      target: targetNode,
      id: `${source}-${target}`
    });

    this.simulation.force('link').links(this.links);
    this.update();
    return true;
  }

  /**
   * Remove link from graph
   */
  removeLink(source, target) {
    this.links = this.links.filter(l => !(l.source.id === source && l.target.id === target));
    this.simulation.force('link').links(this.links);
    this.update();
    return true;
  }

  /**
   * Clear all nodes and links
   */
  clear() {
    this.nodes = [];
    this.links = [];
    this.selectedNode = null;
    this.simulation.nodes([]);
    this.simulation.force('link').links([]);
    this.update();
  }

  /**
   * Update graph visualization
   */
  update() {
    // Update links
    const links = this.linksGroup.selectAll('.link').data(this.links, d => d.id);

    links.exit().remove();

    const newLinks = links.enter().append('line')
      .attr('class', 'link')
      .attr('marker-end', 'url(#arrowhead)');

    links.merge(newLinks)
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke-width', 2)
      .attr('stroke', '#b8c5d6');

    // Update nodes
    const nodes = this.nodesGroup.selectAll('.node').data(this.nodes, d => d.id);

    nodes.exit().remove();

    const newNodes = nodes.enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', (event, d) => this.dragStarted(event, d))
        .on('drag', (event, d) => this.dragged(event, d))
        .on('end', (event, d) => this.dragEnded(event, d)));

    newNodes.append('circle')
      .attr('r', 20)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))')
      .on('click', (event, d) => this.selectNode(event, d))
      .on('mouseover', (event, d) => this.hoverNode = d)
      .on('mouseout', () => this.hoverNode = null);

    newNodes.append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-weight', '700')
      .attr('pointer-events', 'none')
      .text(d => d.label);

    nodes.merge(newNodes)
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .select('circle')
      .attr('fill', d => d === this.selectedNode ? '#ff5e85' : d.color);

    this.simulation.nodes(this.nodes);
  }

  /**
   * Handle drag start
   */
  dragStarted(event, d) {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    this.draggedNode = d;
  }

  /**
   * Handle drag
   */
  dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  /**
   * Handle drag end
   */
  dragEnded(event, d) {
    if (!event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    this.draggedNode = null;
  }

  /**
   * Select node
   */
  selectNode(event, d) {
    this.selectedNode = this.selectedNode === d ? null : d;
    this.update();
  }

  /**
   * Get all nodes
   */
  getNodes() {
    return this.nodes.map(n => ({ id: n.id, label: n.label }));
  }

  /**
   * Get all links
   */
  getLinks() {
    return this.links.map(l => ({
      source: l.source.id,
      target: l.target.id
    }));
  }

  /**
   * Resize graph
   */
  resize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);

    this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2));
    this.update();
  }

  /**
   * Export as JSON
   */
  exportJSON() {
    return JSON.stringify({
      nodes: this.getNodes(),
      links: this.getLinks()
    }, null, 2);
  }

  /**
   * Import from JSON
   */
  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.clear();

      data.nodes.forEach(n => {
        this.addNode(n.id, n.label);
      });

      data.links.forEach(l => {
        this.addLink(l.source, l.target);
      });

      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  }
}

// Export for use in other scripts
window.GraphEngine = GraphEngine;
