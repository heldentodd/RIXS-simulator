// Copyright 2014-2019, University of Colorado Boulder

/**
 * Scenery Node that displays a thermometer with labels attached to the left hand side of the thermometer
 *
 * @author Todd Holden (QCC of CUNY) modified from BlackbodySpectrumThermometer by ...
 * @author Martin Veillette (Berea College)
 * @author Arnab Purkayastha
 */
define( require => {
  'use strict';

  // modules
  const RIXSColorProfile = require( 'RIXS_SIMULATOR/RIXS-simulator/view/RIXSColorProfile' );
  const RIXSConstants = require( 'RIXS_SIMULATOR/RIXSConstants' );
  const rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Shape = require( 'KITE/Shape' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VerticalEnergyDisplay = require( 'RIXS_SIMULATOR/RIXS-simulator/view/VerticalEnergyDisplay' );
  const TriangleSliderThumb = require( 'RIXS_SIMULATOR/RIXS-simulator/view/TriangleSliderThumb' );
  const Util = require( 'DOT/Util' );

  // string
  const kEdgeString = require( 'string!RIXS_SIMULATOR/kEdge' );
  const lEdgeString = require( 'string!RIXS_SIMULATOR/lEdge' );
  const mEdgeString = require( 'string!RIXS_SIMULATOR/mEdge' );
  
  // constants
  const TICK_MARKS = [
    { text: kEdgeString, energy: 8979},//energy: RIXSConstants.kEdgeEnergy },
    { text: lEdgeString, energy: 932 },
    { text: mEdgeString, energy: 122 }
  ];

  class PhotonEnergySlider extends VerticalEnergyDisplay {

    /**
     * Constructs a scale for the sim given the Property for the energy to track
     * @param {Property.<number>} energyProperty
     * @param {Object} [options]
     */
    constructor( energyProperty, options ) {

      options = _.extend( {
        minEnergy: RIXSConstants.minEnergy,
        maxEnergy: RIXSConstants.maxEnergy,
        bulbDiameter: 35,
        tubeWidth: 20,
        tubeHeight: 400,
        majorTickLength: 10,
        minorTickLength: 5,
        glassThickness: 3,
        lineWidth: 3,
        outlineStroke: RIXSColorProfile.thermometerTubeStrokeProperty,
        tickSpacingEnergy: 500,
        tickLabelFont: new PhetFont( { size: 18 } ),
        tickLabelColor: RIXSColorProfile.thermometerTubeStrokeProperty,
        tickLabelWidth: 100,
        snapInterval: 50,
        zeroLevel: 'bulbTop',
        thumbSize: 25,

        tandem: Tandem.required
      }, options );

      super( options.minEnergy, options.maxEnergy, energyProperty, options );

      // labeled tick marks
      const tickContainer = new Node( {
        children: _.range( 0, TICK_MARKS.length ).map( i => this.createLabeledTick( i, options ) ),
        tandem: options.tandem.createTandem( 'labelsNode' )
      } );

      const thumbDimension = new Dimension2( options.thumbSize, options.thumbSize );

      // @private thumb node thermometer's slider
      this.triangleNode = new TriangleSliderThumb( {
        size: thumbDimension,
        tandem: options.tandem.createTandem( 'slider' )
      } );
      this.triangleNode.touchArea = this.triangleNode.localBounds.dilatedXY( 10, 10 );

      let clickYOffset;
      this.triangleNode.addInputListener( new SimpleDragHandler( {
        start: event => {
          clickYOffset = this.triangleNode.globalToParentPoint( event.pointer.point ).y - this.triangleNode.y;
        },
        drag: event => {
          const y = this.triangleNode.globalToParentPoint( event.pointer.point ).y - clickYOffset;

          // Clamp to make sure energy Property is within graph bounds
          energyProperty.value = Util.clamp(
            Util.roundToInterval( this.yPosToEnergy( -y ), options.snapInterval ),
            options.minEnergy,
            options.maxEnergy
          );
          this.updateThumb( energyProperty, options );
        },
        allowTouchSnag: true,
        tandem: options.tandem.createTandem( 'dragListener' )
      } ) );

      this.triangleNode.rotation = -Math.PI / 2;
      this.triangleNode.left = options.tubeWidth / 2;
      this.triangleNode.centerY = -this.energyToYPos( TICK_MARKS[ 1 ].energy );

      this.addChild( tickContainer );
      this.addChild( this.triangleNode );

      // @private location of the center of the thermometer (not the whole node) relative to the right of the node
      this._thermometerCenterXFromRight = -this.triangleNode.width - options.tubeWidth / 2;
    }

    /**
     * Reset Properties associated with this Node
     * @public
     */
    reset() {
      this.triangleNode.centerY = -this.energyToYPos( TICK_MARKS[ 1 ].energy );
      this.triangleNode.reset();
    }

    /**
     * Creates a labeled tick mark.
     * @param {number} tickMarkIndex
     * @param {Object} options - options that were provided to PhotonEnergySlider constructor
     * @returns {Node}
     * @private
     */
    createLabeledTick( tickMarkIndex, options ) {
      const text = TICK_MARKS[ tickMarkIndex ].text;
      const energy = TICK_MARKS[ tickMarkIndex ].energy;

      const objectHeight = -this.energyToYPos( energy );
      const tickMarkLength = options.tubeWidth * 0.5;

      const shape = new Shape();
      shape.moveTo( options.tubeWidth / 2, objectHeight ).horizontalLineToRelative( tickMarkLength );

      const tickNode = new Path( shape, { stroke: options.outlineStroke, lineWidth: options.lineWidth } );
      const textNode = new Text( text, {
        font: options.tickLabelFont,
        fill: options.tickLabelColor,
        maxWidth: options.tickLabelWidth
      } );

      const parentNode = new Node( {
        children: [ tickNode, textNode ]
      } );

      tickNode.right = -0.5 * options.tubeWidth;
      tickNode.centerY = objectHeight;
      textNode.centerY = objectHeight;
      textNode.right = tickNode.left - 10;

      return parentNode;
    }

    /**
     * Updates the location of the thumb
     * @param {Property.<number>} [energyProperty]
     * @param {Object} [options]
     * @public
     */
    updateThumb( energyProperty, options ) {
      assert && assert( energyProperty.value >= options.minEnergy &&
      energyProperty.value <= options.maxEnergy,
        'energy has exceeded scale bounds' );
      this.triangleNode.left = options.tubeWidth / 2;
      this.triangleNode.centerY = -this.energyToYPos( energyProperty.value );
    }

    /**
     * Get horizontal location of thermometer center relative to centerX of the node
     * @returns {number}
     * @public
     */
    get thermometerCenterXFromRight() { return this._thermometerCenterXFromRight; }
  }

  return rixsSimulator.register( 'PhotonEnergySlider', PhotonEnergySlider );
} );