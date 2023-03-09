import {BitStream} from 'bit-buffer';
import {CattellState} from "./type";
import {encode as encodeKOI8U} from '../../utils/koi8-u';
import {fromByteArray} from "../../utils/base64";
import {crc16} from "../../utils/crc16";

function answerToBit2(answer: '' | 'A' | 'B' | 'C'): 0 | 1 | 2 | 3 {
    switch (answer) {
        case '':  return 0b00;
        case 'A': return 0b01;
        case 'B': return 0b10;
        case 'C': return 0b11;
    }
}

function genderToBit2(gender: 'M' | 'F' | ''): 0 | 1 | 2 {
    switch (gender) {
        case '':  return 0b00;
        case 'M': return 0b01;
        case 'F': return 0b10;
    }
}

function ageToBit6(age: number /* 0, 16-70 */): number {
    return age === 0 ? 0 : age - 15;
}

export function encodeState(state: CattellState): string {
    const { position, answers, profile: { gender, age, name } } = state;

    const sizeInBytes = 49 + name.length + 2;
    const bitStream = new BitStream(new ArrayBuffer(sizeInBytes));
    bitStream.writeBits(0, 2);
    bitStream.writeUint8(position);

    for (const answer of answers) {
        bitStream.writeBits(answerToBit2(answer), 2);
    }

    bitStream.writeBits(genderToBit2(gender), 2);
    bitStream.writeBits(ageToBit6(age), 6);

    for (const byte of encodeKOI8U(name)) {
        bitStream.writeUint8(byte);
    }

    bitStream.index = 0;
    const body = bitStream.readArrayBuffer(sizeInBytes - 2);
    bitStream.writeUint16(crc16(body));

    bitStream.index = 0;
    const binary = bitStream.readArrayBuffer(sizeInBytes);
    return fromByteArray(binary);
}