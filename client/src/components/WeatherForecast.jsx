import { Calendar } from 'lucide-react'
import React from 'react'
import ForecastItem from './ForecastItem';

function WeatherForecast({ forecast, unit, dayLabelFormatter = (index) => (index === 0 ? 'Today' : null) }) {

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
            {dailyItems.map((item,index) => (
                <ForecastItem
                    key={item.dt}
                    item={item}
                    unit={unit}
                    dayLabel={dayLabelFormatter(index, item)}
                />
            ))}
        </div>
    </div>
    );
  
}

export default WeatherForecast