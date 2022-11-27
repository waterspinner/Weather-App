api = '4bd7b47ded83d8fc3d3409055c606053'

const iconImg = document.getElementById('weather-icon');
const loc = document.querySelector('#location');
const tempC = document.querySelector('.c');
const tempF = document.querySelector('.f');
const desc = document.querySelector('.desc');
const sunriseDOM = document.querySelector('.sunrise');
const sunsetDOM = document.querySelector('.sunset');

window.addEventListener('load', () => {
    let long;
    let lat;
    //accessing geolocation 
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            const base = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&appid='+api+'&units=metric';
           // console.log(base);
            //using fetch to get data
            fetch(base).then((response) => {
                return response.json();
            })
            .then((data) => {
                const {temp} = data.main
                const place = data.name
                const { description, icon } = data.weather[0];
                const { sunrise, sunset } = data.sys;

                const iconURL = 'https://openweathermap.org/img/wn/'+icon+'@2x.png';
                const fahrenheit = (temp * 9) / 5 + 32;

                //converting epoch(Unix) time to GMT
                const sunriseGMT = new Date(sunrise * 1000);
                const sunsetGMT = new Date(sunset * 1000);

                //interacting with DOM to show data
                iconImg.src = iconURL;
                loc.textContent = `${place}`;
                desc.textContent = `${description}`;
                tempC.textContent = `${temp.toFixed(2)} *C`;
                tempF.textContent = `${fahrenheit.toFixed(2)} *F`;
                sunriseDOM.textContent = `${sunriseGMT}`;
                sunsetDOM.textContent = `${sunsetGMT}`;

                console.log(position);
            });
        });
    }
});


console.log(GeolocationPosition);
console.log(GeolocationCoordinates);


//search bar function 



//determing the constant of one of the id functions
var inputVal = document.querySelector('#city-input');
var btn = document.querySelector('#current-add');
var city = document.querySelector('#city-output');
var descrip = document.querySelector('#description');
var tempMain = document.querySelector('#temp');
var sunriseSearch = document.querySelector('#sunrise-search');
var sunsetSearch = document.querySelector('#sunset-search');

//api returns temp in Kelvin, function to convert
function conversion(val){
    return (val - 273) * 9/5 + 32;
}

//collect info with fetch
btn.addEventListener('click', () => {
    const base = 'https://api.openweathermap.org/data/2.5/weather?q='+inputVal.value+'&appid='+api;

    fetch(base).then((response) => {
        return response.json();
    })

    .then(data => {
        //collect info from fetch
        var nameVal = data.name;
        var {description} = data.weather[0];
        var {temp} = data.main;
        var { sunrise, sunset } = data.sys;
        const sunriseGMT = new Date(sunrise * 1000);
        const sunsetGMT = new Date(sunset * 1000);

        city.innerHTML = `Weather of <span>${nameVal}</span>`;
        tempMain.innerHTML = `Temperature: <span>${conversion(temp).toFixed(2)}</span> F`;
        descrip.innerHTML = `Sky Conditions: <span>${description}</span>`;
        sunriseSearch.innerHTML = `Sunrise: <span>${sunriseGMT}</span>`;
        sunsetSearch.innerHTML = `Sunset: <span>${sunsetGMT}</span>`;

        console.log(data);
        
        
    })
})

console.log(temp);

//5 day forecast 3hr Int.

//variables for forecast
 var forecastAddBtn = document.querySelector('#forecast-add');
 var forecastInput = document.querySelector('#city-forecast-input');
 var forecastDisplay = document.querySelector('#forecast-display');
 var forecastCity = document.querySelector('#forecast-city-output');

 //event listener for forecast submit
 forecastAddBtn.addEventListener('click', () => {
    const base = 'https://api.openweathermap.org/data/2.5/forecast?q='+forecastInput.value+'&appid='+api;
    //get json response
    fetch(base).then((response) => {
        return response.json();
    }) 
    // assign fetch 
    .then((fetchResponse)=>{
        console.log(fetchResponse);
        let forecastCityString = `5 Day forecast for <span>${fetchResponse.city.name}`;
        forecastCity.innerHTML = forecastCityString;
        
        //iteration through array
        for( threeHourInt of fetchResponse.list) {
            var {temp} = threeHourInt.main
            let forecastString = `Temp at <span>${threeHourInt.dt_txt}<span> is <span>${conversion(temp).toFixed(2)} *F`;
            forecastDisplay.innerHTML+= forecastString;
        
        }
    })
});
//go through forecast and assign time object?
    /* need to assign time.temp, time.description, time.windspeed, time.winddirection
    Some sort of iteration, possibly assiging all properties during the iteration of dt? 
    */
    
//assign data to variables put down in hmtl