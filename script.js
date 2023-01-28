api = '4bd7b47ded83d8fc3d3409055c606053'

//current weather variables
const iconImg = document.getElementById('weather-icon');
const loc = document.querySelector('#location');
const tempC = document.querySelector('.c');
const tempF = document.querySelector('.f');
const desc = document.querySelector('.desc');
const sunriseDOM = document.querySelector('.sunrise');
const sunsetDOM = document.querySelector('.sunset');
const currentWindSpeed = document.querySelector('.current-windspeed');
const currentWindDir = document.querySelector('.current-wind-direction');
const currentHumidity = document.querySelector('.current-humidity');

//variables for forecast
const forecastAddBtn = document.querySelector('.city-box');
const forecastInput = document.querySelector('#city-forecast-input');
const forecastTemp = document.querySelector('#forecast-temp');
const forecastCity = document.querySelector('#forecast-city-output');
const forecastDescription = document.querySelector('.weather-description');
const currentCityTemp = document.querySelector('.current-temp-text');
const currentCityName = document.querySelector('#bold-city');
const currentCityTime = document.querySelector('#time')
const forecastSunrise = document.querySelector('.current-sunrise');
const forecastSunset = document.querySelector('.current-sunset');
const forecastWindSpeed = document.querySelector('.windspeed-text');
const forecastWindDir = document.querySelector('.wind-direction-text');
const forecastHumidity = document.querySelector('.humidity-text');
const forecastVisibility = document.querySelector('.visibility-text')
const forecastCloudiness = document.querySelector('.cloud-text');
const forecastDewPoint = document.querySelector('.dewpoint-text');
const currentSearchHigh = document.querySelector('.high');
const currentSearchLow = document.querySelector('.low');
const currentSearchFeelsLike =document.querySelector('.feels-like');




//event listener load - fetch current location
window.addEventListener('load', () => { // need to refactor to a smaller function call fetching 
                                        // geolocation and weather
    let long;
    let lat;
    //accessing geolocation 
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => { //refactor to lat + lon function
            long = position.coords.longitude;
            lat = position.coords.latitude;
            const base = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&appid='+api+'&units=metric';
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
                const fahrenheit = (temp * 9) / 5 + 32;
                const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

                //converting epoch(Unix) time to GMT
                const sunriseGMT = new Date(sunrise * 1000);
                const sunsetGMT = new Date(sunset * 1000);

                //interacting with DOM to show data
                iconImg.src = getIcon(icon);
                loc.textContent = `${place}`;
                desc.textContent = `${description}`;
                tempC.textContent = `${Math.round(temp)}°C`;
                tempF.textContent = `${Math.round(fahrenheit)}°F`;
                sunriseDOM.textContent = `${sunriseGMT.toLocaleString(undefined, timeOptions)}`;
                sunsetDOM.textContent = `${sunsetGMT.toLocaleString(undefined, timeOptions)}`;
                currentWindSpeed.textContent =`${speed} MPH`;
                currentWindDir.textContent = `${convertDirection(deg)}`;
                currentHumidity.textContent = `${humidity}%`;
             console.log(data);
            });
        });
    }
});


//conversion wind Speed
function convertWindSpeed(val){
    return (Math.round(val * 2.23694));
}

//convert Temp to Farhenheit
function tempConversionF(val){
    return (Math.round((val - 273) * 9/5 + 32));
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

//get day name 
function getDayName(unix) {
    //create new date object, pass in unix time
    const date = new Date(unix * 1000);

// Use the getDay() method to get the day of the week as a number (0-6)
const dayOfWeek = date.getDay();

    // Create an array of day names
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Use the day of the week number to get the corresponding day name from the array
return dayNames[dayOfWeek];

}

//convert from meters to miles
function metersToMiles(meters){
    return Math.round(meters *  0.00062137);
}

//get icon from API call
function getIcon(icon) {
    return 'https://openweathermap.org/img/wn/'+icon+'@2x.png';
}

//local date to Timezone
function localDate(unix, object) {
    //assign unix time a date
    const date = new Date(unix);
    //assign the UTC offset in hours
    const localOffset = object.timezone_offset / 3600;
    //to get the desired offset, we will take the geo-local offset
    //and add the searched cities local offset
    const desiredOffset = (date.getTimezoneOffset() / 60) + localOffset;
    //to get the desired date, add the desired offset in milliseconds
    const desiredDate = new Date(date.getTime() + desiredOffset * 3600 * 1000);
    // Apply the timezone offset to the date object.
    return desiredDate;
}

function fiveDayForecast(data) {
    for(let i = 1; i <= 7; i++){
        document.querySelector('#day-' + i + '-description').textContent = getDayName(data.daily[i].dt);
        document.querySelector('#day-' + i + '-icon').src = getIcon(data.daily[i].weather[0].icon);
        document.querySelector('#day-' + i + '-max-temp').textContent = `High ${tempConversionF(data.daily[i].temp.max)}°F`;
        document.querySelector('#day-' + i + '-min-temp').textContent = `Low ${tempConversionF(data.daily[i].temp.min)}°F`;
    }
}

function displayForecastData(base, cityName){
    fetch(base).then((response) => response.json()) 
    // assign fetch 
     .then((data)=>{
                    console.log(data);
                    //variables from oneCall API data
                    const cityTime = data.current.dt;
                    const {
                            humidity,
                            wind_speed,
                            wind_deg,
                            sunrise,
                            sunset,
                            temp,
                            dew_point,
                            visibility,
                            clouds
                            } 
                           = data.current;
                    const {description, icon} = data.current.weather[0];
                    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
                    const actualTime = localDate(cityTime * 1000, data);
                    const actualSunrise = localDate(sunrise * 1000, data);
                    const actualSunset = localDate(sunset * 1000, data);
                    //city Info
                    currentCityName.textContent = `${cityName}`;
                    currentCityTime.textContent = `${actualTime.toLocaleDateString(undefined, dateOptions)} at ${actualTime.toLocaleString(undefined, timeOptions)}`;
                    //Search city current info
                    currentCityTemp.textContent = `${tempConversionF(temp)}°F`;
                    forecastDescription.textContent = `${description}`;
                    document.querySelector('.weather-icon').src = getIcon(icon);
                    
                    //Search City Atmospheric info        
                    forecastVisibility.textContent = `${metersToMiles(visibility)} mi`;
                    forecastDewPoint.textContent = `${tempConversionF(dew_point)}°F`;
                    forecastHumidity.textContent = `${humidity}%`;
                    forecastCloudiness.textContent = `${clouds}%`;
                    forecastWindSpeed.textContent = `${convertWindSpeed(wind_speed)} MPH`;
                    forecastWindDir.textContent = `${convertDirection(wind_deg)}`;
                    
                    //Search City Solar Details
                    forecastSunrise.textContent = `${actualSunrise.toLocaleString(undefined, timeOptions)}`;
                    forecastSunset.textContent = `${actualSunset.toLocaleString(undefined, timeOptions)}`;
                   
                    //display 5 day forecast info                       
                    fiveDayForecast(data);
    })
}

function searchedCity(Event){
    Event.preventDefault()
    //Search by city name input
    const base = 'https://api.openweathermap.org/geo/1.0/direct?q='+forecastInput.value+'&appid='+api;
    //get json response
    fetch(base).then((response) => response.json()) 
     // assign fetch lat & long for One Call API
    .then((data)=>{
        console.log(data);
        //variables from geo API
        //Lat  & Lon needed for onecall API
        const cityLat = data[0].lat;
        const cityLong = data[0].lon;
        const cityName = data[0].name;
        
        
        //One call API base decleration
        const oneCallBase = 'https://api.openweathermap.org/data/3.0/onecall?lat='+cityLat+'&lon='+cityLong+'&exclude=minutely,hourly&appid='+api;
        //Fectch and display forecast data
        displayForecastData(oneCallBase, cityName)        
    })
}


 //event listener for forecast submit
 forecastAddBtn.addEventListener('submit', searchedCity);

    