// Copyright 2019, University of Colorado Boulder

/**
 * This class is a collection of constants that configure global properties. If you change something here, it will
 * change *everywhere* in this simulation.
 *
 * @author Arnab Purkayastha
 */
define( require => {
  'use strict';

  // modules
  const rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );

  const RIXSConstants = {

    // Thermometer Energy Values
    minEnergy: 100,
    maxEnergy: 10000,
    kEdgeEnergy: 8979,
    lEdgeEnergy: 932,
    mEdgeEnergy: 122,
 
    // Wavelength Label Values
    xRayWavelength: 10,
    ultravioletWavelength: 380,
    visibleWavelength: 780,
    infraredWavelength: 100000,

    // Axes Values
    minHorizontalZoom: 750,
    maxHorizontalZoom: 48000,
    minVerticalZoom: 0.000014336,
    maxVerticalZoom: 700,

    LABEL_FONT: new PhetFont( 22 )
  };

  return rixsSimulator.register( 'RIXSConstants', RIXSConstants );
} );