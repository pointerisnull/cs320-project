// Function to retrieve the corresponding territory object given a specific polygon.
function findTerritoryByPolygonId(territories, polygonId) {
    return territories.find(territory => territory.name === polygonId);
}

// Function to calculate distance between two points
function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Function to determine adjacency between two countries (this isn't perfect but works for now).
function isAdjacent(attackerPolygonId, targetPolygonId) {
    const attackerPolygon = document.getElementById("riskSVGMap").contentDocument.getElementById(attackerPolygonId);
    const targetPolygon = document.getElementById("riskSVGMap").contentDocument.getElementById(targetPolygonId);
    const attackerPolygonBounds = attackerPolygon.getBoundingClientRect();
    const targetPolygonBounds = targetPolygon.getBoundingClientRect();
    const distance = calculateDistance(attackerPolygonBounds.left, attackerPolygonBounds.top, targetPolygonBounds.left, targetPolygonBounds.top);

    // Check if the distance is below a threshold to consider them adjacent
    if (distance < 100 && attackerPolygon !== targetPolygon) {
        return true;
    } else {
        return false;
    }
}