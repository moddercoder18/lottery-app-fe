export const generateQuickPicArray = (n, length) => {
    const nums = new Set();
    while (nums.size !== n) {
        nums.add(Math.floor(Math.random() * length) + 1);
    }
    const result = [...nums].sort();
    return result
}

export const firstCapital = (str) => {
    const str2 = str.charAt(0).toUpperCase() + str.slice(1);
    return str2;
}

export const factorialCount = (count) => {
    let fact = 1;
    for (let i = 1; i <= count; i++) {
        fact *= i;
    }
    return fact
}

export const dateFormat = (date = new Date()) => {
    console.log('date', date)
}