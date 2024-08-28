const generateButton = document.getElementById('generate');
const floorsInput = document.getElementById('floors-input');
const liftsInput = document.getElementById('lifts-input');

generateButton.addEventListener('click', function() {
    if(!floorsInput.value && !liftsInput.value){
        alert('Enter the values for floors and lifts');
        return;      
    }
    if(floorsInput.value <= 1 || !floorsInput.value){
        alert('Number of floors should be greater than 1');
        return;
    }
    if(liftsInput.value < 1 || !liftsInput.value){
        alert('Number of lifts should be greater than 0');
        return;
    }
    if(floorsInput.value < liftsInput.value){
        alert('Number of lifts should be less than or equal to the number of floors');
        return;
    }
})