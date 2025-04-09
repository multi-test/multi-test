import {BitStream} from 'bit-buffer';
import {Blank, SF36Answer, SF36State} from "./type";
import {decode as decodeKOI8U} from "../../utils/koi8-u";
import {byteLength, toByteArray} from "../../utils/base64";
import {crc16} from "../../utils/crc16";
import {compactToTimestamp} from "../../utils/date-utils";

function decodeAnswer(bitStream: BitStream): Blank<SF36Answer> {
    const bit3 = bitStream.readBits(3, false);
    // Values 1-6 represent actual answers
    return bit3 as SF36Answer;
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

export function decodeState(string64: string): SF36State {
    const sizeInBytes = byteLength(string64);
    if (sizeInBytes < 20) { // Minimum size: 1 (version) + 14 (answers) + 3 (birthDate) + 2 (checksum)
        throw new Error('The provided SF-36 test state is incomplete');
    }
    
    const bitStream = convert64StringToBitStream(string64, sizeInBytes);
    
    // Read version and validate
    const version = bitStream.readBits(4, false);
    if (version !== 1) {
        throw new Error(`Cannot parse an unsupported SF-36 state serialization format (v${version})`);
    }
    
    // Read answers
    const answers = new Array<Blank<SF36Answer>>(36);
    for (let i = 0; i < 36; i++) {
        answers[i] = decodeAnswer(bitStream);
    }

    // Read compact birthDate (24 bits) and convert to timestamp
    const compactDate = bitStream.readBits(24, false);
    const birthDate = compactToTimestamp(compactDate);
    
    // Read name
    const name = decodeKOI8U(readBitStream(bitStream));
    
    // Read and verify checksum
    const expectedChecksum = bitStream.readUint16();

    bitStream.index = 0;
    const actualChecksum = crc16(bitStream.readArrayBuffer(sizeInBytes - 2));

    if (actualChecksum !== expectedChecksum) {
        throw new Error(`SF-36 state has been corrupted (actual = ${actualChecksum}, expected = ${expectedChecksum})`);
    }

    return {
        answers,
        profile: {
            name,
            birthDate,
        },
    };
} 
