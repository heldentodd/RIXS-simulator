// Copyright 2018-2019, University of Colorado Boulder

/**
 * An object that contains the colors used for various major components of the Blackbody simulation.  This
 * is used to support different color schemes, such as a default that looks good on a laptop or tablet, and a
 * "projector mode" that looks good when projected on a large screen.
 *
 * @author Todd Holden (QCC of CUNY)
 * @author Siddhartha Chinthapally (Actual Concepts)
 */

 // modules
  import rixsSimulator from '../../rixsSimulator.js';
  import Color from '../../../../scenery/js/util/Color.js';
  import ColorProfile from '../../../../scenery-phet/js/ColorProfile.js';

  const RIXSColorProfile = new ColorProfile( [ 'default', 'projector' ], {
    background: {
      default: 'black',
      projector: 'white'
    },
    backgroundColor: {
      default: new Color( 100, 100, 100 ),
      projector: new Color( 255, 255, 255 )
    },
    panelStroke: {
      default: 'white',
      projector: 'black'
    },
    panelText: {
      default: 'white',
      projector: 'black'
    },
    graphAxesStroke: {
      default: 'white',
      projector: 'black'
    },
    graphValuesDashedLine: {
      default: 'yellow',
      projector: 'deeppink'
    },
    graphValuesLabels: {
      default: 'yellow',
      projector: 'deeppink'
    },
    graphValuesPoint: {
      default: 'white',
      projector: 'black'
    },
    titlesText: {
      default: 'white',
      projector: 'black'
    },
    thermometerTubeStroke: {
      default: 'white',
      projector: 'black'
    },
    thermometerTrack: {
      default: 'black',
      projector: 'white'
    },
    temperatureText: {
      default: Color.YELLOW,
      projector: Color.BLUE
    },
    photonBeamColor: {
      default: new Color( 143, 143, 143, 0.4 ),
      projector: new Color( 143, 143, 143, 0.4 )
    },
    triangleStroke: {
      default: 'white',
      projector: 'black'
    },
    starStroke: {
      default: 'rgba( 0, 0, 0, 0 )',
      projector: 'black'
    }
  } );

  rixsSimulator.register( 'RIXSColorProfile', RIXSColorProfile );

export default RIXSColorProfile;
