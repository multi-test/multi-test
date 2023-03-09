import {decodeState} from "../decode";

describe('cattell.state.decode', () => {
    let hash: string;

    beforeEach(() => {
        hash = "9HZ2Z3d2Z3d2Z3d2Z3d2Z3d2Z3d2Z3d2Z3d2Z3d2Z3d2Z3d2Z3d2Z3d2Z3d2Z3d23enXwc7P1yDpLukuYpk=";
    });

    it('should decode hash to state ok', () => {
        expect(decodeState(hash)).toMatchSnapshot();
    });

    it('should forbid brute hacking into state', () => {
        hash = hash.substring(0, 10) + '0' + hash.substring(11);
        expect(() => decodeState(hash)).toThrowErrorMatchingSnapshot();
    });

    it('should throw error if protocol version is not 0', () => {
        hash = '9a' + hash.substring(2);
        expect(() => decodeState(hash)).toThrowErrorMatchingSnapshot();
    });

    it('should throw error if CRC16 is deleted from base state', () => {
        expect(() => decodeState("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==")).toThrowErrorMatchingSnapshot();
    });
});

