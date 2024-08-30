const generateButton = document.getElementById('generate');
const floorsInput = document.getElementById('floors-input');
const liftsInput = document.getElementById('lifts-input');

generateButton.addEventListener('click', function () {
    const no_of_floors = parseInt(floorsInput.value);
    const no_of_lifts = parseInt(liftsInput.value);

    if (!no_of_floors && !no_of_lifts) {
        alert('Enter the values for floors and lifts');
        return;
    }
    if (no_of_floors <= 1 || !no_of_floors) {
        alert('Number of floors should be greater than 1');
        return;
    }
    if (no_of_lifts < 1 || !no_of_lifts) {
        alert('Number of lifts should be greater than 0');
        return;
    }
    //document.getElementById("inputContainer").style.display = "none";
    createFloors(no_of_floors);
    createLifts(no_of_lifts);
})

function createFloors(no_of_floors) {
    const floorContainer = document.getElementById('floor-container');
    floorContainer.innerHTML = '';

    for (let i = no_of_floors; i >= 0; i--) {
        const floorLine = document.createElement('div');
        floorLine.className = 'floor-line';

        const line = document.createElement('div');
        line.className = 'line';

        const floorInfo = document.createElement('div');
        floorInfo.className = 'floor-info';

        const floorDetails = document.createElement('span');
        floorDetails.textContent = `Floor ${i}`;

        floorInfo.appendChild(floorDetails);
        floorLine.appendChild(floorInfo);
        floorLine.appendChild(line);
        floorContainer.appendChild(floorLine);
    }
}

function createLifts(no_of_lifts) {
    const floorContainer = document.getElementById('floor-container');
    const firstFloor = floorContainer.lastElementChild;

    const liftsContainer = document.createElement('div');
    liftsContainer.className = 'lifts-container';

    for(let i = 1; i <= no_of_lifts; i++){
        const lift = document.createElement('div');
        lift.className = 'lift';
        lift.id = `lift-${i}`;
        lift.textContent = `Lift-${i}`;

        liftsContainer.appendChild(lift);
    }
    firstFloor.insertBefore(liftsContainer, firstFloor.firstChild);
}