import {BitStream} from 'bit-buffer';
import {RAND36State} from "./type";
import {encode as encodeKOI8U} from '../../utils/koi8-u';
import {fromByteArray} from "../../utils/base64";
import {crc16} from "../../utils/crc16";

const VERSION = 1;

function answerToBit3(answer: 0 | 1 | 2 | 3 | 4 | 5 | 6): number {
    return answer & 0b111; // Mask to 3 bits
}

export function encodeState(state: RAND36State): string {
    const { answers, profile: { name, birthDate } } = state;

    // Calculate size: 
    // - 4 bits version + 36 questions with 3 bits each (=14 bytes)
    // - 3 bytes for birthDate (24 bits)
    // - name KOI8-U encoded
    // - 2 bytes for checksum
    const sizeInBytes = (1 + 13) + 3 + name.length + 2;
    const bitStream = new BitStream(new ArrayBuffer(sizeInBytes));

    // Write format identifier (4 bits)
    bitStream.writeBits(VERSION, 4);

    // Write answers (3 bits each)
    for (const answer of answers) {
        bitStream.writeBits(answerToBit3(answer), 3);
    }

    // Write compact birthDate
    bitStream.writeBits(birthDate, 24);

    for (const byte of encodeKOI8U(name)) {
        bitStream.writeUint8(byte);
    }

    // Calculate and write checksum
    bitStream.index = 0;
    const body = bitStream.readArrayBuffer(sizeInBytes - 2);
    bitStream.writeUint16(crc16(body));

    // Convert to base64
    bitStream.index = 0;
    const binary = bitStream.readArrayBuffer(sizeInBytes);
    return fromByteArray(binary);
} 
