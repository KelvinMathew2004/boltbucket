export const BASE_PRICE = 65000;

const getOptionPrice = (allOptions, category, name) => {
    if (!allOptions[category]) {
        return 0;
    }
    const item = allOptions[category].find(option => option.name === name);
    return item ? item.price : 0;
};

export const calculateTotalPrice = (selections, allOptions) => {
    if (!allOptions || Object.keys(allOptions).length === 0) {
        return BASE_PRICE;
    }
    
    let total = BASE_PRICE;
    total += getOptionPrice(allOptions, 'exterior', selections.exterior);
    total += getOptionPrice(allOptions, 'wheels', selections.wheels);
    total += getOptionPrice(allOptions, 'roof', selections.roof);
    total += getOptionPrice(allOptions, 'interior', selections.interior);
    return total;
};
