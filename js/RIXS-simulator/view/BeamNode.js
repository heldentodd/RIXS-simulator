// Copyright 2016-2017, University of Colorado Boulder

/**
 * BeamNode is the beam the comes out of the gun.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RIXSConstants = require( 'RIXS_SIMULATOR/RIXSConstants' );
  const rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  
  /**
   * @param {Property.<boolean>} visibleProperty - is the beam visible?
   * @param {Object} [options]
   * @constructor
   */
  function BeamNode( visibleProperty, options ) {

    options = _.extend( {
      fill: '#8f8f8f'
    }, options );

    Rectangle.call( this, 0, 0, 10, 40, options );

    // no need to unlink, this instance exists for the lifetime of the sim
    visibleProperty.linkAttribute( this, 'visible' );
  }

  rixsSimulator.register( 'BeamNode', BeamNode );

  return inherit( Rectangle, BeamNode );

} ); // define
