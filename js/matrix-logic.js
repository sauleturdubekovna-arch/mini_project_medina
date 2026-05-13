/* ===========================
   MATRIX-LOGIC.JS - Matrix Operations
   =========================== */

class MatrixLogic {
  constructor() {
    this.vertices = [];
    this.relations = [];
    this.matrix = [];
  }

  /**
   * Add vertex to the system
   */
  addVertex(name) {
    if (this.vertices.includes(name)) {
      return false;
    }
    this.vertices.push(name);
    this.updateMatrix();
    return true;
  }

  /**
   * Remove vertex and all its relations
   */
  removeVertex(name) {
    const index = this.vertices.indexOf(name);
    if (index === -1) return false;

    this.vertices.splice(index, 1);
    this.relations = this.relations.filter(r => r.from !== name && r.to !== name);
    this.updateMatrix();
    return true;
  }

  /**
   * Rename vertex
   */
  renameVertex(oldName, newName) {
    const index = this.vertices.indexOf(oldName);
    if (index === -1 || this.vertices.includes(newName)) return false;

    this.vertices[index] = newName;
    this.relations = this.relations.map(r => ({
      from: r.from === oldName ? newName : r.from,
      to: r.to === oldName ? newName : r.to
    }));
    this.updateMatrix();
    return true;
  }

  /**
   * Add relation (edge)
   */
  addRelation(from, to) {
    if (!this.vertices.includes(from) || !this.vertices.includes(to)) {
      return false;
    }

    // Check if relation already exists
    const exists = this.relations.some(r => r.from === from && r.to === to);
    if (exists) return false;

    this.relations.push({ from, to });
    this.updateMatrix();
    return true;
  }

  /**
   * Remove relation
   */
  removeRelation(from, to) {
    const index = this.relations.findIndex(r => r.from === from && r.to === to);
    if (index === -1) return false;

    this.relations.splice(index, 1);
    this.updateMatrix();
    return true;
  }

  /**
   * Clear all vertices and relations
   */
  clear() {
    this.vertices = [];
    this.relations = [];
    this.matrix = [];
  }

  /**
   * Update the adjacency matrix
   */
  updateMatrix() {
    const n = this.vertices.length;
    this.matrix = Array(n).fill().map(() => Array(n).fill(0));

    this.relations.forEach(rel => {
      const i = this.vertices.indexOf(rel.from);
      const j = this.vertices.indexOf(rel.to);
      if (i !== -1 && j !== -1) {
        this.matrix[i][j] = 1;
      }
    });

    return this.matrix;
  }

  /**
   * Get adjacency matrix
   */
  getMatrix() {
    return this.matrix;
  }

  /**
   * Get matrix as string (for display)
   */
  getMatrixString() {
    if (this.vertices.length === 0) return '';

    let result = '   ';
    this.vertices.forEach(v => {
      result += v.padEnd(4);
    });
    result += '\n';

    this.vertices.forEach((row, i) => {
      result += row.padEnd(3);
      this.matrix[i].forEach(val => {
        result += val.toString().padEnd(4);
      });
      result += '\n';
    });

    return result;
  }

  /**
   * Get all vertices
   */
  getVertices() {
    return [...this.vertices];
  }

  /**
   * Get all relations
   */
  getRelations() {
    return [...this.relations];
  }

  /**
   * Check if vertices exist
   */
  hasVertex(name) {
    return this.vertices.includes(name);
  }

  /**
   * Check if relation exists
   */
  hasRelation(from, to) {
    return this.relations.some(r => r.from === from && r.to === to);
  }

  /**
   * Get vertices count
   */
  getVerticesCount() {
    return this.vertices.length;
  }

  /**
   * Get relations count
   */
  getRelationsCount() {
    return this.relations.length;
  }

  /**
   * Get density (relations / possible relations)
   */
  getDensity() {
    const n = this.vertices.length;
    if (n <= 1) return 0;
    const maxRelations = n * n;
    return (this.relations.length / maxRelations * 100).toFixed(2);
  }

  /**
   * Get outgoing relations for a vertex
   */
  getOutgoing(vertex) {
    return this.relations.filter(r => r.from === vertex);
  }

  /**
   * Get incoming relations for a vertex
   */
  getIncoming(vertex) {
    return this.relations.filter(r => r.to === vertex);
  }

  /**
   * Get degree of a vertex
   */
  getDegree(vertex) {
    const outgoing = this.getOutgoing(vertex).length;
    const incoming = this.getIncoming(vertex).length;
    return { in: incoming, out: outgoing, total: incoming + outgoing };
  }

  /**
   * Get in-degree of all vertices
   */
  getInDegrees() {
    const degrees = {};
    this.vertices.forEach(v => {
      degrees[v] = this.getIncoming(v).length;
    });
    return degrees;
  }

  /**
   * Get out-degree of all vertices
   */
  getOutDegrees() {
    const degrees = {};
    this.vertices.forEach(v => {
      degrees[v] = this.getOutgoing(v).length;
    });
    return degrees;
  }

  /**
   * Get graph statistics
   */
  getStatistics() {
    return {
      vertices: this.getVerticesCount(),
      relations: this.getRelationsCount(),
      density: parseFloat(this.getDensity()),
      avgDegree: this.vertices.length > 0 ? (this.relations.length * 2 / this.vertices.length).toFixed(2) : 0
    };
  }

  /**
   * Export as JSON
   */
  exportJSON() {
    return JSON.stringify({
      vertices: this.vertices,
      relations: this.relations,
      matrix: this.matrix
    }, null, 2);
  }

  /**
   * Import from JSON
   */
  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.vertices = data.vertices || [];
      this.relations = data.relations || [];
      this.updateMatrix();
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  }

  /**
   * Generate random graph
   */
  generateRandom(vertexCount = 4, connectionProbability = 0.4) {
    this.clear();

    // Add vertices
    for (let i = 0; i < vertexCount; i++) {
      this.addVertex(String.fromCharCode(65 + i));
    }

    // Add random relations
    for (let i = 0; i < vertexCount; i++) {
      for (let j = 0; j < vertexCount; j++) {
        if (Math.random() < connectionProbability) {
          this.addRelation(
            this.vertices[i],
            this.vertices[j]
          );
        }
      }
    }
  }

  /**
   * Clone the matrix logic
   */
  clone() {
    const clone = new MatrixLogic();
    clone.vertices = [...this.vertices];
    clone.relations = this.relations.map(r => ({ ...r }));
    clone.matrix = this.matrix.map(row => [...row]);
    return clone;
  }

  /**
   * Transpose the relation matrix
   */
  transpose() {
    const transposed = new MatrixLogic();
    transposed.vertices = [...this.vertices];

    // Add transposed relations
    this.relations.forEach(r => {
      transposed.relations.push({ from: r.to, to: r.from });
    });

    transposed.updateMatrix();
    return transposed;
  }

  /**
   * Get relation composition
   */
  compose(other) {
    if (this.vertices.length !== other.vertices.length) {
      console.error('Matrices must have same dimensions for composition');
      return null;
    }

    const result = new MatrixLogic();
    result.vertices = [...this.vertices];
    const n = this.vertices.length;

    // Matrix multiplication
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += this.matrix[i][k] * other.matrix[k][j];
        }
        if (sum > 0) {
          result.matrix[i][j] = 1;
        }
      }
    }

    // Generate relations from matrix
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (result.matrix[i][j] === 1) {
          result.relations.push({
            from: result.vertices[i],
            to: result.vertices[j]
          });
        }
      }
    }

    return result;
  }

  /**
   * Create matrix display HTML
   */
  createMatrixHTML() {
    if (this.vertices.length === 0) {
      return '<p class="text-grey">No vertices added yet</p>';
    }

    let html = '<table class="matrix"><thead><tr><th></th>';

    this.vertices.forEach(v => {
      html += `<th>${v}</th>`;
    });

    html += '</tr></thead><tbody>';

    this.vertices.forEach((row, i) => {
      html += `<tr><th>${row}</th>`;
      this.matrix[i].forEach(val => {
        const className = val === 1 ? 'one' : 'zero';
        html += `<td class="${className}">${val}</td>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
  }
}

// Export for use in other scripts
window.MatrixLogic = MatrixLogic;
