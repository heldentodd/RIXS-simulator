// Copyright 2018-2019, University of Colorado Boulder

/**
 * Triangular slider thumb that points down on a horizontal slider
 * The horizontal slider is rotated vertically to make this eventually point left when seen
 *
 * @author Arnab Purkayastha
 */

  // modules
  import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
  import ButtonListener from '../../../../scenery/js/input/ButtonListener.js';
  import Dimension2 from '../../../../dot/js/Dimension2.js';
  import merge from '../../../../phet-core/js/merge.js';
  import Node from '../../../../scenery/js/nodes/Node.js';
  import Path from '../../../../scenery/js/nodes/Path.js';
  import RIXSColorProfile from './RIXSColorProfile.js';
  import rixsSimulator from '../../rixsSimulator.js';
  import Shape from '../../../../kite/js/Shape.js';
  import Tandem from '../../../../tandem/js/Tandem.js';
  
  class TriangleSliderThumb extends Path {

    /**
     * Creates the triangle thumb slider
     * Triangle points down in just logical coordinates because this node eventually gets rotated for actual display
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {
        size: new Dimension2( 15, 15 ),
        stroke: RIXSColorProfile.triangleStrokeProperty,
        lineWidth: 1,
        fill: 'rgb( 50, 145, 184 )',
        fillHighlighted: 'rgb( 71, 207, 255 )',
        dashedLineOptions: {
          stroke: RIXSColorProfile.triangleStrokeProperty,
          lineDash: [ 3, 3 ]
        },
        cursor: 'pointer',
        tandem: Tandem.required
      }, options );

      // Draw the thumb shape starting at the bottom corner, moving up to the top left
      // then moving right and connecting back, all relative to a horizontal track
      const arrowHalfLength = options.size.width / 2;
      const arrowHalfWidth = options.size.width / 2;
      const shape = new Shape()
        .moveTo( 0, -arrowHalfLength )
        .lineTo( -arrowHalfWidth, arrowHalfLength )
        .lineTo( arrowHalfWidth, arrowHalfLength )
        .close();

      super( shape, options );

      // @private dashed lines to visibly anchor the triangle slider to the thermometer
      this.dashedLinesPath = new Path( null, options.dashedLineOptions );
      this.dashedLinesPath.shape = new Shape()
        .moveTo( 0, -arrowHalfLength )
        .lineTo( 0, -2.5 * arrowHalfLength );

      // @private Arrows that will disappear after first click
      const ARROW_OPTIONS = {
        fill: '#64dc64',
        headHeight: 15,
        headWidth: 15,
        tailWidth: 7
      };
      this.cueingArrows = new Node( {
        children: [ new ArrowNode( 15, 0, 40, 0, ARROW_OPTIONS ), new ArrowNode( -15, 0, -40, 0, ARROW_OPTIONS ) ],
        tandem: options.tandem.createTandem( 'cueingArrows' )
      } );

      // Highlight thumb on pointer over and remove arrows on first click
      this.addInputListener( new ButtonListener( {
        over: () => {
          this.fill = options.fillHighlighted;
        },
        up: () => {
          this.fill = options.fill;
        },
        down: () => {
          this.cueingArrows.visible = false;
        }
      } ) );

      this.addChild( this.cueingArrows );
      this.addChild( this.dashedLinesPath );
    }

    /**
     * Reset Properties associated with this Node
     * @public
     */
    reset() {
      this.cueingArrows.visible = true;
    }

  }

  rixsSimulator.register( 'TriangleSliderThumb', TriangleSliderThumb );
  export default TriangleSliderThumb;