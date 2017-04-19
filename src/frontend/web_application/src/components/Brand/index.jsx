import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';

const Brand = ({ theme, className, ...props }) => {
  const BrandClassName = classnames(
    'm-brand',
    {
      'm-brand--high': theme === 'high',
      'm-brand--low': theme === 'low',
    },
    className
  );

  return (
    <svg viewBox="0 0 1366 276" className={BrandClassName} {...props}>
      <path
        id="path2987"
        d="m 679.1,113.6 c -1,-2.5 -2.2,-5.1 -3.8,-7.6 C 662.9,90.5 646,82.8 624.7,82.8 h -5.6 c -7.3,0 -15.3,1.7 -23.8,5.1 -23.6,12.5 -35.4,31.3 -35.4,56.6 0,6.1 1.2,13.1 3.5,21.2 11,26.9 30.1,40.4 57.2,40.4 h 4 c 7.8,0 15.6,-1.3 23.3,-4 3.3,-1.3 6.2,-2.7 9,-4.1 1.1,4.1 4.7,6.9 10.7,8.2 h 2 c 6.7,0 10.6,-4.5 11.6,-13.6 v -71.8 c -0.3,-3.1 -1.1,-5.4 -2.1,-7.2 z m -54.9,67.6 h -4 c -5,0 -9.4,-0.8 -13.2,-2.5 -14.8,-6.7 -22.3,-17.9 -22.3,-33.8 l 1,-10.1 c 5.7,-18.2 17.2,-27.3 34.4,-27.3 h 4 c 13.6,0 24,4.4 31.4,13.1 0.2,2 0.6,3.7 1,5.3 v 36.6 c -0.4,1.5 -0.8,3.2 -1,5 -6.6,9.2 -17.1,13.7 -31.3,13.7 z"
      />
      <path
        id="path2989"
        d="m 717.9,8.9 h 2 c 7.4,1.5 11.1,5.2 11.1,11.1 v 141.5 c 0,10.4 9.8,17 29.4,19.7 9.5,0 15.1,2.7 16.7,8.1 l 0.5,3 v 3 c 0,5.4 -3.7,8.9 -11.1,10.6 H 762 c -19.1,0 -35.3,-7.2 -48.6,-21.7 -4.7,-5.9 -7.1,-14.5 -7.1,-25.8 V 25.1 c 0,-8.3 2.5,-13.4 7.6,-15.2 l 4,-1 z"
      />
      <path
        id="path2991"
        d="m 805,8.9 h 2 c 6.5,0 10.4,4.2 11.6,12.6 -1.6,8.1 -5.3,12.1 -11.1,12.1 H 805 C 797.6,32 793.9,28.3 793.9,22.5 V 20 C 795.4,12.6 799.2,8.9 805,8.9 z m 0,73.8 h 3 c 5.4,0 8.9,4.2 10.6,12.6 v 97 c -1,9.1 -4.9,13.6 -11.6,13.6 h -2 c -7.4,-1.6 -11.1,-5.3 -11.1,-11.1 v -101 c 1.5,-7.4 5.3,-11.1 11.1,-11.1 z"
      />
      <path
        id="path2993"
        d="m 894.8,82.7 h 4.6 c 19.8,0 36.4,10.4 49.6,31.3 4.4,8.8 6.6,17.3 6.6,25.8 v 9.1 c 0,20.1 -10.1,36.8 -30.4,50 -9.3,4.7 -18.2,7.1 -26.8,7.1 h -3.5 c -21.6,0 -38.8,-11.3 -51.6,-33.8 -3.7,-8.1 -5.6,-17.2 -5.6,-27.3 v -1 c 0,-29 14.3,-48.7 43,-59.1 4.7,-1.4 9.5,-2.1 14.1,-2.1 z m -32.4,59.6 v 3 c 0,18.5 9.3,30.3 27.8,35.4 l 4.6,0.5 h 3.5 c 14.3,0 24.8,-8.3 31.4,-24.8 l 1,-7.6 v -9.1 c 0,-14.3 -8.3,-24.8 -24.8,-31.3 l -6.6,-1 h -4.6 c -13.7,0 -24,7.9 -30.9,23.7 -0.9,4.3 -1.4,8 -1.4,11.2 z"
      />
      <path
        id="path2995"
        d="m 1032.7,81.7 c 29.3,0.9 48.8,13.9 58.7,38.9 2.7,6.7 4,13.1 4,19.2 v 7.1 c 0,21.5 -10.6,38.8 -31.9,52 -9.6,4.4 -19.4,6.6 -29.4,6.6 h -34.9 v 52.9 c -1.6,7.7 -5.3,11.6 -11.1,11.6 h -2.5 c -5.7,0 -9.4,-3.9 -11.1,-11.6 V 125.6 c 0,-22.3 15.7,-36.6 47.1,-42.9 l 11.1,-1 z m -33.4,42.4 v 56.6 h 35.4 c 17.4,0 28.8,-8.4 34.4,-25.3 1,-2.7 1.5,-5.6 1.5,-8.6 v -2.5 l 0.5,-0.5 -0.5,-0.5 v -1.5 c 0,-17.3 -9.1,-28.7 -27.3,-34.4 l -9.6,-1 c -15.9,0 -27.2,4.9 -33.9,14.6 l -0.5,3.1 z"
      />
      <path
        id="path2997"
        d="m 1170.1,82.7 h 5.6 c 24.6,0 42.7,9.8 54.2,29.3 1.3,4.4 2.2,8.6 2.5,12.6 0,7.6 -5.9,12.1 -17.7,13.6 l -77.4,16.2 c 0,5.6 4.4,12.5 13.2,20.7 7.1,4 14,6.1 20.8,6.1 h 4 c 10.1,0 19.9,-3.2 29.4,-9.6 l 5.1,-1 c 7.8,1.7 11.6,5.6 11.6,11.6 v 2.5 c 0,7.8 -11.3,14.6 -33.9,20.2 l -12.1,1 h -3.5 c -26.5,0 -45.4,-13 -56.7,-38.9 -2.7,-7.8 -4,-15.4 -4,-22.7 0,-25.4 11.8,-44.3 35.4,-56.6 8.2,-3.3 16.1,-5 23.5,-5 z m -31.4,46 62.8,-13.1 V 115 c -8.6,-5.1 -17,-7.6 -25.3,-7.6 h -5.1 c -15,0.1 -25.8,7.1 -32.4,21.3 z"
      />
      <path
        id="path2999"
        d="m 1304.8,82.7 c 22.8,0 40.3,8.8 52.6,26.3 2.4,5.7 3.5,10.1 3.5,13.1 v 72.7 c -1.6,7.4 -5.3,11.1 -11.1,11.1 h -2 c -6.5,0 -10.4,-4.4 -11.6,-13.1 v -69.2 c 0,-3.9 -3.9,-7.7 -11.6,-11.6 -6.1,-3 -12.8,-4.5 -20.2,-4.5 h -4 c -14.2,0 -24.6,4.5 -31.4,13.6 l -1,4 v 69.7 c -1.7,7.4 -5.4,11.1 -11.1,11.1 h -2 c -6.7,0 -10.6,-4.5 -11.6,-13.6 v -65.2 c 0,-24.2 17.2,-39 51.6,-44.5 h 9.9 z"
      />
      <path
        id="path3001"
        d="m 502,82.7 h -5.6 c -7.3,0 -15.3,1.7 -23.8,5.1 -23.6,12.3 -35.4,31.2 -35.4,56.6 0,7.3 1.4,14.9 4,22.7 11.3,25.9 30.2,38.9 56.7,38.9 h 3.5 l 12.1,-1 c 22.6,-5.6 33.9,-12.4 33.9,-20.2 v -2.5 c 0,-6.1 -3.9,-9.9 -11.6,-11.6 -3.1,0 -5.1,1 -5.1,1 -9.4,6.4 -19.2,9.6 -29.4,9.6 h -4 c -6.7,0 -13.7,-2 -20.8,-6.1 -8.8,-8.2 -13.2,-15.1 -13.2,-20.7 -2,-16.8 1.5,-25.8 1.5,-25.8 6.6,-14.1 17.4,-21.2 32.4,-21.2 h 5.1 c 8.3,0 16.7,2.5 25.3,7.6 l 1.7,1.1 c 0,0 1.9,1 5.1,1 7.8,-1.7 11.7,-5.6 11.7,-11.6 V 103 c 0,-7.8 -11.8,-14.1 -34.5,-19.1 0.1,0 -2.2,-0.8 -9.6,-1.2 z"
      />
      <path
        id="path3003"
        d="m 279.5,157.2 c 9.8,-10.6 15.8,-24.8 15.8,-40.5 0,-33 -26.7,-59.7 -59.7,-59.7 -33,0 -59.7,26.7 -59.7,59.7 0,33 26.7,59.7 59.7,59.7 6.7,0 13.1,-1.1 19.1,-3.1 l 27.6,9.2 -2.8,-25.3 z"
        clipRule="evenodd"
        fillRule="evenodd"
      />
      <path
        id="path3005"
        d="m 95.7,112.4 c -22.2,0 -40.3,18 -40.3,40.3 0,10.3 3.9,19.8 10.3,26.9 l -0.7,18.8 16.7,-7.9 c 4.4,1.6 9.1,2.5 14.1,2.5 22.2,0 40.3,-18 40.3,-40.3 0,-22.3 -18.1,-40.3 -40.4,-40.3 z"
        clipRule="evenodd"
        fillRule="evenodd"
      />
      <path
        id="path3007"
        d="M 235.6,6 C 190.1,6 151,33.4 133.9,72.6 122.3,67 109.4,64 95.7,64 46.7,64 7,103.7 7,152.7 c 0,20.3 6.8,39.1 18.4,54 l 2.4,47.7 44.9,-16 c 7.4,2 15.1,3 23.1,3 29.7,0 56,-14.6 72.1,-37 18.7,14.5 42.2,23.1 67.7,23.1 10.7,0 21.1,-1.5 30.9,-4.4 l 55.7,19.1 3.3,-60.7 c 13.2,-18.2 21,-40.6 21,-64.9 C 346.4,55.6 296.8,6 235.6,6 z M 303,167.9 302.2,210.2 262.6,197 c -8.6,2.9 -17.9,4.5 -27.5,4.5 -32.4,0 -60.6,-18.1 -75,-44.7 -2.2,33.7 -30.1,60.3 -64.3,60.3 -7.1,0 -13.9,-1.2 -20.3,-3.3 L 47.8,224 46.3,193.8 C 37,182.6 31.4,168.3 31.4,152.6 31.4,117 60.3,88.1 95.9,88.1 c 22.7,0 42.6,11.7 54.1,29.4 0,-0.4 0,-0.9 0,-1.3 0,-47.1 38.2,-85.3 85.3,-85.3 47.1,0 85.3,38.2 85.3,85.3 -0.2,19.5 -6.7,37.4 -17.6,51.7 z"
        clipRule="evenodd"
        fillRule="evenodd"
      />
    </svg>
  );
};

Brand.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.string,
};

Brand.defaultProps = {
  className: null,
  theme: null,
};

export default Brand;
