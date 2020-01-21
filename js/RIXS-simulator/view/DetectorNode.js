// Copyright 2013-2018, University of Colorado Boulder

/**
 * View for the detector, which can be rotated updating Theta.
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
  //const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Color = require( 'SCENERY/util/Color' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  //const FireListener = require( 'SCENERY/listeners/FireListener' );

  // strings

  // constants working here!
  const NUMBERS_FONT = new PhetFont( { size: 22, weight: 'bold' } );
  //const TITLE_COLOR = blackbodyColorProfile.titlesTextProperty;
  //const TEMPERATURE_COLOR = blackbodyColorProfile.temperatureTextProperty;


  // images
  const DetectorImage = require( 'image!RIXS_SIMULATOR/detector.png' );

  /**
   * Constructor for the DetectorNode which renders the Detector as a scenery node.
   *
   * @param positionX - the x position of the center of the image on the canvas
   * @param positionY - the y position of the center of the image on the canvas
   * @param {RixsSimulatorModel} model - the main model for the simulation
   * @param {Tandem} tandem
   * @constructor 
   */
  //function DetectorNode(positionX, positionY, centerImageNode, model, tandem) {
  class DetectorNode extends Node {
    constructor(positionX, positionY, centerImageNode, model, tandem){
      super();

    var self = this;

    // Call the super constructor
    Node.call( this, {

      // Show a cursor hand over the detector
      cursor: 'pointer'
    } );

    // Add the detector
    
    this.Image = new Image( DetectorImage, {
        rotation: model.detector.orientationP.value, // =0
        centerX: positionX,
        centerY: positionY,
    } );

    this.addChild( this.Image );
  
    // rotate molecule by dragging anywhere
    var dragHandlerDetector = new AngleDragHandler( this.Image, centerImageNode, model );
    this.addInputListener( dragHandlerDetector );
    
    // A text node that reflects the incident angle of light hitting the detector
    const angleTextDetector = new Text( '?', {
        font: NUMBERS_FONT,
        fill: Color.YELLOW,//PARM_TEXT_COLOR,
        maxWidth: 130,
        tandem: tandem.createTandem( 'angleTextDetector' )
      } );

      // Links the current angle to the angleTextDetector text above
      model.Detector.orientationP.link( theta => {
        angleTextDetector.text = 'Angle ' + Util.toFixed( theta * 180 / Math.PI, 0 ) + ' °';
        angleTextDetector.centerX = 500; // In case the size of the temperature text changes
        angleTextDetector.top = 150; 
      } );

      this.addChild( angleTextDetector );

    /**
    * Restores the initial orientation of the Detector. // ToDo - reset not running
    * @public
    */
   reset: function() {
    const x = this.Image.centerX;
    const y = this.Image.centerY;
    this.Image.rotation = 0;
    this.Image.centerX = x;
    this.Image.centerY = y;
    }
  }

  

  //return inherit( Node, DetectorNode );
}
  return rixsSimulator.register( 'DetectorNode', DetectorNode );
  
  //inherit( Node, DetectorNode, {

//} );
} );

