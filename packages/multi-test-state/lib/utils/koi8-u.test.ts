import * as _ from 'lodash';
import { encode, decode } from './koi8-u';

describe('koi8-u', function () {
    const cyrillicUnicodeString: string = String.fromCharCode(
        ..._.times(128),
        160,169,176,178,183,247,1025,1028,1030,1031,1038,1040,1041,1042,1043,1044,
        1045,1046,1047,1048,1049,1050,1051,1052,1053,1054,1055,1056,1057,1058,1059,
        1060,1061,1062,1063,1064,1065,1066,1067,1068,1069,1070,1071,1072,1073,1074,
        1075,1076,1077,1078,1079,1080,1081,1082,1083,1084,1085,1086,1087,1088,1089,
        1090,1091,1092,1093,1094,1095,1096,1097,1098,1099,1100,1101,1102,1103,1105,
        1108,1110,1111,1118,1168,1169,8729,8730,8776,8804,8805,8992,8993,9472,9474,
        9484,9488,9492,9496,9500,9508,9516,9524,9532,9552,9553,9554,9556,9559,9560,
        9561,9562,9563,9566,9567,9568,9569,9571,9574,9575,9576,9577,9578,9600,9604,
        9608,9612,9616,9617,9618,9619,9632
    );

    const koi8ByteSequence: number[] = _.times(128).concat([
        26,63,28,29,30,31,51,52,54,55,62,97,98,119,103,100,101,118,122,105,
        106,107,108,109,110,111,112,114,115,116,117,102,104,99,126,123,125,
        127,121,120,124,96,113,65,66,87,71,68,69,86,90,73,74,75,76,77,78,79,
        80,82,83,84,85,70,72,67,94,91,93,95,89,88,92,64,81,35,36,38,39,46,
        61,45,21,22,23,24,25,19,27,0,1,2,3,4,5,6,7,8,9,10,32,33,34,37,40,41,
        42,43,44,47,48,49,50,53,56,57,58,59,60,11,12,13,14,15,16,17,18,20
    ].map(c => c + 128));

    describe('encode', () => {
        it('should encode latin and cyrillic chars', () => {
            expect(encode(cyrillicUnicodeString)).toEqual(koi8ByteSequence)
        });

        it('should throw exception on unsupported chars', () => {
            expect(() => encode('א')).toThrowErrorMatchingSnapshot();
        });
    });

    describe('decode', function () {
        it('should decode latin and cyrillic chars', () => {
            expect(decode(koi8ByteSequence)).toEqual(cyrillicUnicodeString)
        });

        it('should support iterators object', () => {
            function* ascii() {
                for (let i = 0; i < 128; i++) {
                    yield i;
                }
            }

            expect(decode(ascii())).toEqual(cyrillicUnicodeString.substring(0, 128));
        });
    });
});

