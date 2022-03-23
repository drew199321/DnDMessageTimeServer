//This code is kinda messy and I know you guys are fairly new to js
//so I want this code to be well commented so you guys can follow it
//I also go into some of the basics of js, I don't know if they'll be
//very useful to you guys but hopefully they teach you something about the language


//Used for resetting the output of the dice roller
//NOTE: In js you dont have to give a data type or even
//that the value is an array.
function reset(value)
{
    //This is one way of doing for loops in js
    //for (element in array) is the same as
    //for (int i = 0; i < <length of array>; i++) in C++ (and in js as well)
    //NOTE: element is not the actual element in the array,
    //it is simply the position of the array it is in, so it will be
    //an integer that you still need to pass into array to correctly access it
    //i.e. array[element]
    for (die in value)
    {
        //Grabs the element with that id (# is id selector)
        //ie if value[die] is 4 the HTML element grabbed has an id of "d4"
        var reset = document.querySelector("#d" + value[die]);

        //Directly Modifies the HTML code inside that element
        //You can put any HTML code in this, whether that is just text or 
        //even elements like <div>, <br />, etc.
        //NOTE: Using an equal sign here resets the HTML code to nothing,
        //then sets it to whatever you set it to. Use += to add to existing HTML
        reset.innerHTML = "";
    }
    var reset = document.querySelector("#total");
    reset.innerHTML = "";
}

//The main functionality of the code
function diceroll()
{
    //The values of the dice, used for not only the ranges of the rolls,
    //but as a string modifier to access HTML elements named after the dice
    //i.e the reset function above
    //NOTE: The semi-colon is not used in array declarations
    var value = [2,4,6,8,10,12,20,100]
    
    //Calling above reset function and passing the value array.
    reset(value);

    //Getting the number of each dice the user wants to roll
    //and storing it into an array
    //NOTE: getElementsByName does exactly what it sounds like, but be careful
    //not to treat it like getElementByID, this function is plural and puts
    //all elements of that name into an array even if there is only 1 of them, 
    //so you need to correctly access the element you want in that array
    var dice = [
        document.getElementsByName("d2")[0].value,
        document.getElementsByName("d4")[0].value,
        document.getElementsByName("d6")[0].value,
        document.getElementsByName("d8")[0].value,
        document.getElementsByName("d10")[0].value,
        document.getElementsByName("d12")[0].value,
        document.getElementsByName("d20")[0].value,
        document.getElementsByName("d100")[0].value
    ]

    //Looping through to ensure that in the off chance the user manages
    //to send a null to the function the code treats it like a 0, as I don't
    //know if js treats null as 0
    for (die in dice)
    {
        if (dice[die] === null)
        {
            dice[die] = 0;
        }
    }
    //Empty 2D array that will be filled with the rolls of the dice,
    //there is one layer for each dice type
    var rolls = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ]
    for (die in dice)
    {
        var temp = 0;
        while (temp < dice[die])
        {
            //Math.random() returns a float between 0 and 1 with many decimal places,
            //so if you want to have a specific range multiply it by the max and then use
            //Math.floor (or Math.ceil()) to round the number to an integer
            rolls[die][temp] = Math.floor(Math.random() * value[die]) + 1;
            temp++;
        }
    }
    var totalsum = 0;
    var rolled = false;
    //For each available dice
    for (die in rolls)
    {
        //Check if the user rolled at least 1 of that dice
        if (dice[die] > 0)
        {
            //If they did, output the name of the dice and the values rolled
            rolled = true;
            var output = document.querySelector("#d" + value[die]);
            output.innerHTML = "D" + value[die] + ": " + rolls[die];
            var sum = 0;
            //If they rolled more than 1 of that dice
            if (dice[die] > 1)
            {
                //Find the sum of that dice's rolls and add it to the overall total as well
                for (roll in rolls[die])
                {
                    sum += rolls[die][roll];
                    totalsum += rolls[die][roll];
                }
                output.innerHTML += " Sum:" + sum;
                //If they only rolled 1 then add that value to the overall total,
                //but don't display sum
            } else { totalsum += rolls[die][0]; }
        }
    }
    //This is just a check to see if the user rolled any dice
    //rolled is set in the last for loop
    if (rolled)
    {
        var output = document.querySelector("#total");
        output.innerHTML = "Total Sum: " + totalsum;
    }
}

//This is a pretty complex looking chunk of code but what it does is 
//it adds a "listener" to the number input boxes and checks if the user
//has attempted to input a value outside of the established range and if
//they have it sets it to the closest value inside the range
/*
document.querySelector('#dice').addEventListener('input', e=>{
    const elmnt = e.target || e

    if (elmnt.type === "number" && elmnt.max && elmnt.min){
        value = parseInt(elmnt.value);
        elmnt.value = value;
        max = parseInt(elmnt.max);
        min = parseInt(elmnt.min);
        if (value > max) { elmnt.value = elmnt.max; }
        if (value < min) { elmnt.value = elmnt.min; }
        if (value === NaN) { elmnt.value = 0; }
    }
});
*/


module.exports = roller;
