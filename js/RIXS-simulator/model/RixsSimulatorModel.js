// Copyright 2019, University of Colorado Boulder

/**
 * @author Todd Holden (Queensborough Community College of CUNY)
 */
define( require => {
  'use strict';

  // modules
  const rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  const Sample = require( 'RIXS_SIMULATOR/RIXS-simulator/model/Sample' );
  const Vector3 = require( 'DOT/Vector3' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   */
  class RixsSimulatorModel {
   /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      // @public {Sample} initial sample elements YBCO lattice constants and three orientation angles
      this.Sample = new Sample( new Vector3( 3.82, 3.89, 11.68 ), Math.PI / 6, tandem.createTandem( 'Sample' )  );

      // @public {Property.<number>}
      this.energyProperty = new NumberProperty( 932.0, {
        range: new Range (100,10000),//( BlackbodyConstants.minTemperature, BlackbodyConstants.maxTemperature ),
        tandem: tandem.createTandem( 'energyProperty' )
      } );
  
    }

 
    // @public resets the model
    reset() {
    //TODO Reset things here.
    this.Sample.reset();
    }

   // rixsSimulator.register( 'RixsSimulatorModel', RixsSimulatorModel );

    // @public
    step( dt ) {
      //TODO Handle model animation here.
    }
  }

  return rixsSimulator.register( 'RixsSimulatorModel', RixsSimulatorModel );
} );
 // return inherit( Object, RixsSimulatorModel, {

    /**
    * Restores the initial state of all model elements. This method is called when the simulation "Reset All" button is
    * pressed.
    * @public
    */
   // reset: function() {
    //  this.Sample.reset();
    //}
//  } );
//}