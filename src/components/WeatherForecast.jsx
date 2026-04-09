import { Calendar, Droplet, Droplets } from 'lucide-react'
import React from 'react'
import * as LucideIcons from 'lucide-react'
import { formatDate, formatTemperature, getWeatherIcon } from '../utils/weatherUtils';
function WeatherForecast({forecast,unit}) {

    if (!forecast?.list?.length) {
        return null;
    }

    const dailyForecast = forecast.list.reduce((acc, item) => {

        const date = new Date(item.dt * 1000).toDateString();
        if (!acc[date]) {
            acc[date] = item;
        }
        return acc;
    }, {});

    const dailyItems= Object.values(dailyForecast).slice(0, 5);
    return (
    <div className='bg-white/18 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl'>
        <div className='flex items-center space-x-3 mb-8'>
            <div className='p-2 bg-white/10 rounded-full'>
            <Calendar className='w-6 h-6 text-white/80'></Calendar>
            </div>
            <h2 className='text-2xl dont-bold text-white'> 5 Day Forecast</h2>
        </div>
        <div className='space-y-4'>
            {/* Map method logic */}
            {dailyItems.map((item,index) => { 
                const iconName=getWeatherIcon(item.weather[0]);
                const IconComponent = LucideIcons[iconName] || LucideIcons['Cloud'];
                return (
                <div key={item.dt} className='flex itens-center justify-between p-5 bg-white/5 backdrop-blur-sm
            rounded-2xl hover:bg-white/10 transition-all duration-300 group border border-white/10'>
                <div className='flex items-center space-x-5 flex-1'>
                    <div className='text-white/90 group-hover:text-white transition-all transform
                    group-hover:scale-110 duration'>
                        {/* Dynamic icon */}
                        <IconComponent size={40} />
                    </div>
                    <div className='flex-1'>
                        <div className='text-white font-semibold text-lg'>
                            {/* Conditional Date */}
                            {index === 0 ? 'Today' : formatDate(item.dt)}
                        </div>
                        <div className='text-white/70 text-sm capitalize font-medium'>
                            {item.weather[0].description}
                        </div>
                    </div>
                </div>
                <div className='flex items-center space-x-6'>
                    <div className='flex items-center space-x-2 text-white/60'>
                        <Droplets className='w-5 h-5 text-blue-500'/>
                        <span className='text-sm font-medium'>
                            {/* Dynamic Details */}
                            {Math.round(item.pop * 100)}%
                        </span>
                    </div>
                    <div className='text-right'>
                        <div className='text-white font-bold text-xl'>
                            {formatTemperature(item.main.temp_min, unit)}°</div>
                        <div className='text-white text-sm font-medium'>
                            {formatTemperature(item.main.temp_max, unit)}°</div>
                    </div>
                </div>
            </div>
            );
            })}
        </div>
    </div>
    );
  
}

export default WeatherForecast