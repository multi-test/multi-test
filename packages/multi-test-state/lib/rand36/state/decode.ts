import {BitStream} from 'bit-buffer';
import {Blank, RAND36Answer, RAND36State} from "./type";
import {decode as decodeKOI8U} from "../../utils/koi8-u";
import {byteLength, toByteArray} from "../../utils/base64";
import {crc16} from "../../utils/crc16";

function decodeAnswer(bitStream: BitStream): Blank<RAND36Answer> {
    const bit3 = bitStream.readBits(3, false);
    // Values 1-6 represent actual answers
    return bit3 as RAND36Answer;
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
        const byte = bitStream.readUint8();
        yield byte;
    }
}

export function decodeState(string64: string): RAND36State {
    const sizeInBytes = byteLength(string64);
    if (sizeInBytes < 19) {
        throw new Error('The provided RAND-36 test state is incomplete');
    }
    
    const bitStream = convert64StringToBitStream(string64, sizeInBytes);
    
    // Read version and validate
    const version = bitStream.readBits(4, false);
    if (version !== 1) {
        throw new Error(`Cannot parse an unsupported RAND-36 state serialization format (v${version})`);
    }
    
    // Read answers
    const answers = new Array<Blank<RAND36Answer>>(36);
    for (let i = 0; i < 36; i++) {
        answers[i] = decodeAnswer(bitStream);
    }

    // Read compact birthDate
    const birthDate = bitStream.readBits(24, false);
    
    // Read name
    const name = decodeKOI8U(readBitStream(bitStream));
    
    // Read and verify checksum
    const expectedChecksum = bitStream.readUint16();

    bitStream.index = 0;
    const actualChecksum = crc16(bitStream.readArrayBuffer(sizeInBytes - 2));

    if (actualChecksum !== expectedChecksum) {
        throw new Error(`RAND-36 state has been corrupted (actual = ${actualChecksum}, expected = ${expectedChecksum})`);
    }

    return {
        answers,
        profile: {
            name,
            birthDate,
        },
    };
} 
