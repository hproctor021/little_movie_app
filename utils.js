const debounce = (func, delay = 1000) => {
    let timeoutId;
    return ( ...args ) => {
        if( timeoutId ){
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args)
            // .apply looks at given args if more than 1 & applies individually
        }, delay)
    }
}