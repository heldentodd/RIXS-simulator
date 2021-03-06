// Copyright 2016-2019, University of Colorado Boulder

/**
 * Model for the Rutherford Atom space, responsible for atoms of the model and model bounds.
 *
 * @author Jesse Greenberg - modified by Todd Holden (QCC) - from RS/common/model/AtomSpace.js
 */

  // modules
  //import Photon from './Photon.js';
  import inherit from '../../../../phet-core/js/inherit.js';
  import rixsSimulator from '../../rixsSimulator.js';
  import Vector2 from '../../../../dot/js/Vector2.js';

  /**
   * Constructor.
   * @param {Bounds2} bounds
   */
  function PhotonSpace( bounds ) {

    // @public (read-only)
    this.photons = []; // all photons contained by this space
    this.bounds = bounds;
    
    // @public - whether this space is visible or not
    this.isVisible = true;
  }

  rixsSimulator.register( 'PhotonSpace', PhotonSpace );

  inherit( Object, PhotonSpace, {

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
      const index = this.photons.indexOf( photon );
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
      for ( let i = 0 ; i < this.photons.length; i++ ) {
        const photon = this.photons[ i ];

        const speed = photon.speedProperty.get();
        const distance = speed * dt;
        const direction = photon.orientationProperty.get();
        const dx = Math.cos( direction ) * distance;
        const dy = Math.sin( direction ) * distance;
        const position = photon.positionProperty.get();
        const x = position.x + dx;
        const y = position.y + dy;
        photon.positionProperty.set( new Vector2( x, y ) );
      }
    }
  } );

  export default PhotonSpace;