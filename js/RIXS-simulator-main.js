// Copyright 2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Todd Holden (Queensborough Community College of CUNY)
 */
define( require => {
  'use strict';

  // modules
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const RixsSimulatorScreen = require( 'RIXS_SIMULATOR/RIXS-simulator/RixsSimulatorScreen' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const rixsSimulatorTitleString = require( 'string!RIXS_SIMULATOR/RIXS-simulator.title' );

  const simOptions = {
    credits: {
      //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      soundDesign: '',
      thanks: 'Bernhard Keimer'
    }
  };

  // launch the sim - beware that scenery Image nodes created outside of SimLauncher.launch() will have zero bounds
  // until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
  SimLauncher.launch( () => {
    const sim = new Sim( rixsSimulatorTitleString, [
      new RixsSimulatorScreen( Tandem.rootTandem.createTandem( 'rixsSimulatorScreen' ) )
    ], simOptions );
    sim.start();
  } );
} );