export const splitDecimals = (value) => {
    return value.toString().split('.');
};

export const commaSeparator = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const mathCeilDecimals = (value, decimal) => {
    let decimalLength = null;
    if ((value % 1) !== 0) {
        const amount = value.toString().split('.');
        if (amount && amount.length && amount[1]) {
            decimalLength = amount[1].length;
        }
    }

    if (decimalLength > 2) {
        value = value * (10 ** decimal);
        value = Math.ceil(value);
        value = value / (10 ** decimal);

        return value;
    }

    return value;
};

export const noExponent = (value) => {
    const data = String(value).split(/[eE]/);

    if (data.length === 1) {
        return data[0];
    }

    let z = '';
    const sign = this < 0 ? '-' : '';
    const str = data[0].replace('.', '');
    let mag = Number(data[1]) + 1;

    if (mag < 0) {
        z = sign + '0.';
        while (mag++) {
            z += '0';
        }
        return z + str.replace(/^\\-/, '');
    }

    mag -= str.length;

    while (mag--) {
        z += '0';
    }
    return str + z;
};
