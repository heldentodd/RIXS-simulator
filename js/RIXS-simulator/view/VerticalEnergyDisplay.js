// Copyright 2014-2019, University of Colorado Boulder

/**
 * Thermometer node, see https://github.com/phetsims/scenery-phet/issues/43
 *
 * @author Aaron Davis
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */

 // modules
  import inherit from '../../../../phet-core/js/inherit.js';
  import merge from '../../../../phet-core/js/merge.js';
  import InstanceRegistry from '../../../../phet-core/js/documentation/InstanceRegistry.js';
  import LinearFunction from '../../../../dot/js/LinearFunction.js';
  import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
  import Node from '../../../../scenery/js/nodes/Node.js';
  import Path from '../../../../scenery/js/nodes/Path.js';
  import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
  import rixsSimulator from '../../rixsSimulator.js';
  import Shape from '../../../../kite/js/Shape.js';

  // constants
  const FLUID_OVERLAP = 1; // overlap of fluid in tube and bulb, to hide seam
  // center of the bulb is at (0,0), let the client code move to the correct position
  const BULB_CENTER_X = 0;
  const BULB_CENTER_Y = 0;

  /**
   * @param {number} minEnergy
   * @param {number} maxEnergy
   * @param {Property.<number>} energyProperty
   * @param {Object} [options]
   * @constructor
   */
  function ThermometerNode( minEnergy, maxEnergy, energyProperty, options ) {
    const self = this;

    options = merge( {
      bulbDiameter: 50,
      tubeWidth: 30,
      tubeHeight: 100,
      lineWidth: 4,
      outlineStroke: 'black',
      tickSpacing: 15,
      tickSpacingEnergy: null,
      majorTickLength: 15,
      minorTickLength: 7.5,
      glassThickness: 2, // space between the thermometer outline and the fluid inside it
      zeroLevel: 'bulbCenter', // defines where level is at energy zero - 'bulbCenter' or 'bulbTop'

      // leave as null to have a transparent background. If a color is given, then an extra Rectangle is created for the background
      backgroundFill: null,

      // all the default colors are shades of red
      fluidMainColor: '#850e0e', // the main color of the bulb fluid, and the left side of the tube gradient
      fluidHighlightColor: '#ff7575', // the highlight color of the bulb fluid and the middle of the tube gradient
      fluidRightSideColor: '#c41515' // the right side of the tube gradient, not used currently
    }, options );

    Node.call( this );

    assert && assert( options.zeroLevel === 'bulbCenter' || options.zeroLevel === 'bulbTop',
      'Invalid zeroLevel: ' + options.zeroLevel );

    // Create a shaded sphere to act as the bulb fluid
    const bulbFluidDiameter = options.bulbDiameter - options.lineWidth - options.glassThickness; //TODO should this be options.lineWidth/2 ?

    // Create the outline for the thermometer, starting with the bulb
    const tubeTopRadius = options.tubeWidth / 2;
    const straightTubeHeight = options.tubeHeight - tubeTopRadius;
    const straightTubeTop = BULB_CENTER_Y - ( options.bulbDiameter / 2 ) - straightTubeHeight;
    const straightTubeLeft = BULB_CENTER_X - ( options.tubeWidth / 2 );

    const outlineShape = new Shape()
      .moveTo(straightTubeLeft, BULB_CENTER_Y )
      .lineTo(straightTubeLeft, BULB_CENTER_Y - straightTubeHeight - options.bulbDiameter )
      /*.close()*/;
   
    const outlineNode = new Path( outlineShape, {
      stroke: options.outlineStroke,
      lineWidth: options.lineWidth
    } );
    assert && assert( outlineNode.height === options.tubeHeight + options.bulbDiameter + options.lineWidth ); // see scenery-phet#136

    const tubeFluidWidth = options.tubeWidth * 2 - options.lineWidth - options.glassThickness; //TODO should this be options.lineWidth/2 ?
    const tubeFluidRadius = tubeFluidWidth / 2;
    const clipBulbRadius = ( options.bulbDiameter - options.lineWidth - options.glassThickness ) / 2; //TODO should this be options.lineWidth/2 ?
    const clipStartAngle = -Math.acos( tubeFluidRadius / clipBulbRadius );
    const clipEndAngle = Math.PI - clipStartAngle;
    const tubeFluidBottom = ( bulbFluidDiameter / 2 ) * Math.sin( clipEndAngle );
    const tubeFluidLeft = -tubeFluidRadius;

    // Clip area for the fluid in the tube, round at the top
    const fluidClipArea = new Shape()
      .moveTo( tubeFluidLeft, tubeFluidBottom + FLUID_OVERLAP )
      .arc( BULB_CENTER_X, straightTubeTop, tubeFluidRadius, Math.PI, 0 ) // round top
      .lineTo( -tubeFluidLeft, tubeFluidBottom + FLUID_OVERLAP )
      .close();

    // Gradient for fluid in tube
    const tubeFluidGradient = new LinearGradient( tubeFluidLeft, 0, tubeFluidLeft + tubeFluidWidth, 0 )
      .addColorStop( 0, options.fluidMainColor )
      .addColorStop( 0.4, options.fluidHighlightColor )
      .addColorStop( 0.5, options.fluidHighlightColor )
      .addColorStop( 1, options.fluidMainColor );

    // Fluid in the tube (correct size set later)
    const tubeFluidNode = new Rectangle( 0, 0, tubeFluidWidth, 0, {
      fill: tubeFluidGradient
      //clipArea: fluidClipArea
    } );

    // override tick spacing options when using tickSpacingEnergy
    let offset = options.tickSpacing;
    if ( options.tickSpacingEnergy !== null ) {
      const scaleTempY = ( options.tubeHeight + options.lineWidth ) / ( maxEnergy - minEnergy );
      offset = ( options.tickSpacingEnergy - ( minEnergy % options.tickSpacingEnergy ) ) * scaleTempY;
      options.tickSpacing = options.tickSpacingEnergy * scaleTempY;
    }

    // tick marks, from bottom up, alternating major and minor ticks
    for ( let i = -1; i * options.tickSpacing + offset <= straightTubeHeight + offset + 1 ; i++ ) {
      outlineShape.moveTo(
        straightTubeLeft,
        tubeFluidBottom - ( i * options.tickSpacing ) - offset
      );
      outlineShape.horizontalLineTo(
        straightTubeLeft + ( ( i % 2 === 0 ) ? options.minorTickLength : options.majorTickLength )
      );
    }

    // Background inside the tube
    if ( options.backgroundFill ) {
      this.addChild( new Path( outlineShape, { fill: options.backgroundFill } ) );
    }

    // Add other nodes after optional background
    this.addChild( tubeFluidNode );
   // this.addChild( bulbFluidNode );
    this.addChild( outlineNode ); // need this for the scale!

    // Energy determines the height of the fluid in the tube
    const maxFluidHeight = new Path( fluidClipArea ).height;
    //TODO this can exceed max/min. should this be clamped? or should it be replaced by dot.Util.linear?

    let minFluidHeight = 0;
    if ( options.zeroLevel === 'bulbCenter' ) {
      minFluidHeight = 0;
    }
    else if ( options.zeroLevel === 'bulbTop' ) {
      minFluidHeight = -tubeFluidBottom;
    }
    else {
      throw new Error( 'Invalid zeroLevel: ' + options.zeroLevel );
    }

    // @private
    this.energyLinearFunction = new LinearFunction(
      minEnergy,
      maxEnergy,
      minFluidHeight,
      maxFluidHeight + minFluidHeight
    );

    const energyPropertyObserver = function( temp ) {
      const fluidHeight = self.energyToYPos( temp );
      tubeFluidNode.visible = ( fluidHeight > 0 );
      tubeFluidNode.setRect(
        tubeFluidLeft,
        tubeFluidBottom - fluidHeight + minFluidHeight,
        tubeFluidWidth,
        fluidHeight + FLUID_OVERLAP
      );
    };

    energyProperty.link( energyPropertyObserver );

    this.mutate( options );

    // @private
    this.disposeThermometerNode = function() {
      if ( energyProperty.hasListener( energyPropertyObserver ) ) {
        energyProperty.unlink( energyPropertyObserver );
      }
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ThermometerNode', this );
  }

  rixsSimulator.register( 'ThermometerNode', ThermometerNode );

  inherit( Node, ThermometerNode, {

    /**
     * Ensures that this node is subject to garbage collection
     * @public
     */
    dispose: function() {
      this.disposeThermometerNode();
      Node.prototype.dispose.call( this );
    },

    /**
     * Get y position at energy to allow accurate tick placement
     * @param {number} ener - energy at which to find y position
     * @public
     */
    energyToYPos: function( ener ) {
      return this.energyLinearFunction( ener );
    },

    /**
     * Get energy at y position to allow energy thumb mapping
     * @param {number} y - y position on thermometer node
     * @public
     */
    yPosToEnergy: function( y ) {
      return this.energyLinearFunction.inverse( y );
    }
  } );

  export default ThermometerNode;