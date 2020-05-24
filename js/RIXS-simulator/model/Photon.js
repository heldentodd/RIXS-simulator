// Copyright 2016-2019, University of Colorado Boulder

/**
 * Photon representation - speed, orientation, current/past positions.
 *
 * @author Dave Schmitz (Schmitzware) - modified by Todd Holden from AlphaParticle.js
 * @author Jesse Greenberg
 */

  // modules
  import inherit from '../../../../phet-core/js/inherit.js';
  import merge from '../../../../phet-core/js/merge.js';
  import Property from '../../../../axon/js/Property.js';
  import rixsSimulator from '../../rixsSimulator.js';
  import Vector2 from '../../../../dot/js/Vector2.js';

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Photon( options ) {

    options = merge( {
      speed: 0,
      position: new Vector2( 0, 0 ),  // {Vector2} initial position
      orientation: 5 * Math.PI / 6  // {number} in radians ToDo
    }, options );

    this.speedProperty = new Property( options.speed );
    this.positionProperty = new Property( options.position );
    this.orientationProperty = new Property( options.orientation );

    // @public (read-only) - the position coordinates used for trace rendering
    this.positions = [];

    // @public - has the photon been scattered off the sample?
    this.scattered = false;

    // @private - save new photon location
    const self = this;
    const positionListener = function( position ) {
      self.positions.push( new Vector2( position.x, position.y ) );
    };
    this.positionProperty.link( positionListener );

    // @private
    this.disposePhoton = function() {
      this.positionProperty.unlink( positionListener );
    };

  } // constructor

  rixsSimulator.register( 'Photon', Photon );

  inherit( Object, Photon, {

    // @public
    dispose: function() {
      this.disposePhoton();
    },

    /**
     * Get the direction that this photon is travelling in space coordinates as a vector
     * of unit length.  The vector is created from the latest positions in the array since
     * the photon orientation is bound to the second quadrant.
     * @returns {Vector2}
     * @public
     */
    getDirection: function() {

      // if there are less than two positions, return a vector pointing in the initial orientation
      if ( this.positions.length < 2 ) {
        const orientation = this.orientationProperty.get();
        return new Vector2( Math.cos( orientation ), Math.sin( orientation ) ).normalized();
      }

      const position1 = this.positions[ this.positions.length - 2 ];
      const position2 = this.positions[ this.positions.length - 1 ];
      const direction = new Vector2( position2.x - position1.x, position2.y - position1.y );

      return direction.normalized();
    }
  } );
  
  export default Photon;