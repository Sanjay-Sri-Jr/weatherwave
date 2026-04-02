const BASE_URL= import.meta.env.VITE_BASE_URL;
const API_KEY= import.meta.env.VITE_WEATHER_API_KEY;
export const fetchCurrentWeather=async(city)=>{
    const response=await fetch(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if(response.status!==200){
        throw new Error(`Error ${response.status} : ${response.statusText}`)
    }
    return response.json()
}