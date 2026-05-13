/* ===========================
   RELATION-PROPERTIES.JS - Relation Analysis
   =========================== */

class RelationProperties {
  constructor(matrixLogic) {
    this.matrix = matrixLogic;
  }

  /**
   * Check if relation is reflexive
   * A relation R is reflexive if for all x, xRx
   */
  isReflexive() {
    if (this.matrix.getVerticesCount() === 0) return false;

    const vertices = this.matrix.getVertices();
    const m = this.matrix.getMatrix();

    for (let i = 0; i < vertices.length; i++) {
      if (m[i][i] !== 1) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if relation is irreflexive
   * A relation R is irreflexive if for all x, NOT(xRx)
   */
  isIrreflexive() {
    if (this.matrix.getVerticesCount() === 0) return false;

    const vertices = this.matrix.getVertices();
    const m = this.matrix.getMatrix();

    for (let i = 0; i < vertices.length; i++) {
      if (m[i][i] === 1) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if relation is symmetric
   * A relation R is symmetric if xRy implies yRx
   */
  isSymmetric() {
    if (this.matrix.getVerticesCount() === 0) return false;

    const m = this.matrix.getMatrix();
    const n = m.length;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (m[i][j] !== m[j][i]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Check if relation is antisymmetric
   * A relation R is antisymmetric if xRy and yRx implies x=y
   */
  isAntisymmetric() {
    if (this.matrix.getVerticesCount() === 0) return true;

    const m = this.matrix.getMatrix();
    const n = m.length;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j && m[i][j] === 1 && m[j][i] === 1) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Check if relation is asymmetric
   * A relation R is asymmetric if xRy implies NOT(yRx)
   */
  isAsymmetric() {
    if (this.matrix.getVerticesCount() === 0) return false;

    const m = this.matrix.getMatrix();
    const n = m.length;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (m[i][j] === 1 && m[j][i] === 1) {
          return false;
        }
      }
    }

    // Also check that diagonal is empty
    for (let i = 0; i < n; i++) {
      if (m[i][i] === 1) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if relation is transitive
   * A relation R is transitive if xRy and yRz implies xRz
   */
  isTransitive() {
    if (this.matrix.getVerticesCount() === 0) return false;

    const m = this.matrix.getMatrix();
    const n = m.length;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          if (m[i][j] === 1 && m[j][k] === 1 && m[i][k] !== 1) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * Check if relation is an equivalence relation
   * Must be reflexive, symmetric, and transitive
   */
  isEquivalence() {
    return this.isReflexive() && this.isSymmetric() && this.isTransitive();
  }

  /**
   * Check if relation is a partial order
   * Must be reflexive, antisymmetric, and transitive
   */
  isPartialOrder() {
    return this.isReflexive() && this.isAntisymmetric() && this.isTransitive();
  }

  /**
   * Check if relation is a total order
   * Must be partial order and total (comparable)
   */
  isTotalOrder() {
    if (!this.isPartialOrder()) return false;

    const m = this.matrix.getMatrix();
    const n = m.length;

    // Check if for all i, j: either (i,j) or (j,i) is in relation
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (m[i][j] === 0 && m[j][i] === 0) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Check if relation is strict partial order
   * Must be irreflexive, asymmetric, and transitive
   */
  isStrictPartialOrder() {
    return this.isIrreflexive() && this.isAsymmetric() && this.isTransitive();
  }

  /**
   * Get all properties as object
   */
  getAllProperties() {
    return {
      reflexive: this.isReflexive(),
      irreflexive: this.isIrreflexive(),
      symmetric: this.isSymmetric(),
      antisymmetric: this.isAntisymmetric(),
      asymmetric: this.isAsymmetric(),
      transitive: this.isTransitive(),
      equivalence: this.isEquivalence(),
      partialOrder: this.isPartialOrder(),
      totalOrder: this.isTotalOrder(),
      strictPartialOrder: this.isStrictPartialOrder()
    };
  }

  /**
   * Get description for a property
   */
  getPropertyDescription(property) {
    const descriptions = {
      reflexive: 'Every element is related to itself. For all x: xRx',
      irreflexive: 'No element is related to itself. For all x: ¬(xRx)',
      symmetric: 'If x is related to y, then y is related to x. xRy ⟹ yRx',
      antisymmetric: 'If x is related to y and y is related to x, then x equals y. xRy ∧ yRx ⟹ x=y',
      asymmetric: 'If x is related to y, then y is not related to x. xRy ⟹ ¬(yRx)',
      transitive: 'If x is related to y and y is related to z, then x is related to z. xRy ∧ yRz ⟹ xRz',
      equivalence: 'The relation is an equivalence (reflexive, symmetric, transitive)',
      partialOrder: 'The relation is a partial order (reflexive, antisymmetric, transitive)',
      totalOrder: 'The relation is a total order (partial order + total comparability)',
      strictPartialOrder: 'The relation is a strict partial order (irreflexive, asymmetric, transitive)'
    };
    return descriptions[property] || '';
  }

  /**
   * Get classification of relation type
   */
  classifyRelation() {
    const props = this.getAllProperties();

    if (props.equivalence) return 'Equivalence Relation';
    if (props.totalOrder) return 'Total Order';
    if (props.partialOrder) return 'Partial Order';
    if (props.strictPartialOrder) return 'Strict Partial Order';

    if (props.reflexive && props.transitive) return 'Preorder';
    if (props.symmetric && props.transitive) return 'Symmetric-Transitive';
    if (props.antisymmetric && props.transitive) return 'Antisymmetric-Transitive';

    return 'General Relation';
  }

  /**
   * Find counterexamples for failed properties
   */
  findCounterexamples() {
    const counterexamples = {};
    const vertices = this.matrix.getVertices();
    const m = this.matrix.getMatrix();
    const n = m.length;

    // Reflexivity counterexample
    if (!this.isReflexive()) {
      for (let i = 0; i < n; i++) {
        if (m[i][i] !== 1) {
          counterexamples.reflexive = `${vertices[i]} is not related to itself`;
          break;
        }
      }
    }

    // Symmetry counterexample
    if (!this.isSymmetric()) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (m[i][j] !== m[j][i]) {
            counterexamples.symmetric = `${vertices[i]} → ${vertices[j]} but not ${vertices[j]} → ${vertices[i]}`;
            break;
          }
        }
        if (counterexamples.symmetric) break;
      }
    }

    // Antisymmetry counterexample
    if (!this.isAntisymmetric()) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (i !== j && m[i][j] === 1 && m[j][i] === 1) {
            counterexamples.antisymmetric = `${vertices[i]} ↔ ${vertices[j]} but ${vertices[i]} ≠ ${vertices[j]}`;
            break;
          }
        }
        if (counterexamples.antisymmetric) break;
      }
    }

    // Transitivity counterexample
    if (!this.isTransitive()) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          for (let k = 0; k < n; k++) {
            if (m[i][j] === 1 && m[j][k] === 1 && m[i][k] !== 1) {
              counterexamples.transitive = `${vertices[i]} → ${vertices[j]} → ${vertices[k]} but no direct ${vertices[i]} → ${vertices[k]}`;
              break;
            }
          }
          if (counterexamples.transitive) break;
        }
        if (counterexamples.transitive) break;
      }
    }

    return counterexamples;
  }

  /**
   * Get analysis summary
   */
  getSummary() {
    const props = this.getAllProperties();
    const type = this.classifyRelation();
    const trueCount = Object.values(props).filter(v => v === true).length;
    const totalCount = Object.keys(props).length;

    return {
      type,
      matchingProperties: trueCount,
      totalProperties: totalCount,
      properties: props,
      counterexamples: this.findCounterexamples()
    };
  }

  /**
   * Create HTML display for properties
   */
  createPropertiesHTML() {
    const props = this.getAllProperties();

    let html = '';
    Object.entries(props).forEach(([key, value]) => {
      const className = value ? 'true' : 'false';
      const label = key.replace(/([A-Z])/g, ' $1').trim();
      const badge = `<span class="property-badge ${className}">${value ? 'TRUE' : 'FALSE'}</span>`;
      const description = this.getPropertyDescription(key);

      html += `
        <div class="property-card ${className}">
          <div class="property-name">
            ${badge} ${label.charAt(0).toUpperCase() + label.slice(1)}
          </div>
          <div class="property-description">${description}</div>
        </div>
      `;
    });

    return html;
  }
}

// Export for use in other scripts
window.RelationProperties = RelationProperties;
