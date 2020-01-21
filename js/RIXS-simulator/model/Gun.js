// Copyright 2016-2018, University of Colorado Boulder

/**
 * Gun is the model of a gun that can fire alpha particles.
 *
 * @author Dave Schmitz (Schmitzware) - modified by Todd Holden
 */

define( function( require ) {
  'use strict';

  // modules
  var Photon = require( 'RIXS_SIMULATOR/RIXS-simulator/model/Photon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  const rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var MAX_PARTICLES = 20;
  var GUN_INTENSITY = 1;

  /**
   * {RSBaseModel} model
   * @constructor
   */
  function Gun( model ) {

    // @private
    this.model = model;

    // @private
    this.dtSinceGunFired = 0;

    // @public {boolean} is the gun on?
    this.onProperty = new Property( false );
  }

  rixsSimulator.register( 'Gun', Gun );

  return inherit( Object, Gun, {

    /**
     * {number} dt - time step
     * @public
     */
    step: function( dt ) {

      var initialSpeed = 100;

      this.dtSinceGunFired += ( GUN_INTENSITY * dt );
      this.dtPerGunFired = ( this.model.bounds.width / initialSpeed ) / MAX_PARTICLES; // need to revisit this

      if ( this.onProperty.get() && this.dtSinceGunFired >= this.dtPerGunFired ) {

        var particleX = 128 ; // 100,100 need to revisit this probably should be relative to monochromator center
        var particleY = 3.5;

        var initialPosition = new Vector2( particleX, particleY );
        var photon = new Photon( {
          speed: initialSpeed,
          defaultSpeed: initialSpeed,
          position: initialPosition
        } );
        this.model.addPhoton( photon );

        this.dtSinceGunFired = this.dtSinceGunFired % this.dtPerGunFired;
      }
    },

    /**
     * Reset the gun to its initial state, which is off
     * @public
     */
    reset: function() {
      this.onProperty.reset();
    }

  } ); // inherit

} ); // define
