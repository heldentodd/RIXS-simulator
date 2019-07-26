// Copyright 2019, University of Colorado Boulder

/**
 * @author Todd Holden (Queensborough Community College of CUNY)
 */
define( require => {
  'use strict';

  // modules
  const rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );

  /**
   * @constructor
   */
  class RixsSimulatorModel  {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      //TODO
    }

    // @public resets the model
    reset() {
      //TODO Reset things here.
    }

    // @public
    step( dt ) {
      //TODO Handle model animation here.
    }
  }

  return rixsSimulator.register( 'RixsSimulatorModel', RixsSimulatorModel );
} );