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
                tempC.textContent = `${temp.toFixed(2)}°C`;
                tempF.textContent = `${fahrenheit.toFixed(2)}°F`;
                sunriseDOM.textContent = `${sunriseGMT}`;
                sunsetDOM.textContent = `${sunsetGMT}`;
                currentWindSpeed.textContent =`${speed} MPH`;
                currentWindDir.textContent = `${convertDirection(deg)}`;



             console.log(data);
            });
        });
    }
});


//conversion functions
function convertWindSpeed(val){
    return (val * 2.23694).toFixed(2);
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


//variables for forecast
 var forecastAddBtn = document.querySelector('#forecast-add');
 var forecastInput = document.querySelector('#city-forecast-input');
 var forecastTemp = document.querySelector('#forecast-temp');
 var forecastCity = document.querySelector('#forecast-city-output');
 var forecastDescription = document.querySelector('.weather-description');
 var currentCityTemp = document.querySelector('.current-temp');
 var currentCityName = document.querySelector('#bold-city');
 var currentCityTime = document.querySelector('#time')
 var forecastSunrise = document.querySelector('.current-sunrise');
 var forecastSunset = document.querySelector('.current-sunset');
 var forecastWindSpeed = document.querySelector('.windspeed');
 var forecastWindDir = document.querySelector('.wind-direction');
 var forecastHumidity = document.querySelector('.humidity');
 var day1Descrtiption = document.querySelector('.day-1-description')

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

//Get local date object for searched cities
function localDate(unix) {
    const date = new Date();
    const timestamp = unix;
    const offset = date.getTimezoneOffset() * 60000;
    const utc = timestamp + offset;
    const updatedDate = new Date(utc + 1000 * data.timezone);
    return updatedDate;
}

            console.log(data);
            //variables from oneCall API data
           // const iconURL = 'https://openweathermap.org/img/wn/'+icon+'@2x.png';

            //getting search city current info
            const cityTime = data.current.dt;
            const {humidity, wind_speed, wind_deg, sunrise, sunset, temp} = data.current;
            const {description} = data.current.weather[0];
            const {timezone} = data;

            const sunriseGMT = new Date(sunrise * 1000);
            const sunsetGMT = new Date(sunset * 1000);
            const currentTimeGMT = new Date(cityTime * 1000);
            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

            const actualDate = currentTimeGMT.toLocaleDateString(undefined, dateOptions);
            const actualTime = currentTimeGMT.toLocaleString(undefined, timeOptions);
            const actualSunrise = sunriseGMT.toTimeString(timezone, timeOptions)
            const actualSunset = sunsetGMT.toTimeString(timezone, timeOptions);

            //getting search city forecast info


//need to use timezone offset I think to display the sunset and
//sunrise time in the searched cities timezone.

            //display current info
            currentCityName.textContent = `${cityName}`;
            currentCityTime.textContent = `${actualDate} at ${actualTime}`;
            currentCityTemp.textContent = `Temp: ${tempConversionF(temp)}°F`;
            forecastSunrise.textContent = `Sunrise: ${actualSunrise}`;
            forecastSunset.textContent = `Sunset: ${actualSunset}`;
            forecastWindSpeed.textContent = `Wind Speed: ${convertWindSpeed(wind_speed)} MPH`;
            forecastWindDir.textContent = `Wind Direction: ${convertDirection(wind_deg)}`;
            forecastDescription.textContent = `Weather Description: ${description}`;
            forecastHumidity.textContent = `Humidity: ${humidity}%`;

            //display 5 day forecast info
            document.querySelector('#day-1-description').textContent = getDayName(data.daily[1].dt);
            document.querySelector('#day-2-description').textContent = getDayName(data.daily[2].dt);
            document.querySelector('#day-3-description').textContent = getDayName(data.daily[3].dt);
            document.querySelector('#day-4-description').textContent = getDayName(data.daily[4].dt);
            document.querySelector('#day-5-description').textContent = getDayName(data.daily[5].dt);
            document.querySelector('#day-1-max-temp').textContent = `High ${tempConversionF(data.daily[1].temp.max)}`;
            document.querySelector('#day-2-max-temp').textContent = `High ${tempConversionF(data.daily[2].temp.max)}`;
            document.querySelector('#day-3-max-temp').textContent = `High ${tempConversionF(data.daily[3].temp.max)}`;
            document.querySelector('#day-4-max-temp').textContent = `High ${tempConversionF(data.daily[4].temp.max)}`;
            document.querySelector('#day-5-max-temp').textContent = `High ${tempConversionF(data.daily[5].temp.max)}`;
            document.querySelector('#day-1-min-temp').textContent = `Low ${tempConversionF(data.daily[1].temp.min)}`;
            document.querySelector('#day-2-min-temp').textContent = `Low ${tempConversionF(data.daily[2].temp.min)}`;
            document.querySelector('#day-3-min-temp').textContent = `Low ${tempConversionF(data.daily[3].temp.min)}`;
            document.querySelector('#day-4-min-temp').textContent = `Low ${tempConversionF(data.daily[4].temp.min)}`;
            document.querySelector('#day-5-min-temp').textContent = `Low ${tempConversionF(data.daily[5].temp.min)}`;
        })
    })
})

    