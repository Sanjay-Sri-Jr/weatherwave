import { MapPin, Search, X } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { useCitySuggestions } from '../hooks/useCitySuggestions';

export function SearchBar({ onSearch, onLocationSearch, loading }) {
    const {
        query,
        setQuery,
        suggestions,
        searchLoading,
        showSuggestions,
        setShowSuggestions,
        clearSuggestions,
    } = useCitySuggestions();

    const searchRef = useRef();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setShowSuggestions]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
            setQuery("")
            clearSuggestions();
        }
    };
    const clearSearch = () => {
        setQuery("");
        clearSuggestions();
    };
    const handleSuggesionsClick = (city) => {
        if (!city?.name) return;
        onSearch(city);
        setQuery("");
        clearSuggestions();
    };
    return (
        <div className='relative w-full max-w-2xl' ref={searchRef}>
            <form className='relative' onSubmit={handleSubmit}>
                <div className='relative group'>
                    <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-60 w-5 h-5 group-focus-within:text-white transition-all' />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Search City...'
                        className='w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white-30 focus:border-white/40 transition-all duration-300 hover:bg-white/15'
                    //disabled={loading}
                    />
                    {/* Conditional rendering  */}

                    {query && (
                        <button 
                        type='button'
                        className='absolute right-14 top-1/2 transform -translate-y-1/2 text-white/50
                        hover:text-white transition-all p-1 rounded-full hover:bg-white/10'
                        onClick={clearSearch}>
                            <X className='w-5 h-5' />
                        </button>
                    )}

                    <button 
                    type='button'
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50
                    hover:text-white transition-all p-1 rounded-full hover:bg-white/10'
                    onClick={onLocationSearch} disabled={loading} >
                        <MapPin className='w-5 h-5' />
                    </button>
                </div>
            </form>


            {/* Conditional rendering */}
            {showSuggestions && ((suggestions?.length ?? 0) > 0 || searchLoading)
             &&(
                <div className='absolute top-full left-8 right-6 mt-3 bg-white/10 backdrop-blur-xl
                 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50'>

                    {/* Conditional rendering */}
                    {searchLoading ? (<div className='p-6 text-center text-white/70'>
                        <div className='animate-spin rounded-full h-6 w-6 border-2 border-white/30
                         border-t-white mx-auto'></div>
                        <p>Search Cities......</p>
                    </div>) : (
                        suggestions.map((city, index) => {
                            return (
                                <button className='w-full px-6 py-4 text-left hover:bg-white/10 transition-all
                            duration-200 flex items-center justify-between group border-b border-white/10
                            last:border-b-0'key={`${city.name}-${city.country}-${index}`} onClick={()=>handleSuggesionsClick(city)}>
                                <div>
                                    <div className='font-medium text-white group-hover:text-white/90'>
                                        {city.name}
                                        {/* Conditional rendering */}
                                        {city.state && (
                                            <span className='text-white/70'>,{city.state}</span>
                                        )}
                                    </div>
                                    <div className='text-sm text-white/60'>{city.country}</div>
                                </div>      
                                    <Search className='w-4 h-4 text-white/40 group-hover:text-white/60
                            transition-all'/>
                                </button>
                            )
                        })
                    )}


                </div>
            )}
        </div>
    )
}

export default SearchBar