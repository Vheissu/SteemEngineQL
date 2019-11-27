import axios from 'axios';

export function usdFormat(val, decimal_limit, steemPrice, withoutFormatting = false) {
    const usd = val * steemPrice;

    if (decimal_limit != null && !isNaN(parseInt(decimal_limit))) {
        if (withoutFormatting) {
            return usd.toFixed(decimal_limit);
        } else {
            return '$' + addCommas(usd.toFixed(decimal_limit));
        }
    }

    if (usd >= 1) {
        if (withoutFormatting) {
            return usd.toFixed(2);
        } else {
            return '$' + addCommas(usd.toFixed(2));
        }
    } else if (usd >= 0.1) {
        if (withoutFormatting) {
            return usd.toFixed(3);
        } else {
            return '$' + usd.toFixed(3);
        }
    } else {
        if (withoutFormatting) {
            return usd.toFixed(5);
        } else {
            return '$' + usd.toFixed(5);
        }
    }
}

export function addCommas(nStr, currency?) {
    nStr += '';

    const x = nStr.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    const rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    if (x2 == '' && currency == 1) {
        x2 = '.00';
    }

    return x1 + x2;
}

export async function getPrices() {
    try {
        const request = await axios.get(`https://postpromoter.net/api/prices`, {
            headers: {
                'Origin': 'https://steem-engine.com',
                'Referer': 'https://steem-engine.com/?p=conversion_history',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
            }
        });

        return request.data;
    } catch {
        return null;
    }
}