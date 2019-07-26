// Copyright 2019, University of Colorado Boulder

/**
 * @author Todd Holden (Queensborough Community College of CUNY)
 */
define( function( require ) {
  'use strict';

  // modules
  const SynchrotronNode = require( 'RIXS_SIMULATOR/RIXS-simulator/view/SynchrotronNode' );
  const MonochromatorNode = require( 'RIXS_SIMULATOR/RIXS-simulator/view/MonochromatorNode' );
  const SampleNode = require( 'RIXS_SIMULATOR/RIXS-simulator/view/SampleNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  const Color = require( 'SCENERY/util/Color' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  

  const NUMBERS_FONT = new PhetFont( { size: 22, weight: 'bold' } );
  

  class RixsSimulatorScreenView extends ScreenView {

    /**
     * @param {RixsSimulatorModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super();

      const SSampleNode = new SampleNode(this.layoutBounds.maxX - 400, 40, model, tandem ); // need it like this to get reset to run
      
      const resetAllButton = new ResetAllButton( {
        listener: () => {
          model.reset();
          SSampleNode.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
      this.addChild( new SynchrotronNode(this.layoutBounds.maxX - 60, this.layoutBounds.maxY / 3) );
      this.addChild( new MonochromatorNode(this.layoutBounds.maxX - 180, this.layoutBounds.maxY / 3 - 40) );
      this.addChild( SSampleNode );

      // A text node that reflects the incident angle of light hitting the sample
     /* const angleText = new Text( '?', {
        font: NUMBERS_FONT,
        fill: Color.YELLOW,//PARM_TEXT_COLOR,
        maxWidth: 130,
        tandem: tandem.createTandem( 'angleText' )
      } );

      // Links the current angle to the angleText text above
      model.Sample.orientationP.link( theta => {
        angleText.text = 'hi';//Util.toFixed( theta * 180 / Math.PI, 0 );
        angleText.centerX = 100; // In case the size of the temperature text changes
        angleText.top = 100; 
      } );

      this.addChild( angleText );*/

    }

    // @public
   // step( dt ) {
      //TODO Handle view animation here.
      //console.log('hi');
    //}
  }

  return rixsSimulator.register( 'RixsSimulatorScreenView', RixsSimulatorScreenView );
} );