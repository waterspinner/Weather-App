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
var btn = document.querySelector('#add');
var city = document.querySelector('#city-output');
var descrip = document.querySelector('#description');
var tempMain = document.querySelector('#temp');
var sunriseSearch = document.querySelector('#sunrise-search');
var sunsetSearch = document.querySelector('#sunset-search');

//api returns temp in Kelvin, function to convert
function convertion(val){
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
        tempMain.innerHTML = `Temperature: <span>${convertion(temp).toFixed(2)}</span> F`;
        descrip.innerHTML = `Sky Conditions: <span>${description}</span>`;
        sunriseSearch.innerHTML = `Sunrise: <span>${sunriseGMT}</span>`;
        sunsetSearch.innerHTML = `Sunset: <span>${sunsetGMT}</span>`;

        console.log(data);
        
    })
})

console.log(temp);