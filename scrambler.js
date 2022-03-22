//I'll try to make this as well commented as the dice roller but I'm only going
//to go more in depth about anything that is not also used and explained
//in the dice code. If you want a more detailed explanation of the basics
//of js I suggest reading through roller.js first

//Needed for Scramble 3
//Generates and returns a random letter
function randLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    return alphabet[Math.floor(Math.random() * alphabet.length)]
}

//Used to put spaces back into the string where they belong
//Parameters are the original input and the scrambled product
function spaces(input, string)
{
    //Loop through each letter of the original input
    for (let i = 0; i < input.length; i++)
    {
        //If the original has a space at this i value
        if (input[i] === ' ')
        {
            //splice in a space
            //splice format is 
            //(position in string, number of characters to be replaced, what you are adding)
            //by leaving the second parameter at 0 we don't replace any characters and instead
            //add a new element to the array just after position i. This allows us to put the
            //spaces back in where they belong
            string.splice(i, 0, ' ');
        }
    }
    //Returning isn't neccessary in js in this case as you are directly modifying
    //the array. This is essentially the same as passing by reference in C++
}

//The bulk of the code used for all 3 types of scrambling
function scramble()
{
    //Getting user input, scramble percentage,
    //and creating a variable to store potential errors
    var input = document.getElementById("input").value;
    var percent = document.getElementById("percent").value;
    //Errors are handed to a variable first and then output at the end
    //in order to save from having to output to the html over and over 
    var error = "";

    //Checking that the user input something
    var inputEmpty = (input === "");
    //if they haven't add an error string to error and skip the scrambling
    //From here on out I wont be making note of the errors.
    if (inputEmpty) { error += "Input is Empty<br />"; }
    else
    {
        //Making sure that the input is just letters, numbers and spaces
        //The js regex is very similar to bash Basic Regular Expressions (BRE)
        var inputRegex = /\W|_/g;
        ///^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g
        //the test() function checks to see if the input passes the regex
        //and returns true or false
        var inputValid = inputRegex.test(input);
        if (!inputValid) { error += "Invalid Input <br />"; }
    }

    //Checking that the percentage is a valid range
    //Event Listener (at the bottom) should stop values outside range being input
    //but this is just in case the user somehow manages it.
    var percentValid = (percent >= 0 && percent <= 100)
    if (!percentValid) { error += "Invalid Percent<br />"; }

    //Outputting the accumulated errors
    var errors = document.querySelector("#errors");
    errors.innerHTML = error;

    //Only scramble if both the input and percent are valid
    if (inputValid && percentValid)
    {
        //Scramble Text
        //Want to try different types of scrambling
        //I know this is obviously not perfect but this is just a rough attempt 
        //to help visualize what different scrambles would be like

        //Finds number of letters to find how many need to be replaced based on percentage.
        //First parameter of replace is the whitespace character, used to remove spaces
        var strng = input.replace(/\s/g, '');
        //Finds the number of characters
        var count = strng.length
        //Finds the number of characters that need to be swapped
        //(total/percent)/2
        //The additional /2 is used because swapping a character
        //affects another character, so essentially half as many
        //changes are needed
        var chars = Math.ceil(count * (percent/100)/2);

        //Strings in js are immutable, once they are set they can be reset,
        //but they can't be modified like arrays like in c++
        //Workaround for string immutability, 
        //string now becomes an array with each character as an index
        //strng above is named as such for less work adapting new var into old code that uses string
        var string = strng.split("");

        //Splits the string into an array by whitespaces, may be useful for Scramble 2
        //but it is commented out for now as it is not beign used
        var array = input.split(/\s+/);
        console.log(array);
        //Finds the number of words in the array for manipulation purposes.
        var objs = Object.keys(array).length;
        chrs = Math.ceil(chars/objs);

        //Scramble 1 scrambles the whole string preserving spaces
        //So the number of characters of each word are preserved but
        //the letters of each word may be made up of letters from another word
        //i.e. "abc defg hij" -> "dib gjea cfh"
        //Medium difficulty to scramble as you have all the right letters
        //but no idea what letters belong to what word

        //Temp variable so we can keep track of remaining chars that need to be changed
        //without losing original for other scrambles
        var temp = chars;

        //Loop until enough characters have been scrambled
        while (temp > 0)
        {
            //for each letter flip coin and scramble if greater than 50
            //swapping the current letter with a random other letter
            for (let i = 0; i < string.length; i++)
            {
                rnd = Math.floor(Math.random() * 100);
                if (rnd > 50)
                {
                    temp--;
                    chr = Math.floor(Math.random() * string.length);
                    //Ensures that the letter being swapped is not the current letter, as that is a waste
                    while (chr === i) { chr = Math.floor(Math.random() * string.length); }

                    //Classic a becomes b, b becomes a swap
                    var tmp = string[i];
                    string[i] = string[chr];
                    string[chr] = tmp;
                }
                //Safety check to stop too many letters being scrambled in one loop
                if (temp === 0) { break; }
            }
        }

        //Putting spaces back in
        spaces(input, string);

        //Uses the same method as errors above to send output to the correct location
        var s1 = document.querySelector('#S1');
        s1.innerHTML = string.join("");

        //Scramble 2 scrambles each word preserving spaces
        //So each word has the correct letters but in the wrong order
        //i.e "abc defg hij" -> "bca fdge jhi"
        //Easiest to unscramble as each word can be solved one by one

        temp = chrs;
        string = strng.split("");

        for (word in array)
        {
            array[word] = array[word].split("");
            if (array[word].length === 1) { }
            else {
                console.log(array[word]);
                chrs = temp;
                while (chrs > 0)
                {
                    for (let i = 0; i < array[word].length; i++)
                    {
                        rnd = Math.floor(Math.random() * 100);
                        if (rnd > 50)
                        {
                            chrs--;
                            chr = Math.floor(Math.random() * array[word].length);
                            while (chr === i ) { chr = Math.floor(Math.random() * array[word].length); }

                            var tmp = array[word][i];
                            array[word][i] = array[word][chr];
                            array[word][chr] = tmp;
                        }
                        if (chrs === 0) { break; }
                    }
                }
            }
        }
        var s2 = document.querySelector('#S2');
        s2.innerHTML = "";
        for (word in array)
        {
            console.log(array[word]);
            s2.innerHTML += array[word].join("") + " ";
        }

        //Scramble 3 doesn't rearrange letter but instead
        //replaces random characters with another random character
        //while preserving spaces
        //i.e "abc defg hij" -> "akc dybh lix"
        //Hardest to unscramble as the letters given may not belong
        //to the word you are unscrambling. This gets exponentially harder
        //as the percentage of scrambling goes up, as potentially every single
        //letter could be replaced by one that isn't in that word and you would
        //have no idea which letters belong and which ones are replacements.

        //Resetting variables for next scramble
        temp = chars
        string = strng.split("");

        while (temp > 0)
        {
            for (let i = 0; i < string.length; i++)
            {
                rnd = Math.floor(Math.random() * 100);
                if (rnd > 50)
                {
                    temp--;
                    //Scramble is much easier for this type, as the 
                    //letters aren't moved, merely replaced with a random one
                    //generated by the randLetter function
                    string[i] = randLetter();
                }
                //Safety check to stop too many letters being scrambled in one loop
                if (temp === 0) { break; }
            }
        }
        //Putting spaces back in
        spaces(input, string);

        //Same output code as previous sections
        var s3 = document.querySelector('#S3');
        s3.innerHTML = string.join("");

    }
}
//Updates the number input to whatever the slider is
function updatePercent(percent) {
    document.querySelector('#percent').value = percent;
}

//Updates the slider input to whatever the number is
function updateSlider(percent) {
    //Small if statement to move slider to 0 if the user empties the 
    //number text box, as the default is to reset to 50
    if (percent === "") { percent = 0 }
    document.querySelector('#slide').value = percent;
}

document.querySelector('#percent').addEventListener('input', e=>{
    const elmnt = e.target || e

    if (elmnt.type === "number" && elmnt.max && elmnt.min){
        value = parseInt(elmnt.value);
        elmnt.value = value;
        max = parseInt(elmnt.max);
        min = parseInt(elmnt.min);
        if (value > max) { elmnt.value = elmnt.max; }
        if (value < min) { elmnt.value = elmnt.min; }
    }
});
module.exports scrambler; // possibly scramble
