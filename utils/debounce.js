function debounce(func, delay) {
    let debounceTimeout;
    return function (...args) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => func.apply(this, args), delay);
    };
}
