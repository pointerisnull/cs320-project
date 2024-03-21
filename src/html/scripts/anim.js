// Chess
function piecesDisplay(altInfo) {
  alert("clicked on piece " + altInfo);
}
function boardDisplay(altInfo) {
  alert("clicked on square " + altInfo);
}

// Tic Tac Toe
function anim() { // https://www.w3schools.com/jsref/met_win_settimeout.asp
    l = document.getElementById("win");
    o0 = document.getElementById("0x0");
    o1 = document.getElementById("1x1");
    o2 = document.getElementById("1x2");
    o3 = document.getElementById("2x2");
    x0 = document.getElementById("0x1");
    x1 = document.getElementById("0x2");
    x2 = document.getElementById("1x0");
    
    o2.style.fill="#000000";
    x1.style.fill="#00000000";
    o0.style.fill="#00000000";
    x0.style.fill="#00000000";
    o3.style.fill="#00000000";
    x2.style.fill="#00000000";
    o1.style.fill="#00000000";
    l.style.stroke="#00000000";
    setTimeout(function(){ x1.style.fill="#000000"}, 1000);
    setTimeout(function(){ o0.style.fill="#000000"}, 2000);
    setTimeout(function(){ x0.style.fill="#000000"}, 3000);
    setTimeout(function(){ o3.style.fill="#000000"}, 4000);
    setTimeout(function(){ x2.style.fill="#000000"}, 5000);
    setTimeout(function(){ o1.style.fill="#000000"}, 6000);
    setTimeout(function(){ l.style.stroke="#000000"}, 7000);
  }

  function addX() { // create image map to get inputs
    X = document.getElementById("P1");

    X.style.fill="#00000000";
    // 0x0 (-170, 180)
    // 0x1 (0, 0)
    // 2x0 (340, 180)
    // 1x0 (170, 180)
    // 1x1 (0, 0)?
    // 2x1 (170, 0)
    // 2x2 (170, -170)
  }
// Risk
