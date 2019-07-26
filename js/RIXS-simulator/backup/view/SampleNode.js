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
  //const FireListener = require( 'SCENERY/listeners/FireListener' );

  // strings

  // constants working here!
  const NUMBERS_FONT = new PhetFont( { size: 22, weight: 'bold' } );
  //const TITLE_COLOR = blackbodyColorProfile.titlesTextProperty;
  //const TEMPERATURE_COLOR = blackbodyColorProfile.temperatureTextProperty;


  // images
  const SampleImage = require( 'image!RIXS_SIMULATOR/sample.png' );

  /**
   * Constructor for the SampleNode which renders the Sample as a scenery node.
   *
   * @param positionX - the x position of the center of the image on the canvas
   * @param positionY - the y position of the center of the image on the canvas
   * @param {RixsSimulatorModel} model - the main model for the simulation
   * @param {Tandem} tandem
   * @constructor 
   */
  function SampleNode(positionX, positionY, model, tandem) {

    var self = this;

    // Call the super constructor
    Node.call( this, {

      // Show a cursor hand over the sample
      cursor: 'pointer'
    } );

    // Add the sample
    
    this.Image = new Image( SampleImage, {
        rotation: model.Sample.orientationP.value - Math.PI / 6, // =0
        centerX: positionX,
        centerY: positionY,
        scale: (0.5, 0.25)
      
    } );

    this.addChild( this.Image );
  
    /*
    this.addChild( new Image( SampleImage, {
      centerX: positionX,
      centerY: positionY,
      rotation: model.Sample.orientation.x - Math.PI / 4,
      scale: (0.5, 0.25)
    
    } ) );*/

    // rotate molecule by dragging anywhere
    var dragHandler = new AngleDragHandler( this.Image, this.Image, model );
    this.addInputListener( dragHandler );
    
    // A text node that reflects the incident angle of light hitting the sample
    const angleText = new Text( '?', {
        font: NUMBERS_FONT,
        fill: Color.YELLOW,//PARM_TEXT_COLOR,
        maxWidth: 130,
        tandem: tandem.createTandem( 'angleText' )
      } );

      // Links the current angle to the angleText text above
      model.Sample.orientationP.link( theta => {
        angleText.text = Util.toFixed( theta * 180 / Math.PI, 0 );
        angleText.centerX = 100; // In case the size of the temperature text changes
        angleText.top = 100; 
      } );

      this.addChild( angleText );
  }

  rixsSimulator.register( 'SampleNode', SampleNode );

  //return inherit( Node, SampleNode );
  return inherit( Node, SampleNode, {

    /**
    * Restores the initial orientation of the Sample. // ToDo - reset not running
    * @public
    */
   reset: function() {
    const x = this.Image.centerX;
    const y = this.Image.centerY;
    this.Image.rotation = 0;
    this.Image.centerX = x;
    this.Image.centerY = y;
    // also need model.Sample.orientation.x = Math.PI /4 ;
    }
} );
} );

