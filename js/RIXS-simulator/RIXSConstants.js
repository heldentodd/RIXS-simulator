// Copyright 2019, University of Colorado Boulder

/**
 * This class is a collection of constants that configure global properties. If you change something here, it will
 * change *everywhere* in this simulation.
 *
 * @author Todd Holden
 */

  // modules
  import PhetFont from '../../../scenery-phet/js/PhetFont.js';
  import rixsSimulator from '../rixsSimulator.js';

  const RIXSConstants = {

    // Thermometer Energy Values
    minEnergy: 100,
    maxEnergy: 10000,
    kEdgeEnergy: 8979,
    lEdgeEnergy: 932,
    mEdgeEnergy: 122,
 
    // Wavelength Label Values - Maybe don't need
    xRayWavelength: 10,
    ultravioletWavelength: 380,
    visibleWavelength: 780,
    infraredWavelength: 100000,

    // Axes Values - maybe don't need
    minHorizontalZoom: 750,
    maxHorizontalZoom: 48000,
    minVerticalZoom: 0.000014336,
    maxVerticalZoom: 700,

    // Animation space size, must be square!
    SPACE_NODE_WIDTH: 510,
    SPACE_NODE_HEIGHT: 510,
    SPACE_BUFFER: 10, // a buffer around the space so that the particles 'slide' into space

    DEFAULT_SHOW_TRACES: 'false',
    LABEL_FONT: new PhetFont( 22 )
  };

 rixsSimulator.register( 'RIXSConstants', RIXSConstants );

 export default RIXSConstants;