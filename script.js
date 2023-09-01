let userTab = document.querySelector("[data-userDataTab]")
let searchTab = document.querySelector("[data-searchDataTab]")
let weatherDiv = document.querySelector(".weather_div")
let grant_location_container = document.querySelector(".grant_location_container")
let searchForm = document.querySelector(".form_container")
let loadingContainer = document.querySelector(".loading_container")
let weather_info_container = document.querySelector(".weather_info_container")
let grantBtn = document.querySelector("[data-grantBtn]")
let searchInput = document.querySelector("[data-searchinput]")
let searchBtn = document.querySelector(".searchBtn")
let not_found_div = document.querySelector(".not_found_div")

let cityName = document.querySelector('[data-cityName]')
let countryIcon = document.querySelector('[data-countryIcon]')
let weatherDesc = document.querySelector('[data-weatherDesc]')
let weatherDescIcon = document.querySelector('[data-weatherDescIcon]')
let temp = document.querySelector('[data-temp]')
let windspeed = document.querySelector('[data-windspeed]')
let humidity = document.querySelector('[data-humidity]')
let clouds = document.querySelector('[data-clouds]')


// initially variable needed
let currentTab = userTab;
let API_KEY = '4dd0bff775d6d9aaf0d2fe1b603dc698';
let demoCityName = 'delhi'
let lat = ''
let lon = ''
let city = ''

currentTab.classList.add("current-tab")
// grant_location_container.classList.add("active")

let currentDataUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

let cityDataUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`


const renderWeatherData = (data) => {

    console.log(data.sys.country.toLowerCase());
    http://openweathermap.org/images/flags/{{weather.sys.country.toLowerCase()}}.png

    cityName.textContent = data?.name
    countryIcon.src = `http://openweathermap.org/images/flags/${data?.sys?.country.toLowerCase()}.png`;
    weatherDesc.textContent = data?.weather[0]?.description
    weatherDescIcon.src = `https://openweathermap.org/img/w/${data?.weather[0]?.icon}.png`
    temp.textContent = `${data.main.temp} °C`
    windspeed.textContent = `${data?.wind?.speed}m/s`
    humidity.textContent = `${data?.main?.humidity}%`
    clouds.textContent = `${data?.clouds?.all}%`
}

const fetchUserWeatherData = async (userCoords) => {

    try {
        loadingContainer.classList.add("active")
        currentDataUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        let res = await fetch(currentDataUrl);
        let data = await res.json();
        console.log(data);
        loadingContainer.classList.remove('active')
        weather_info_container.classList.add("active")
        renderWeatherData(data)
    } catch (error) {
        console.log(error);
        loadingContainer.classList.remove('active')
        alert("wrong requets")
    }

}

const fetchCityWeatherData = async () => {
    try {
        loadingContainer.classList.add("active")
        cityDataUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        let res = await fetch(cityDataUrl)
        let data = await res.json()
        // console.log(data);
        loadingContainer.classList.remove("active")
        weather_info_container.classList.add("active")
        not_found_div.classList.remove("active")
        renderWeatherData(data)
    } catch (error) {
        weather_info_container.classList.remove("active")
        not_found_div.classList.add("active")
    }
}

const checkCordinates = () => {

    if (currentTab == userTab) {

        not_found_div.classList.remove("active")
        let StringCoords = sessionStorage.getItem("user-coordinates");
        let coords = JSON.parse(StringCoords)

        if (coords) {
            grant_location_container.classList.remove("active")
            lat = coords.lat
            lon = coords.lon
            currentDataUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            fetchUserWeatherData(coords)
        } else {
            grant_location_container.classList.add('active')
            // alert("grant location first")
        }
    }
    else if (currentTab == searchTab) {
        grant_location_container.classList.remove("active")
        searchForm.classList.add("active")
    }
}

checkCordinates()


const handleTab = (e) => {

    if (e.target != currentTab) {
        currentTab.classList.remove("current-tab")
        currentTab = e.target;
        currentTab.classList.add("current-tab")


        if (currentTab == userTab) {
            weather_info_container.classList.remove("active")
            searchForm.classList.remove("active")
            checkCordinates()
        } else if (currentTab == searchTab) {
            grant_location_container.classList.remove("active")
            weather_info_container.classList.remove('active')
            searchForm.classList.add("active")

        }

    }
}


const showPosition = (position) => {
    // console.log(position.coords);
    // grant_location_container.classList.remove("active")
    let userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates))
    let userCoords = JSON.parse(sessionStorage.getItem("user-coordinates"))
    lat = userCoords.lat
    lon = userCoords.lon
    currentDataUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    fetchUserWeatherData()
    // console.log(lat);
    // console.log(lon);
}


const getLocation = () => {
    if (navigator.geolocation) {
        grant_location_container.classList.remove("active")
        loadingContainer.classList.add("active")
        navigator.geolocation.getCurrentPosition(showPosition)
    } else {
        alert('no support available')
    }
}

const getInputValue = (e) => {
    e.preventDefault();
    if (searchInput.value) {
        city = searchInput.value
        searchInput.value = ''
        fetchCityWeatherData()
        console.log(city);
    } else {
        alert("enter city name")
    }
}

searchTab.addEventListener("click", handleTab)
userTab.addEventListener("click", handleTab)

grantBtn.addEventListener("click", getLocation)

searchBtn.addEventListener("click", getInputValue)