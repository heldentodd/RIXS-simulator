// Copyright 2019, University of Colorado Boulder

/**
 * @author Todd Holden (Queensborough Community College of CUNY)
 */
define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  const RixsSimulatorModel = require( 'RIXS_SIMULATOR/RIXS-simulator/model/RixsSimulatorModel' );
  const RixsSimulatorScreenView = require( 'RIXS_SIMULATOR/RIXS-simulator/view/RixsSimulatorScreenView' );

  class RixsSimulatorScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        backgroundColorProperty: new Property( 'rgb(100,100,100)' ),
        tandem: tandem
      };

      super(
        () => new RixsSimulatorModel( tandem.createTandem( 'model' ) ),
        ( model ) => new RixsSimulatorScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return rixsSimulator.register( 'RixsSimulatorScreen', RixsSimulatorScreen );
} );