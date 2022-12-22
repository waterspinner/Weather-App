api = '4bd7b47ded83d8fc3d3409055c606053'

const iconImg = document.getElementById('weather-icon');
const loc = document.querySelector('#location');
const tempC = document.querySelector('.c');
const tempF = document.querySelector('.f');
const desc = document.querySelector('.desc');
const sunriseDOM = document.querySelector('.sunrise');
const sunsetDOM = document.querySelector('.sunset');
const currentWindSpeed = document.querySelector('.current-windspeed');
const currentWindDir = document.querySelector('.current-wind-direction');

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
                const {temp, humidity} = data.main
                const place = data.name
                const { description, icon } = data.weather[0];
                const { sunrise, sunset } = data.sys;
                const {deg, speed} = data.wind;

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
                currentWindSpeed.textContent =`${speed}`;
                currentWindDir.textContent = `${deg}`;



             console.log(data);
            });
        });
    }
});


//conversion functions
function convertWindSpeed(val){
    return val * 2.23694;
}

function tempConversionF(val){
    return ((val - 273) * 9/5 + 32).toFixed(2);
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
 var currentCityTemp = document.querySelector('.current-temp');
 var currentCityName = document.querySelector('.current-city-name');
 var currentCityTime = document.querySelector('.current-city-time')
 var forecastSunrise = document.querySelector('.current-sunrise');
 var forecastSunset = document.querySelector('.current-sunset');

 //event listener for forecast submit
 forecastAddBtn.addEventListener('click', () => {
    const base = 'http://api.openweathermap.org/geo/1.0/direct?q='+forecastInput.value+'&appid='+api;
   

    //get json response
    fetch(base).then((response) => response.json()) 
     // assign fetch lat & long for One Call API
    .then((data)=>{
        console.log(data);
        //variables from geo API
        const cityLat = data[0].lat;
        const cityLong = data[0].lon;
        const cityName = data[0].name;
        

        //One call API base decleration
        const oneCallBase = 'https://api.openweathermap.org/data/3.0/onecall?lat='+cityLat+'&lon='+cityLong+'&exclude=minutely,hourly&appid='+api;
        console.log(oneCallBase)
        fetch(oneCallBase).then((response) => response.json()) 
        // assign fetch 
        .then((data)=>{
            console.log(data);
            //variables from oneCall API data
            const currentTemp = data.current.temp;
            const currentSunrise = data.current.sunrise;
            const currentSunset = data.current.sunset;
            const cityTime = data.current.dt;

            const sunriseGMT = new Date(currentSunrise * 1000);
            const sunsetGMT = new Date(currentSunset * 1000);
            const currentTimeGMT = new Date(cityTime * 1000);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

            const actualDate = currentTimeGMT.toLocaleDateString(undefined, options);
            const actualTime = currentTimeGMT.toLocaleString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });

            console.log(sunriseGMT);
            console.log(sunsetGMT);

            currentCityName.textContent = `${cityName}`;
            currentCityTime.textContent = `${actualDate} at ${actualTime}`;
            currentCityTemp.textContent = `Temp: ${tempConversionF(currentTemp)}`;
            forecastSunrise.textContent = `${sunriseGMT}`;
            forecastSunset.textContent = `${sunsetGMT}`;


        })
    })
})

    