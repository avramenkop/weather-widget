let search = document.querySelector('.search-icon');
let input = document.querySelector('#search-input');

let widget = document.querySelector('.widget');
let cityName = document.querySelector('.city-name');
let country = document.querySelector('.country');
let date = document.querySelector('.date');
let time = document.querySelector('.time');
let img = document.querySelector('.img img');
let humidity = document.querySelector('.humidity');
let wind = document.querySelector('.wind');
let sunrise = document.querySelector('.sunrise');
let sunset = document.querySelector('.sunset');
let temp = document.querySelector('.temp');
let feelsLike = document.querySelector('.feels-like');
let desc = document.querySelector('.desc');


const convertUnixTime = (unixTime) => {
// Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
    let date = new Date(unixTime * 1000);
// Hours part from the timestamp
    let hours = date.getHours();
// Minutes part from the timestamp
    let minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
    let seconds = "0" + date.getSeconds();

// Will display time in 10:30:23 format
    return formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

};


const showForecast = () => {
    let today = new Date().toDateString();
    let str ='';
    let requestString = {
        q: input.value,
        appid: '9f50f7b2323f8aa8e0c6356983dd7f40'
    };

    for(let key in requestString) {
        str += `${key}=${requestString[key]}&`
    }
    str = str.substring(0, str.length - 1);


    let weather = new Promise(resolve => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?${str}`)
            .then(data => resolve(data.json()))
    });

    let currentTime = new Promise(resolve => {
        fetch(
            `http://api.timezonedb.com/v2.1/get-time-zone?key=87AXC8OVX96V&format=json&by=zone&zone=Europe/${input.value}`
        )
            .then(data => resolve(data.json()))
    });


    Promise.all([weather, currentTime]).then(values => {
        widget.style.display = 'block';
        cityName.innerHTML = `<img src="img/marker.png" alt="marker"> ${values[0].name},`;
        country.textContent = values[0].sys.country;
        date.textContent = `${today.substr(4, 6)}, ${today.substr(11, 4)} - ${today.substr(0, 3)}`;
        time.textContent = values[1].formatted.slice(11, 16);
        img.src = `https://openweathermap.org/img/wn/${values[0].weather[0].icon}@2x.png`;
        humidity.textContent = `Humidity: ${values[0].main.humidity}%`;
        wind.textContent = `Wind: ${values[0].wind.speed}m/s`;
        sunrise.textContent = `Sunrise: ${convertUnixTime(values[0].sys.sunrise)}`;
        sunset.textContent = `Sunset: ${convertUnixTime(values[0].sys.sunset)}`;
        temp.innerHTML = `${Math.round(values[0].main.temp - 273)}&deg`;
        feelsLike.innerHTML = `Feels like: ${Math.round(values[0].main.feels_like - 273)}&deg`;
        desc.textContent = values[0].weather[0].main;
    });
    input.value = '';
};


search.onclick = showForecast;

input.onkeypress = (event) => {
    if(event.key == 'Enter') {
        showForecast();
    }
};

search.onmousedown = () => {
    search.style.border = '1px solid black';
};

search.onmouseup = () => {
    search.style.border = '';
};




