// Copyright 2013-2018, University of Colorado Boulder

/**
 * View for the sample, which can be rotated updating Theta.
 *
 * @author Todd Holden (Queensborough Community College of CUNY)
 *
 */
define( function( require ) {
  'use strict';

  // modules
  const rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  const AngleDragHandler = require( 'RIXS_SIMULATOR/RIXS-simulator/view/AngleDragHandler' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Color = require( 'SCENERY/util/Color' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );

  // strings

  // constants working here!
  const NUMBERS_FONT = new PhetFont( { size: 22, weight: 'bold' } );

  /**
   * Constructor for the RotatingNode which renders the Sample as a scenery node.
   *
   * @param positionX - the x position of the center of the image on the canvas
   * @param positionY - the y position of the center of the image on the canvas
   * @param {RixsSimulatorModel} model - the main model for the simulation
   * @param {Tandem} tandem
   * @constructor 
   */
  function RotatingNode(imageBitmap, imageCenter, rotationCenter, orientationP , tandem) {

    var self = this;

    this._initialCenter = imageCenter;

    // Call the super constructor
    Node.call( this, {

      // Show a cursor hand over the sample
      cursor: 'pointer'
    } );

    // Add the sample
    this.Image = new Image( imageBitmap, {
        //rotation: orientationP.value - Math.PI / 6, // =0
        centerX: imageCenter.x,
        centerY: imageCenter.y
    } );
    
    this.addChild( this.Image );
    
    // rotate molecule by dragging anywhere
    var dragHandler = new AngleDragHandler( this.Image, rotationCenter, orientationP );
    this.addInputListener( dragHandler );

  }

  rixsSimulator.register( 'RotatingNode', RotatingNode );

  //return inherit( Node, RotatingNode );
  return inherit( Node, RotatingNode, {

    /**
    * Restores the initial orientation of the Sample. // ToDo - reset not running
    * @public
    */
   reset: function() {
    this.Image.rotation = 0;
    this.Image.centerX = this._initialCenter.x;
    this.Image.centerY = this._initialCenter.y;
    }
} );
} );

