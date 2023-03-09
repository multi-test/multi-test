import {BitStream} from 'bit-buffer';
import {Blank, CattelAnswer, CattellState, Gender} from "./type";
import {decode as decodeKOI8U} from "../../utils/koi8-u";
import {byteLength, toByteArray} from "../../utils/base64";
import {crc16} from "../../utils/crc16";

function decodeAnswer(bitStream: BitStream): Blank<CattelAnswer> {
    const bit2 = bitStream.readBits(2, false);

    switch (bit2)  {
        case 0b01: return 'A';
        case 0b10: return 'B';
        case 0b11: return 'C';
        default: return '';
    }
}

function decodeGender(bitStream: BitStream): Blank<Gender> {
    const bit2 = bitStream.readBits(2, false);

    switch (bit2)  {
        case 0b01: return 'M';
        case 0b10: return 'F';
        default: return '';
    }
}

function decodeAge(bitStream: BitStream): number {
    const bit6 = bitStream.readBits(6, false);
    return bit6 === 0 ? 0 : 15 + bit6;
}

function convert64StringToBitStream(string64: string, sizeInBytes: number): BitStream {
    const bitStream = new BitStream(new ArrayBuffer(sizeInBytes));

    for (const byte of toByteArray(string64)) {
        bitStream.writeUint8(byte);
    }

    bitStream.index = 0;
    return bitStream;
}

function* readBitStream(bitStream: BitStream) {
    while (bitStream.bitsLeft > 16) {
        yield bitStream.readUint8();
    }
}

export function decodeState(string64: string): CattellState {
    const sizeInBytes = byteLength(string64);
    if (sizeInBytes < 51) {
        throw new Error('The provided Cattell test state is not complete');
    }
    const bitStream = convert64StringToBitStream(string64, sizeInBytes);
    const version = bitStream.readBits(2, false);
    if (version !== 0) {
        throw new Error(`Cannot parse an unsupported Cattell state serialization format (v${version})`);
    }

    const position = bitStream.readUint8();

    const answers = new Array<Blank<CattelAnswer>>(187);
    for (let i = 0; i < 187; i++) {
        answers[i] = decodeAnswer(bitStream);
    }

    const gender = decodeGender(bitStream);
    const age = decodeAge(bitStream);
    const name = decodeKOI8U(readBitStream(bitStream));
    const expectedChecksum = bitStream.readUint16();

    bitStream.index = 0;
    const actualChecksum = crc16(bitStream.readArrayBuffer(sizeInBytes - 2));

    if (actualChecksum !== expectedChecksum) {
        throw new Error(`Cattell state has been corrupted (actual = ${actualChecksum}, expected = ${expectedChecksum})`);
    }

    return {
        position,
        answers,
        profile: {
            gender,
            age,
            name,
        },
    };
}