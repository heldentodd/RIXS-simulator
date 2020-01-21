// Copyright 2016-2019, University of Colorado Boulder

/**
 * Model for the Rutherford Atom space, responsible for atoms of the model and model bounds.
 *
 * @author Jesse Greenberg - modified by Todd Holden (QCC) - from RS/common/model/AtomSpace.js
 */
define( function( require ) {
  'use strict';

  // modules
  var Photon = require( 'RIXS_SIMULATOR/RIXS-simulator/model/Photon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Constructor.
   * @param {Bounds2} bounds
   * @param {Object} options
   */
  function PhotonSpace( bounds, options ) {

   /* options = _.extend( {
      atomWidth: bounds.width // width of each atom in the space, width of space by default
    }, options );*/

    // @public (read-only)
    this.photons = []; // all photons contained by this space
    this.bounds = bounds;
    
    // @public - whether this space is visible or not
    this.isVisible = true;
  }

  rixsSimulator.register( 'PhotonSpace', PhotonSpace );

  return inherit( Object, PhotonSpace, {

    /**
     * Add a photon to this space, and track it as being in the empty space
     * at first.
     * @param {Photon} photon
     * @public
     */
    addPhoton: function( photon ) {
      this.photons.push( photon );
    },

    /**
     * Remove a photon from this space amd the model entirely.
     * @param  {Photon} photon
     * @public
     */
    removePhoton: function( photon ) { //ToDo, can probably just keep the most recent 30 instead
      var index = this.photons.indexOf( photon );
      if ( index > -1 ) {
        this.photons.splice( index, 1 );
      }
    },

    /**
     * Remove all photons from the space.
     */
    removeAllPhotons: function() {
      this.photons.length = 0;
    },

    /**
     * All photons that are in the space and not contained by an atom need to move straight through.
     * If a photon moves into an atom's bounds, it should be removed from the space and added to
     * that atom.  The atom will then handle the photon's trajectory through space.
     * @private
     */
    movePhotons: function( dt ) {
      //console.log(this.photons)

      // move photons in empty space straight through //ToDo - this will handle everything soon
      for ( var i = 0 ; i < this.photons.length; i++ ) {
        var photon = this.photons[ i ];

        var speed = photon.speedProperty.get();
        var distance = speed * dt;
        var direction = photon.orientationProperty.get();
        var dx = Math.cos( direction ) * distance;
        var dy = Math.sin( direction ) * distance;
        var position = photon.positionProperty.get();
        var x = position.x + dx;
        var y = position.y + dy;
        photon.positionProperty.set( new Vector2( x, y ) );
      }
    },
  } );
} ); // define
