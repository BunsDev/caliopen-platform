import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './style.scss';

const Brand = ({ theme, className }) => {
  const BrandClassName = classnames(
    'm-brand',
    {
      'm-brand--high': theme === 'high',
      'm-brand--low': theme === 'low',
    },
    className
  );

  return (
    <div className={BrandClassName}>
      <svg viewBox="0 0 1366 276">
        <path
        	d="M679.1,113.6c-1-2.5-2.2-5.1-3.8-7.6c-12.4-15.5-29.3-23.2-50.6-23.2h-5.6c-7.3,0-15.3,1.7-23.8,5.1
        	c-23.6,12.5-35.4,31.3-35.4,56.6c0,6.1,1.2,13.1,3.5,21.2c11,26.9,30.1,40.4,57.2,40.4h4c7.8,0,15.6-1.3,23.3-4
        	c3.3-1.3,6.2-2.7,9-4.1c1.1,4.1,4.7,6.9,10.7,8.2h2c6.7,0,10.6-4.5,11.6-13.6v-71.8C680.9,117.7,680.1,115.4,679.1,113.6z
        	 M624.2,181.2h-4c-5,0-9.4-0.8-13.2-2.5c-14.8-6.7-22.3-17.9-22.3-33.8l1-10.1c5.7-18.2,17.2-27.3,34.4-27.3h4
        	c13.6,0,24,4.4,31.4,13.1c0.2,2,0.6,3.7,1,5.3v36.6c-0.4,1.5-0.8,3.2-1,5C648.9,176.7,638.4,181.2,624.2,181.2z"
        	/>
        <path
        	d="M717.9,8.9h2c7.4,1.5,11.1,5.2,11.1,11.1v141.5c0,10.4,9.8,17,29.4,19.7c9.5,0,15.1,2.7,16.7,8.1l0.5,3v3
        	c0,5.4-3.7,8.9-11.1,10.6H762c-19.1,0-35.3-7.2-48.6-21.7c-4.7-5.9-7.1-14.5-7.1-25.8V25.1c0-8.3,2.5-13.4,7.6-15.2L717.9,8.9z"
        	/>
        <path
        	d="M805,8.9h2c6.5,0,10.4,4.2,11.6,12.6c-1.6,8.1-5.3,12.1-11.1,12.1H805c-7.4-1.6-11.1-5.3-11.1-11.1v-2.5
        	C795.4,12.6,799.2,8.9,805,8.9z M805,82.7h3c5.4,0,8.9,4.2,10.6,12.6v97c-1,9.1-4.9,13.6-11.6,13.6h-2c-7.4-1.6-11.1-5.3-11.1-11.1
        	v-101C795.4,86.4,799.2,82.7,805,82.7z"
        	/>
        <path
        	d="M894.8,82.7h4.6c19.8,0,36.4,10.4,49.6,31.3c4.4,8.8,6.6,17.3,6.6,25.8v9.1c0,20.1-10.1,36.8-30.4,50
        	c-9.3,4.7-18.2,7.1-26.8,7.1h-3.5c-21.6,0-38.8-11.3-51.6-33.8c-3.7-8.1-5.6-17.2-5.6-27.3v-1c0-29,14.3-48.7,43-59.1
        	C885.4,83.4,890.2,82.7,894.8,82.7z M862.4,142.3v3c0,18.5,9.3,30.3,27.8,35.4l4.6,0.5h3.5c14.3,0,24.8-8.3,31.4-24.8l1-7.6v-9.1
        	c0-14.3-8.3-24.8-24.8-31.3l-6.6-1h-4.6c-13.7,0-24,7.9-30.9,23.7C862.9,135.4,862.4,139.1,862.4,142.3z"
        	/>
        <path
        	d="M1032.7,81.7c29.3,0.9,48.8,13.9,58.7,38.9c2.7,6.7,4,13.1,4,19.2v7.1c0,21.5-10.6,38.8-31.9,52c-9.6,4.4-19.4,6.6-29.4,6.6
        	h-34.9v52.9c-1.6,7.7-5.3,11.6-11.1,11.6h-2.5c-5.7,0-9.4-3.9-11.1-11.6V125.6c0-22.3,15.7-36.6,47.1-42.9L1032.7,81.7z
        	 M999.3,124.1v56.6h35.4c17.4,0,28.8-8.4,34.4-25.3c1-2.7,1.5-5.6,1.5-8.6v-2.5l0.5-0.5l-0.5-0.5v-1.5c0-17.3-9.1-28.7-27.3-34.4
        	l-9.6-1c-15.9,0-27.2,4.9-33.9,14.6L999.3,124.1z"
        	/>
        <path d="M1170.1,82.7h5.6c24.6,0,42.7,9.8,54.2,29.3c1.3,4.4,2.2,8.6,2.5,12.6c0,7.6-5.9,12.1-17.7,13.6l-77.4,16.2
        	c0,5.6,4.4,12.5,13.2,20.7c7.1,4,14,6.1,20.8,6.1h4c10.1,0,19.9-3.2,29.4-9.6l5.1-1c7.8,1.7,11.6,5.6,11.6,11.6v2.5
        	c0,7.8-11.3,14.6-33.9,20.2l-12.1,1h-3.5c-26.5,0-45.4-13-56.7-38.9c-2.7-7.8-4-15.4-4-22.7c0-25.4,11.8-44.3,35.4-56.6
        	C1154.8,84.4,1162.7,82.7,1170.1,82.7z M1138.7,128.7l62.8-13.1V115c-8.6-5.1-17-7.6-25.3-7.6h-5.1
        	C1156.1,107.5,1145.3,114.5,1138.7,128.7z"/>
        <path d="M1304.8,82.7c22.8,0,40.3,8.8,52.6,26.3c2.4,5.7,3.5,10.1,3.5,13.1v72.7c-1.6,7.4-5.3,11.1-11.1,11.1h-2
        	c-6.5,0-10.4-4.4-11.6-13.1v-69.2c0-3.9-3.9-7.7-11.6-11.6c-6.1-3-12.8-4.5-20.2-4.5h-4c-14.2,0-24.6,4.5-31.4,13.6l-1,4v69.7
        	c-1.7,7.4-5.4,11.1-11.1,11.1h-2c-6.7,0-10.6-4.5-11.6-13.6v-65.2c0-24.2,17.2-39,51.6-44.5H1304.8z"/>
        <path d="M502,82.7h-5.6c-7.3,0-15.3,1.7-23.8,5.1c-23.6,12.3-35.4,31.2-35.4,56.6c0,7.3,1.4,14.9,4,22.7
        	c11.3,25.9,30.2,38.9,56.7,38.9h3.5l12.1-1c22.6-5.6,33.9-12.4,33.9-20.2v-2.5c0-6.1-3.9-9.9-11.6-11.6c-3.1,0-5.1,1-5.1,1
        	c-9.4,6.4-19.2,9.6-29.4,9.6h-4c-6.7,0-13.7-2-20.8-6.1c-8.8-8.2-13.2-15.1-13.2-20.7c-2-16.8,1.5-25.8,1.5-25.8
        	c6.6-14.1,17.4-21.2,32.4-21.2h5.1c8.3,0,16.7,2.5,25.3,7.6l1.7,1.1c0,0,1.9,1,5.1,1c7.8-1.7,11.7-5.6,11.7-11.6V103
        	c0-7.8-11.8-14.1-34.5-19.1C511.7,83.9,509.4,83.1,502,82.7z"/>
        <path
        	fillRule="evenodd"
        	clipRule="evenodd"
        	d="M279.5,157.2c9.8-10.6,15.8-24.8,15.8-40.5c0-33-26.7-59.7-59.7-59.7c-33,0-59.7,26.7-59.7,59.7
        	s26.7,59.7,59.7,59.7c6.7,0,13.1-1.1,19.1-3.1l27.6,9.2L279.5,157.2z"
        	/>
        <path
        	fillRule="evenodd"
        	clipRule="evenodd"
        	d="M95.7,112.4c-22.2,0-40.3,18-40.3,40.3c0,10.3,3.9,19.8,10.3,26.9L65,198.4l16.7-7.9c4.4,1.6,9.1,2.5,14.1,2.5
        	c22.2,0,40.3-18,40.3-40.3S118,112.4,95.7,112.4z"
        	/>
        <path
        	fillRule="evenodd"
        	clipRule="evenodd"
        	d="M235.6,6C190.1,6,151,33.4,133.9,72.6C122.3,67,109.4,64,95.7,64C46.7,64,7,103.7,7,152.7 c0,20.3,6.8,39.1,18.4,54l2.4,47.7l44.9-16c7.4,2,15.1,3,23.1,3c29.7,0,56-14.6,72.1-37c18.7,14.5,42.2,23.1,67.7,23.1
        	c10.7,0,21.1-1.5,30.9-4.4l55.7,19.1l3.3-60.7c13.2-18.2,21-40.6,21-64.9C346.4,55.6,296.8,6,235.6,6z M303,167.9l-0.8,42.3
        	l-39.6-13.2c-8.6,2.9-17.9,4.5-27.5,4.5c-32.4,0-60.6-18.1-75-44.7c-2.2,33.7-30.1,60.3-64.3,60.3c-7.1,0-13.9-1.2-20.3-3.3
        	l-27.7,10.2l-1.5-30.2c-9.3-11.2-14.9-25.5-14.9-41.2c0-35.6,28.9-64.5,64.5-64.5c22.7,0,42.6,11.7,54.1,29.4c0-0.4,0-0.9,0-1.3
        	c0-47.1,38.2-85.3,85.3-85.3s85.3,38.2,85.3,85.3C320.4,135.7,313.9,153.6,303,167.9z"
        />
      </svg>
    </div>
  );
};

Brand.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.string,
};

export default Brand;
