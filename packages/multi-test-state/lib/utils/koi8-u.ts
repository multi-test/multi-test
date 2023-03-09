// Copied and heavily modified from: https://github.com/mathiasbynens/koi8-u

const ENC_TABLE: Record<number, number> = {160:26,169:63,176:28,178:29,183:30,247:31,1025:51,1028:52,1030:54,1031:55,1038:62,1040:97,1041:98,1042:119,1043:103,1044:100,1045:101,1046:118,1047:122,1048:105,1049:106,1050:107,1051:108,1052:109,1053:110,1054:111,1055:112,1056:114,1057:115,1058:116,1059:117,1060:102,1061:104,1062:99,1063:126,1064:123,1065:125,1066:127,1067:121,1068:120,1069:124,1070:96,1071:113,1072:65,1073:66,1074:87,1075:71,1076:68,1077:69,1078:86,1079:90,1080:73,1081:74,1082:75,1083:76,1084:77,1085:78,1086:79,1087:80,1088:82,1089:83,1090:84,1091:85,1092:70,1093:72,1094:67,1095:94,1096:91,1097:93,1098:95,1099:89,1100:88,1101:92,1102:64,1103:81,1105:35,1108:36,1110:38,1111:39,1118:46,1168:61,1169:45,8729:21,8730:22,8776:23,8804:24,8805:25,8992:19,8993:27,9472:0,9474:1,9484:2,9488:3,9492:4,9496:5,9500:6,9508:7,9516:8,9524:9,9532:10,9552:32,9553:33,9554:34,9556:37,9559:40,9560:41,9561:42,9562:43,9563:44,9566:47,9567:48,9568:49,9569:50,9571:53,9574:56,9575:57,9576:58,9577:59,9578:60,9600:11,9604:12,9608:13,9612:14,9616:15,9617:16,9618:17,9619:18,9632:20};
const DEC_ARRAY: string[] = ['\u2500','\u2502','\u250C','\u2510','\u2514','\u2518','\u251C','\u2524','\u252C','\u2534','\u253C','\u2580','\u2584','\u2588','\u258C','\u2590','\u2591','\u2592','\u2593','\u2320','\u25A0','\u2219','\u221A','\u2248','\u2264','\u2265','\xA0','\u2321','\xB0','\xB2','\xB7','\xF7','\u2550','\u2551','\u2552','\u0451','\u0454','\u2554','\u0456','\u0457','\u2557','\u2558','\u2559','\u255A','\u255B','\u0491','\u045E','\u255E','\u255F','\u2560','\u2561','\u0401','\u0404','\u2563','\u0406','\u0407','\u2566','\u2567','\u2568','\u2569','\u256A','\u0490','\u040E','\xA9','\u044E','\u0430','\u0431','\u0446','\u0434','\u0435','\u0444','\u0433','\u0445','\u0438','\u0439','\u043A','\u043B','\u043C','\u043D','\u043E','\u043F','\u044F','\u0440','\u0441','\u0442','\u0443','\u0436','\u0432','\u044C','\u044B','\u0437','\u0448','\u044D','\u0449','\u0447','\u044A','\u042E','\u0410','\u0411','\u0426','\u0414','\u0415','\u0424','\u0413','\u0425','\u0418','\u0419','\u041A','\u041B','\u041C','\u041D','\u041E','\u041F','\u042F','\u0420','\u0421','\u0422','\u0423','\u0416','\u0412','\u042C','\u042B','\u0417','\u0428','\u042D','\u0429','\u0427','\u042A'];

function decodeChar(byteValue: number): string {
    if (byteValue < 0x80) {
        return String.fromCharCode(byteValue);
    } else {
        return DEC_ARRAY[byteValue & 0x7F];
    }
}

function encodeChar(codePoint: number): number {
    if (codePoint < 0x80) {
        return codePoint;
    }

    const pointer = ENC_TABLE[codePoint];
    return isFinite(pointer) ? (pointer | 0x80) : NaN;
}

function throwInvalidCharacterError(str: string, index: number): void | never {
    const code = str.charCodeAt(index);
    const chr = JSON.stringify(str[index]);
    const msg = `Encountered non-KOI8-U character ${chr} (code = ${code}) at index ${index} in string: ${str}`;

    throw new Error(msg);
}

export function decode(input: Iterable<number>): string {
    let result = '';
    let byte: number;

    for (byte of input) {
        result += decodeChar(byte);
    }

    return result;
}

export function encode(input: string): number[] {
    const n = input.length;
    let result = new Array<number>(n);

    for (let koi8Code = NaN, i = 0; i < n; i++) {
        koi8Code = encodeChar(input.charCodeAt(i));

        if (isFinite(koi8Code)) {
            result[i] = koi8Code;
        } else {
            throwInvalidCharacterError(input, i);
        }
    }

    return result;
}
