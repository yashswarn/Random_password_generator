const gen_pass_btn = document.querySelector(".generate-password-btn")
const display_pass = document.querySelector("[data-passwordDisplay]");
const copy_btn = document.querySelector("[data-copy]");
const password_copymsg = document.querySelector("[password-copymsg]");
const data_lengthNumber = document.querySelector("[data-lengthNumber]");
const password_lengthSlider = document.querySelector("[password-lengthSlider]")
const upper_case = document.querySelector("#uppercase")
const lower_case = document.querySelector("#lowercase")
const number_case = document.querySelector("#numbers")
const symbol_case = document.querySelector("#symbols")
const indicator = document.querySelector("[password-indicator]")
const allCheckBoxes = document.querySelectorAll("input[type=checkbox]")
const symbols= '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let passwordLength=10;
let checkCount;
let password="";
handleSlide();

setIndicator("#cgg")

function handleSlide(){
    password_lengthSlider.value=passwordLength;
    data_lengthNumber.innerText=passwordLength;
    const min=password_lengthSlider.min;
    const max=password_lengthSlider.max;
    password_lengthSlider.style.backgroundSize= ((passwordLength-min)*100 / (max-min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol(){
    const rndNum=getRndInteger(0,symbols.length)
    return symbols.charAt(rndNum);
}

function calStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(upper_case.checked){
        hasUpper=true;
    }
    if (lower_case.checked) {
        hasLower=true;
    }
    if (number_case.checked) {
        hasNum=true;
    }
    if (symbol_case.checked) {
        hasSym=true;
    }

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0")
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0")
    }
    else{
        setIndicator("#f00");
    }
}

async function copyPassword(){
    try{
        await navigator.clipboard.writeText(display_pass.value)
        password_copymsg.innerText="Copied";
    }
    catch(e){
        password_copymsg.innerText="Failed to copied password";
    }

    // to make copy wala span visible 
    password_copymsg.classList.add("active");

    setTimeout(()=>{
        password_copymsg.classList.remove("active");
    },2000)
}

function shufflePassword(array){
    for(let i=array.length-1 ;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));

        // swap index i and j
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }

    let str = "";
    array.forEach((el)=>(str+=el));
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBoxes.forEach((checkbox)=>{
        if (checkbox.checked) {
            checkCount++;
        }
        // console.log(checkCount);
    })

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlide();
    }
}

allCheckBoxes.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

password_lengthSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlide();
})

copy_btn.addEventListener('click',()=>{
    if (display_pass.value) {
        copyPassword();
    }
})

gen_pass_btn.addEventListener('click',()=>{

    // if no checkbox is selected then
    if(checkCount==0) {
        return ;
    }

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlide();
    }

    console.log("lets start the journey to generate new passwords");

    password="";

    let funcArr=[];

    if (upper_case.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lower_case.checked) {
        funcArr.push(generateLowerCase);
    }
    if (symbol_case.checked) {
        funcArr.push(generateSymbol)
    }
    if (number_case.checked) {
        funcArr.push(generateRandomNumber)
    }

    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    console.log("compulsary addition done")

    // remainning addition

    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRndInteger(0,funcArr.length);
        console.log("random index is:",randIndex);
        password += funcArr[randIndex]();
    }

    console.log("raming addition is also done now take forwad for the last step")
    
    // now shuffle the password
    password=shufflePassword(Array.from(password))
    console.log("shuffling done now the last step");

    display_pass.value = password;
    console.log("ui addition is done")

    // calculate strength of the password
    calStrength();


});
