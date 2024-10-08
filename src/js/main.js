const generateButton = document.getElementById('generate');
const floorsInput = document.getElementById('floors-input');
const liftsInput = document.getElementById('lifts-input');
const floorContainer = document.getElementById('floor-container');

let lifts = [];
let liftRequests = [];

floorsInput.addEventListener('input', function(){
    this.value = this.value.replace(/[^0-9]/g, '');
})
liftsInput.addEventListener('input', function(){
    this.value = this.value.replace(/[^0-9]/g, '');
})

generateButton.addEventListener('click', function () {
    const no_of_floors = parseInt(floorsInput.value);
    const no_of_lifts = parseInt(liftsInput.value);

    if (isNaN(no_of_floors) || isNaN(no_of_lifts)) {
        alert('Floors or Lifts must be a number greater than 0');
        return;
    }
    else if (no_of_floors < 1) {
        alert('Number of floors should be greater than 0');
        return;
    }
    else if (no_of_lifts < 1) {
        alert('Number of lifts should be greater than 0');
        return;
    }
    document.getElementById("inputContainer").style.display = "none";
    createFloors(no_of_floors, no_of_lifts);
    createLifts(no_of_lifts);
});

function createFloors(no_of_floors, no_of_lifts) {
    floorContainer.innerHTML = '';

    const totalWidth = 300 + (no_of_lifts * 100);
    floorContainer.style.width = `${totalWidth}px`;

    for (let i = no_of_floors; i >= 1; i--) {
        const floorLine = document.createElement('div');
        floorLine.className = 'floor-line';
        floorLine.style.height = '50px'; 

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        if (i === 1 || (no_of_floors > 1 && i < no_of_floors)) {
            const upButton = document.createElement('button');
            upButton.className = 'button up-button';
            upButton.textContent = 'Up';
            upButton.addEventListener('click', () => requestLift(i, 'up'));
            buttonContainer.appendChild(upButton);
        }

        if (i > 1) {
            const downButton = document.createElement('button');
            downButton.className = 'button down-button';
            downButton.textContent = 'Down';
            downButton.addEventListener('click', () => requestLift(i, 'down'));
            buttonContainer.appendChild(downButton);
        }

        const floorInfo = document.createElement('div');
        floorInfo.className = 'floor-info';
        floorInfo.textContent = `Floor ${i}`;

        const line = document.createElement('div');
        line.className = 'line';

        floorLine.appendChild(floorInfo);
        floorLine.appendChild(buttonContainer);
        floorLine.appendChild(line);
        floorContainer.appendChild(floorLine);
    }
}

function createLifts(no_of_lifts) {
    const firstFloor = floorContainer.lastElementChild;
    const liftsContainer = document.createElement('div');
    liftsContainer.className = 'lifts-container';

    for (let i = 1; i <= no_of_lifts; i++) {
        const lift = document.createElement('div');
        lift.className = 'lift';
        lift.id = `lift-${i}`;

        const leftDoor = document.createElement('div');
        leftDoor.className = 'lift-door left';
        const rightDoor = document.createElement('div');
        rightDoor.className = 'lift-door right';

        lift.appendChild(leftDoor);
        lift.appendChild(rightDoor);

        liftsContainer.appendChild(lift);
        lifts.push({ 
            element: lift, 
            currentFloor: 1, 
            isMoving: false,
            destinationFloor: null,
            direction: null
         });
    }
    firstFloor.appendChild(liftsContainer);
}

function requestLift(floorNum, direction) {
    const floorIndex = floorContainer.children.length - floorNum;
    const floorElement = floorContainer.children[floorIndex];

    if(floorElement){
        const button = floorElement.querySelector(`.${direction}-button`);
        if(button) {
            button.disabled = true;
        }
    }
    liftRequests.push({ floor: floorNum, direction });
    processLiftRequests();
}

function processLiftRequests() {
    if (liftRequests.length === 0) return;

    const request = liftRequests[0];
    const availableLift = findNearestIdleLift(request.floor);

    if (availableLift) {
        liftRequests.shift();
        moveLift(availableLift, request.floor, request.direction).then(() => {
            const floorIndex = floorContainer.children.length - request.floor;
            const floorElement = floorContainer.children[floorIndex];
            if (floorElement) {
                const button = floorElement.querySelector(`.${request.direction}-button`);
                if (button) {
                    button.disabled = false;
                }
            }
            processLiftRequests();
        });
    }
}

function findNearestIdleLift(targetFloor) {
    let nearestLift = null;
    let minDistance = Infinity;
    let minFloor = Infinity;

    for (let lift of lifts) {
        if (!lift.isMoving) {
            const distance = Math.abs(targetFloor - lift.currentFloor);
            if (distance < minDistance || 
                (distance === minDistance && lift.currentFloor < minFloor)) {
                minDistance = distance;
                minFloor = lift.currentFloor;
                nearestLift = lift;
            }
        }
    }
    return nearestLift;
}

function moveLift(lift, targetFloor, direction) {
    lift.isMoving = true;
    lift.destinationFloor = targetFloor;
    lift.direction = direction;
    const floorHeight = 150; 
    const distance = Math.abs(targetFloor - lift.currentFloor);
    const duration = distance * 2;

    return new Promise(resolve => {
        lift.element.style.transition = `transform ${duration}s linear`;
        lift.element.style.transform = `translateY(-${(targetFloor - 1) * floorHeight}px)`;

        setTimeout(() => {
            operateLiftDoors(lift).then(() => {
                lift.currentFloor = targetFloor;
                lift.isMoving = false;
                lift.destinationFloor = null;
                lift.direction = null;
                resolve();
            });
        }, duration * 1000);
    });
}

function operateLiftDoors(lift) {
    return new Promise(resolve => {
        const leftDoor = lift.element.querySelector('.lift-door.left');
        const rightDoor = lift.element.querySelector('.lift-door.right');

        leftDoor.style.transform = 'scaleX(0)';
        rightDoor.style.transform = 'scaleX(0)';

        setTimeout(() => {
            leftDoor.style.transform = 'scaleX(1)';
            rightDoor.style.transform = 'scaleX(1)';

            setTimeout(resolve, 2500);
        }, 2500);
    });
}

function clearInputs() {
    floorsInput.value = '';
    liftsInput.value = '';
}
clearInputs();