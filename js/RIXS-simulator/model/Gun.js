// Copyright 2016-2018, University of Colorado Boulder

/**
 * Gun is the model of a gun that can fire alpha particles.
 *
 * @author Dave Schmitz (Schmitzware) - modified by Todd Holden
 */

  // modules
  import Photon from './Photon.js';
  import inherit from '../../../../phet-core/js/inherit.js';
  import Property from '../../../../axon/js/Property.js';
  import rixsSimulator from '../../rixsSimulator.js';
  import Vector2 from '../../../../dot/js/Vector2.js';


  // constants
  const MAX_PARTICLES = 20;
  const GUN_INTENSITY = 1;

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

  inherit( Object, Gun, {

    /**
     * {number} dt - time step
     * @public
     */
    step: function( dt ) {

      const initialSpeed = 100;

      this.dtSinceGunFired += ( GUN_INTENSITY * dt );
      this.dtPerGunFired = ( this.model.bounds.width / initialSpeed ) / MAX_PARTICLES; // need to revisit this

      if ( this.onProperty.get() && this.dtSinceGunFired >= this.dtPerGunFired ) {

        const particleX = 128 ; // 100,100 need to revisit this probably should be relative to monochromator center
        const particleY = 3.5;

        const initialPosition = new Vector2( particleX, particleY );
        const photon = new Photon( {
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

  } );
  
  export default Gun;
