import { calcGridCoordinates, calcPolygonPoints, calcXpoint, calcYpoint } from './';

describe('comp PiGraph > services > svg', () => {
  describe('calcGridCoordinates', () => {
    it('returns normal values', () => {
      const result = calcGridCoordinates({
        pi: {
          foo: 80,
          bar: 50,
          oof: 10,
          version: 1,
        },
        axeLength: 100,
      });

      const expected = {
        outlinePoints: [
          calcXpoint(100, 0, 100),
          calcYpoint(100, 0, 100),
          calcXpoint(100, -120, 100),
          calcYpoint(100, -120, 100),
          calcXpoint(100, -240, 100),
          calcYpoint(100, -240, 100),
        ],
        axeCoordinates: [
          { axeName: 'foo', x: calcXpoint(100, 0, 100), y: calcYpoint(100, 0, 100) },
          { axeName: 'bar', x: calcXpoint(100, -120, 100), y: calcYpoint(100, -120, 100) },
          { axeName: 'oof', x: calcXpoint(100, -240, 100), y: calcYpoint(100, -240, 100) },
        ],
      };

      expect(result).toEqual(expected);
    });
  });

  describe('calcPolygonPoints', () => {
    it('returns normal values', () => {
      const result = calcPolygonPoints({
        pi: {
          foo: 80,
          bar: 50,
          oof: 10,
          version: 1,
        },
        axeLength: 100,
      });

      const expected = [
        calcXpoint(80, 0, 100),
        calcYpoint(80, 0, 100),
        calcXpoint(50, -120, 100),
        calcYpoint(50, -120, 100),
        calcXpoint(10, -240, 100),
        calcYpoint(10, -240, 100),
      ];

      expect(result).toEqual(expected);
    });
  });
});
