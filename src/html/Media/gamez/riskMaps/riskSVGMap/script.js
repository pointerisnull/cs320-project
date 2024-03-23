document.addEventListener('DOMContentLoaded', function() {
    const instructions_head = document.getElementById('instructions_head');
    const instructions_description = document.getElementById('instructions_description');
    const winOrLoseDisplay = document.getElementById('winOrLoseDisplay');
    instructions_head.innerText = 'Choose Attacker!';
    instructions_description.innerText = 'Choose the country that will attack...';
    console.log('page and script loaded!');
    let attackingCountry = null;
    let targetCountry = null;
    let selectedTroopType = null;
    let troopQuantity = null;
    const worldMap = document.getElementById("worldMap");

    const confirmAttackerButton = document.getElementById('confirmAttackerButton');
    confirmAttackerButton.addEventListener('click', function () {
        console.log('Attacking country confirmed:', attackingCountry);
        confirmAttackerButton.style.display = 'none';
        document.getElementById('attackingCountryDisplay').innerText = "Attacker: " + attackingCountry;
        instructions_head.innerText = 'Choose Target!';
        instructions_description.innerText = 'Choose the country that will be targeted...';
        resetAnimation();
    });

    const confirmTargetButton = document.getElementById('confirmTargetButton');
    confirmTargetButton.addEventListener('click', function() {
        console.log('Target country confirmed: ', targetCountry);
        confirmTargetButton.style.display = 'none';
        document.getElementById('targetedCountryDisplay').innerText = "Target: " + targetCountry;
        instructions_head.innerText = 'Choose Number of Troops!';
        instructions_description.innerText = 'Choose the number of troops to deploy to the targeted country...';
        resetAnimation();
        chooseTroops();
        setTimeout(function() {
            animateMissileAttack(attackingCountry, targetCountry);
        }, 10000);
    });

    worldMap.addEventListener('click', function (event) {
        const clickedPolygon = event.target.closest('polygon');
        if(clickedPolygon) {
            let country = clickedPolygon.getAttribute('id');

            if (attackingCountry === null  || attackingCountry === country) {
                attackingCountry = chooseAttackingCountry(country);
                console.log(country, 'selected as attacking country.');
            }
            else {
                targetCountry = chooseTargetCountry(country);
                console.log(country, 'selected as the target country.');
            }
        }
    });

    // Function to reset the fade in and out animation
    function resetAnimation() {
        const instructions = document.getElementById('instructions');
        instructions.style.animation = 'none';
        instructions.offsetHeight;
        instructions.style.animation = null;
    }

    function chooseAttackingCountry(chosenCountry) {
        document.getElementById('confirmAttackerButton').innerText = 'Confirm Attacking Country: ' + chosenCountry;
        document.getElementById('confirmAttackerButton').style.display = 'block';

        return chosenCountry;
    }

    function chooseTargetCountry(chosenCountry) {
        confirmTargetButton.innerText = 'Confirm Target Country: ' + chosenCountry;
        confirmTargetButton.style.display = 'block';

        return chosenCountry;
    }

    function chooseTroops() {
        if(attackingCountry !== null && targetCountry !== null && attackingCountry !== targetCountry) {
            const troopTypes = ['Infantry', 'Cavalry', 'Artillery']; // Define your troop types

            // Prompt for troop type selection
            const troopTypeIndex = window.prompt('Choose Troop Type:\n' + troopTypes.join('\n'));
            
            // Check if the user clicked cancel or entered an invalid option
            if (troopTypeIndex === null || isNaN(troopTypeIndex) || troopTypeIndex < 0 || troopTypeIndex >= troopTypes.length) {
                instructions_head.innerText = 'Troop selection canceled.';
                instructions_description.innerText = '';
                return;
            }

            selectedTroopType = troopTypes[troopTypeIndex];
            document.getElementById('troopTypeDisplay').innerText = "Troop Type: " + selectedTroopType;

            // Prompt for troop quantity
            troopQuantity = window.prompt('Enter Troop Quantity for ' + selectedTroopType + ':');

            // Check if the user clicked cancel or entered an invalid quantity
            if (troopQuantity === null || isNaN(troopQuantity) || troopQuantity <= 0) {
                instructions_head.innerText = 'Invalid troop quantity or selection canceled.';
                instructions_description.innerText = '';
                return;
            }

            instructions_head.innerText = 'Troop Selection Confirmed!';
            instructions_description.innerText = 'You have selected ' + troopQuantity + ' ' + selectedTroopType + '(s).' + '\nInvasion starting shortly...';
            document.getElementById('troopQuantityDisplay').innerText = "Troop Quantity: " + troopQuantity;

            // Perform further actions with troopType and troopQuantity as needed
            console.log('Selected Troop Type:', selectedTroopType);
            console.log('Selected Troop Quantity:', troopQuantity);
        }
        else if(attackingCountry === targetCountry) {
            instructions_head.innerText = "Can't select attacking country as target!";
            instructions_description.innerText = '';
            resetAnimation();
            return;
        }
    }

    function getCountryElement(country) {
        return document.getElementById(country);
    }

    function getXCoordinate(country) {
        const element = getCountryElement(country);
        const rect = element.getBoundingClientRect();
        const svgRect = worldMap.getBoundingClientRect();
        return rect.x + rect.width / 2 - svgRect.left; // Adjust for SVG position
    }

    function getYCoordinate(country) {
        const element = getCountryElement(country);
        const rect = element.getBoundingClientRect();
        const svgRect = worldMap.getBoundingClientRect();
        return rect.y + rect.height / 2 - svgRect.top; // Adjust for SVG position
    }

    function animateMissileAttack(attackingCountry, targetCountry) {
        const attackerX = getXCoordinate(attackingCountry);
        const attackerY = getYCoordinate(attackingCountry);
        console.log('Attacker coordinates:', attackerX, attackerY);
    
        const targetX = getXCoordinate(targetCountry);
        const targetY = getYCoordinate(targetCountry);
        console.log('Target coordinates:', targetX, targetY);
    
        // Create a new missile element (rect) for animation
        const missileElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    
        // Set missile attributes (customize as needed)
        const missileWidth = 5; // Width of the missile
        const missileHeight = 20; // Height of the missile
        missileElement.setAttribute("width", missileWidth);
        missileElement.setAttribute("height", missileHeight);
        missileElement.setAttribute("fill", "red"); // Missile color
    
        // Append missile to the worldMap SVG
        worldMap.appendChild(missileElement);
    
        // Calculate the step for each update
        const step = 0.005; // Adjust the step as needed
    
        // Initialize the parameter for quadratic Bezier curve
        let t = 0;
    
        // Use requestAnimationFrame for smoother animation
        function animate() {
            // Increment the parameter
            t += step;
    
            // Update missile position using quadratic Bezier curve formula
            const x = (1 - t) ** 2 * attackerX + 2 * (1 - t) * t * ((attackerX + targetX) / 2) + t ** 2 * targetX;
            const y = (1 - t) ** 2 * attackerY + 2 * (1 - t) * t * (attackerY - 100) + t ** 2 * targetY;
    
            // Update missile position and rotation
            if (t <= 1) {
                // Sideways rotation
                missileElement.setAttribute("x", x - missileHeight / 2);
                missileElement.setAttribute("y", y - missileWidth / 2);
                missileElement.setAttribute("transform", `rotate(${90 - (t - 0.25) * -90}, ${x}, ${y})`);
            }
    
            // Check if the animation is complete
            if (t <= 1) {
                // Continue the animation
                requestAnimationFrame(animate);
            } else {
                // Remove the missile element after the animation is complete
                worldMap.removeChild(missileElement);
    
                // Trigger explosion animation at the target country
                animateExplosion(targetX, targetY);
            }
        }
    
        // Start the animation
        animate();
    }
    
    function animateExplosion(x, y) {
        // Create an explosion animation (e.g., expanding circles)
        const explosionElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        
        // Set explosion attributes (customize as needed)
        explosionElement.setAttribute("cx", x);
        explosionElement.setAttribute("cy", y);
        explosionElement.setAttribute("r", "0"); // Initial radius (will be animated)
        explosionElement.setAttribute("fill", "orange"); // Explosion color
    
        // Append explosion to the worldMap SVG
        worldMap.appendChild(explosionElement);
    
        // Animate explosion (circle expansion)
        explosionElement.animate(
            [
                { r: "0" },
                { r: "30" }, // Adjust the final radius as needed
                { r: "0" }
            ],
            {
                duration: 2000, // Animation duration in milliseconds
                easing: "ease-in" // Ease-in animation
            }
        ).onfinish = function () {
            // Remove the explosion element after the animation is complete
            worldMap.removeChild(explosionElement);
        };

        animateTroopMovement(attackingCountry, targetCountry);

        setTimeout(function () {
            console.log("Waited for 3 seconds, now moving on...");
            if(Math.random() * 20 *  troopQuantity >= 40) {
                winOrLoseDisplay.innerText = 'Congratualations, you successfully invaded: ' + targetCountry;
                instructions_head.innerText = 'You Successfully Invaded ' + targetCountry + '!';
                instructions_description.innerText = 'Reloading the experience in a few seconds...';
                resetAnimation();
                startVictoryAnimation();
            }
            else {
                winOrLoseDisplay.innerText = 'Sorry, you failed to invade: ' + targetCountry;
                instructions_head.innerText = 'You Failed to Invade ' + targetCountry + '!';
                instructions_description.innerText = 'Reloading the experience in a few seconds...';
                resetAnimation();
            }
        }, 8000);
        setTimeout(function() {
            location.reload();
        }, 18000);

    }

// ... Your existing code ...

    function animateTroopMovement(attackingCountry, targetCountry) {
        const attackerX = getXCoordinate(attackingCountry);
        const attackerY = getYCoordinate(attackingCountry);
        console.log('Attacker coordinates:', attackerX, attackerY);

        const targetX = getXCoordinate(targetCountry);
        const targetY = getYCoordinate(targetCountry);
        console.log('Target coordinates:', targetX, targetY);

        const troopType = selectedTroopType.toLowerCase(); // Convert to lowercase for consistency

        // Use a switch statement to create the appropriate troop element based on the selected type
        let troopElement;
        switch (troopType) {
            case 'infantry':
                troopElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                troopElement.setAttribute("r", 2); // Set the radius for the circle (adjust as needed)
                break;
            case 'cavalry':
                troopElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                troopElement.setAttribute("r", 4); // Set the radius for the circle (adjust as needed)
                break;
            case 'artillery':
                troopElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                troopElement.setAttribute("width", 5); // Set the width for the rectangle (adjust as needed)
                troopElement.setAttribute("height", 2); // Set the height for the rectangle (adjust as needed)
                break;
            default:
                // Default to a circle if the troop type is not recognized
                troopElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                troopElement.setAttribute("r", 5); // Set the radius for the circle (adjust as needed)
                break;
        }
        console.log('Troops created: ', troopElement);
        // Append troop elements to the worldMap SVG
        for (let i = 0; i < troopQuantity; i++) {
            const troopClone = troopElement.cloneNode(true);
            worldMap.appendChild(troopClone);

            // Calculate initial position based on the quantity and spacing
            const initialX = attackerX + i * 10;
            const initialY = attackerY;

            troopClone.setAttribute("cx", initialX);
            troopClone.setAttribute("cy", initialY);

            // Calculate the step for each update
            const step = 0.005; // Adjust the step as needed

            // Initialize the parameter for linear interpolation
            let t = 0;

            // Use requestAnimationFrame for smoother animation
            function animate() {
                // Update troop position using linear interpolation
                const x = (1 - t) * initialX + t * targetX;
                const y = (1 - t) * initialY + t * targetY;
                // Update troop position
                if (troopElement.tagName.toLowerCase() === "circle") {
                    troopClone.setAttribute("cx", x);
                    troopClone.setAttribute("cy", y);
                } 
                else if (troopElement.tagName.toLowerCase() === "rect") {
                    troopClone.setAttribute("x", x);
                    troopClone.setAttribute("y", y);
                }

                // Increment the parameter
                t += step;

                // Check if the animation is complete
                if (t <= 1) {
                    // Continue the animation
                    requestAnimationFrame(animate);
                } else {
                    // Remove the troop element after the animation is complete
                    worldMap.removeChild(troopClone);
                }
            }

            // Start the animation
            animate();
        }
    }

    function startVictoryAnimation() {
        createRandomCircles();
        const victoryAnimation = document.getElementById('victoryAnimation');
        const clonedAnimation = victoryAnimation.cloneNode(true);
      
        victoryAnimation.parentNode.replaceChild(clonedAnimation, victoryAnimation);
      
        // Trigger the animation
        clonedAnimation.classList.add('victoryAnimationActive');
    }

    function createRandomCircles() {
        const circleContainer = document.getElementById('victoryAnimation');
      
        for (let i = 0; i < 100; i++) {
          const circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circleElement.setAttribute('cx', Math.random() * (750 - 50) + 50);
          circleElement.setAttribute('cy', Math.random() * 50);
          circleElement.setAttribute('r', 5);
          circleElement.setAttribute('fill', 'gold');
      
          circleContainer.appendChild(circleElement);
        }
      }

});