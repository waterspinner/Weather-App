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

//convert from m/s to mph
function convertWindSpeed(val){
    return val * 2.23694;
}

//convert wind direction to cardinal direction
function convertDirection(val) {
    let direction = "";
    if (val >= 340 || val < 30){
        return direction = "North";
    }
    else if (val >= 30 && val < 70){
        return direction = "North East";
    }
    else if (val >= 70 && val < 120){
        return direction = "East";
    }
    else if (val >= 120 && val < 150){
        return direction = "South East";
    }
    else if (val >= 150 && val < 210){
        return direction = "South";
    }
    else if (val >= 210 && val < 240){
        return direction = "South West";
    }
    else if (val >= 240 && val < 290){
        return direction = "West";
    }
    else {
        return direction = "North West";
    }    
};
//variables for forecast
 var forecastAddBtn = document.querySelector('#forecast-add');
 var forecastInput = document.querySelector('#city-forecast-input');
 var forecastTemp = document.querySelector('#forecast-temp');
 var forecastCity = document.querySelector('#forecast-city-output');
 var forecastDescription = document.querySelector('#weather-description');

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
        console.log(fetchResponse.list[0].weather[0].description);
        //iteration through array
        for( threeHourInt of fetchResponse.list) {
            //assining data to variables
            var {temp} = threeHourInt.main;
            var {description} = threeHourInt.weather[0];
            var {speed} = threeHourInt.wind;
            var {deg} = threeHourInt.wind;

            //create new element for temp and time
                const newTemp = document.createElement("p");

            //assing ID value of new element
                newTemp.setAttribute("class", "forecast-temp");

            //create string and append to created element
                const tempString = document.createTextNode(`Temp at ${threeHourInt.dt_txt} is ${conversion(temp).toFixed(2)} *F`);
                newTemp.appendChild(tempString);
                console.log(newTemp.classList);

            //repeat process for weather description
                const newDescription = document.createElement("p");
                const descriptionString = document.createTextNode(`Weather: ${description}`)
                newDescription.appendChild(descriptionString);

            //repeat process for Wind speed
                const windSpeed = document.createElement("p");
                const windString = document.createTextNode(`Wind speed is ${convertWindSpeed(speed).toFixed(1)}mph`)
                windSpeed.appendChild(windString);

            //repeat process for wind direction
                const windDirection = document.createElement("p");
                const directionString = document.createTextNode(`Wind Direction: ${convertDirection(deg)}`);
                windDirection.appendChild(directionString);

            //append newly created elements to existing element in document
                const currentP = document.getElementById("forecast-display");
                currentP.appendChild(newTemp);
                currentP.appendChild(newDescription);
                currentP.appendChild(windSpeed);
                currentP.appendChild(windDirection);

        }
    })
});