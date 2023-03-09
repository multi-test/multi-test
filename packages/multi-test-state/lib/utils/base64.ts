// Copied and slightly modified from: https://github.com/beatgammit/base64-js

const lookup: string[] = [];
const revLookup: number[] = [];

{
    const code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    for (let i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
    }

    // Support decoding URL-safe base64 strings, as Node.js does.
    // See: https://en.wikipedia.org/wiki/Base64#URL_applications
    revLookup['-'.charCodeAt(0)] = 62;
    revLookup['_'.charCodeAt(0)] = 63;
}

function getLens(b64: string): [number, number] {
    const len = b64.length;

    if (len & 3) {
        throw new Error('Invalid string. Length must be a multiple of 4')
    }

    // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42
    let validLen = b64.indexOf('=');
    if (validLen === -1) {
        validLen = len;
    }

    // 0 to 3 characters of padding so total length is a multiple of 4
    const placeHoldersLen = 3 - ((validLen + 3) & 3);

    return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
export function byteLength (b64: string): number {
    const [validLen, placeHoldersLen] = getLens(b64);

    return _byteLength(validLen, placeHoldersLen)
}

function _byteLength (validLen: number, placeHoldersLen: number): number {
    return (((validLen + placeHoldersLen) * 3) >> 2) - placeHoldersLen;
}

export function toByteArray(b64: string): Uint8Array {
    let i: number;
    let tmp: number;
    const lens = getLens(b64);
    const [validLen, placeHoldersLen] = lens;

    const arr = new Uint8Array(_byteLength(validLen, placeHoldersLen));

    let curByte = 0;

    // if there are placeholders, only get up to the last complete 4 chars
    const len = placeHoldersLen
        ? validLen - 4
        : validLen;

    for (i = 0; i < len; i += 4) {
        tmp =
            revLookup[b64.charCodeAt(i)] << 18 |
            revLookup[b64.charCodeAt(i + 1)] << 12 |
            revLookup[b64.charCodeAt(i + 2)] << 6 |
            revLookup[b64.charCodeAt(i + 3)];

        arr[curByte++] = tmp >> 16 & 0xFF;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }

    if (placeHoldersLen === 2) {
        arr[curByte] =
            revLookup[b64.charCodeAt(i)] << 2 |
            revLookup[b64.charCodeAt(i + 1)] >> 4
    } else if (placeHoldersLen === 1) {
        tmp =
            revLookup[b64.charCodeAt(i)] << 10 |
            revLookup[b64.charCodeAt(i + 1)] << 4 |
            revLookup[b64.charCodeAt(i + 2)] >> 2;

        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte] = tmp & 0xFF;
    }

    return arr;
}

function tripletToBase64(num: number): string {
    return lookup[num >> 18 & 0x3F] +
        lookup[num >> 12 & 0x3F] +
        lookup[num >> 6 & 0x3F] +
        lookup[num & 0x3F]
}

function encodeChunk (uint8: number[] | Uint8Array, start: number, end: number): string {
    let i = start, curTriplet = 0;
    const output = new Array((end - start) / 3);

    for (; i < end; i += 3) {
        output[curTriplet++] = tripletToBase64(
            (uint8[i] & 0xFF) << 16 |
            (uint8[i + 1] & 0xFF) << 8 |
            (uint8[i + 2] & 0xFF)
        )
    }

    return output.join('');
}

export function fromByteArray(uint8: number[] | Uint8Array): string {
    let tmp: number;
    const len = uint8.length;
    const extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
    const len2 = len - extraBytes;
    const maxChunkLength = 16383; // must be multiple of 3
    const parts = new Array(
        Math.ceil(len2 / maxChunkLength) +
        (extraBytes ? 1 : 0)
    );

    let curChunk = 0;

    // go through the array every three bytes, we'll deal with trailing stuff later
    let i = 0, nextI;
    for (; i < len2; i = nextI) {
        nextI = i + maxChunkLength;
        parts[curChunk++] = encodeChunk(uint8, i, Math.min(nextI, len2))
    }

    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
        tmp = uint8[len2] & 0xFF;
        parts[curChunk] =
            lookup[tmp >> 2] +
            lookup[tmp << 4 & 0x3F] +
            '=='
    } else if (extraBytes === 2) {
        tmp = (uint8[len2] & 0xFF) << 8 | (uint8[len2 + 1] & 0xFF);
        parts[curChunk] =
            lookup[tmp >> 10] +
            lookup[tmp >> 4 & 0x3F] +
            lookup[tmp << 2 & 0x3F] +
            '=';
    }

    return parts.join('');
}