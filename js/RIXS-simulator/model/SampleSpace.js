// Copyright 2016-2019, University of Colorado Boulder

/**
 * Model for the Rutherford Atom space, responsible for atoms of the model and model bounds.
 *
 * @author Jesse Greenberg - modified by Todd Holden (QCC)
 */
define( function( require ) {
  'use strict';

  // modules
  var Photon = require( 'RIXS_SIMULATOR/model/Photon' );
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Constructor.
   * @param {Property.<number>} protonCountProperty
   * @param {Bounds2} bounds
   * @param {Object} options
   */
  function SampleSpace( protonCountProperty, bounds, options ) {

    options = _.extend( {
      atomWidth: bounds.width // width of each atom in the space, width of space by default
    }, options );

    // @public (read-only)
    this.atoms = [];
    this.photons = []; // all photons contained by this space
    this.photonsInEmptySpace = []; // all photons in empty space, excluding those that are in an atom
    this.bounds = bounds;
    this.atomWidth = options.atomWidth;

    // emitter which signifies that a particle has been transitioned to a new atom
    this.particleTransitionedEmitter = new Emitter( { validators: [ { valueType: Photon }] } );

    // @public - emitter which signifies that a particle has been removed from an atom
    this.particleRemovedFromAtomEmitter = new Emitter( { validators: [ { valueType: Photon } ] } );

    // when a particle has been removed from an atom, remove it from the space as well
    // no need to remove listener, exists for life of sim
    var self = this;
    this.particleRemovedFromAtomEmitter.addListener( function( particle ) {
      self.removePhoton( particle );
    } );

    // @public - whether this space is visible or not
    this.isVisible = true;
  }

  rixsSimulator.register( 'SampleSpace', SampleSpace );

  return inherit( Object, SampleSpace, {

    /**
     * Add a particle to this space, and track it as being in the empty space
     * at first.
     * @param {Photon} photon
     * @public
     */
    addPhoton: function( photon ) {
      this.photons.push( photon );
      this.addPhotonToEmptySpace( photon );
    },

    /**
     * Add a particle to empty space.  Photons in the empty space
     * are outside the bounds of an atom, and the SampleSpace will transition
     * the particle from one atom to another if it comes within atomic bounds.
     * @param {Photon} photon
     * @private
     */
    addPhotonToEmptySpace: function( photon ) {
      photon.isInSpace = true;
      this.photonsInEmptySpace.push( photon );
    },

    /**
     * Remove a particle from this space amd the model entirely.
     * @param  {Photon} photon
     * @public
     */
    removePhoton: function( photon ) { //ToDo, can probably just keep the most recent 30 instead
      var index = this.photons.indexOf( photon );
      if ( index > -1 ) {
        this.photons.splice( index, 1 );
        this.removePhotonFromEmptySpace( photon );
      }
    },

    /**
     * Remove a particle from empty space.  The particle may still be associated
     * with the model, but is inside of an atom in the space.
     * @param  {Photon} photon
     * @private
     */
    removePhotonFromEmptySpace: function( photon ) { //ToDo - shouldn't need this
      var index = this.photonsInEmptySpace.indexOf( photon );
      if ( index > -1 ) {
        photon.isInSpace = false;
        this.photonsInEmptySpace.splice( index, 1 );
      }
    },

    /**
     * Remove all photons from the space, including those that are in the empty space.
     */
    removeAllPhotons: function() {
      this.photons.length = 0;
      this.photonsInEmptySpace.length = 0;
    },

    /**
     * Transition a particle in empty space to an atom if the particle hits atomic bounds.  If the particle hits
     * a new atom's bounding circle, a new shape is prepared and transformed for the trajectory algorithm.  Once
     * the particle hits the atom's bounding box, the prepared shape is applied, and the atom will cary out
     * the trajectory until the particle reaches a new atom.
     * @private
     */
    transitionPhotonsToAtoms: function() { //ToDo this should be replaced with a scattering function coupled to an animation
      for ( var i = 0; i < this.photonsInEmptySpace.length; i++ ) {
        var particle = this.photonsInEmptySpace[ i ];

        for ( var j = 0; j < this.atoms.length; j++ ) {
          var atom = this.atoms[ j ];

          if ( particle.preparedAtom !== atom && atom.boundingCircle.containsPoint( particle.positionProperty.get() ) ) {
            particle.prepareBoundingBox( atom );
            particle.preparedAtom = atom;

            // purely for debugging to visualize transformed shapes
            this.particleTransitionedEmitter.emit( particle );

          }

          // apply bounding box if it is prepared and the particle reaches the atomic bounding box
          if ( particle.preparedBoundingBox ) {
            if ( particle.preparedBoundingBox.containsPoint( particle.positionProperty.get() ) && particle.atom !== particle.preparedAtom ) {
              if ( particle.atom ) {
                // if the particle already belongs to an atom, remove it from the atom
                particle.atom.removePhoton( particle );
              }
              // immediately set the atom so it stops traveling farther into the box
              particle.atom = particle.preparedAtom;
              particle.preparedAtom.addPhoton( particle );

              particle.boundingBox = particle.preparedBoundingBox;
              particle.rotationAngle = particle.preparedRotationAngle;

              this.removePhotonFromEmptySpace( particle );
            }
          }
        }
      }
    },

    /**
     * Once the particle leaves the bounding circle of an atom, add it back to the space so that it
     * can be added to a new particle for multiple deflections if necessary.
     * @public
     */
    transitionPhotonsToSpace: function() {
      for ( var i = 0; i < this.photons.length; i++ ) {
        var particle = this.photons[ i ];

        if ( !particle.isInSpace ) {
          // if the particle leaves the bounding circle of its atom, add it back into empty space
          if ( !particle.atom.boundingCircle.containsPoint( particle.positionProperty.get() ) ) {
            // once the particle exits the atom's bounding box, remove it
            this.addPhotonToEmptySpace( particle );
          }
        }
      }
    },

    /**
     * All photons that are in the space and not contained by an atom need to move straight through.
     * If a particle moves into an atom's bounds, it should be removed from the space and added to
     * that atom.  The atom will then handle the particle's trajectory through space.
     * @private
     */
    movePhotons: function( dt ) {

      // move photons into atoms if they reach atomic bounds
      this.transitionPhotonsToAtoms();

      // move photons back into empty space if they leave atomic bounds
      this.transitionPhotonsToSpace();

      // move photons in empty space straight through //ToDo - this will handle everything soon
      for ( var i = 0 ; i < this.photons.length; i++ ) {
        var photon = this.photons[ i ];

        if ( !photon.atom ) {
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
      }

      // move photons contained by atomic bounds
      this.atoms.forEach( function( atom ) {
        atom.movePhotons( dt );
      } );
    },

    /**
     * Check to make sure that the atom bounds do not overlap each other.
     * Added to prototype so that subtypes can check their atoms once they
     * have been instantiated.
     * @public
     */
    checkAtomBounds: function() {
    // make sure that none of the atoms overlap each other
      for ( var i = 0; i < this.atoms.length - 1; i++ ) {
        for ( var j = i + 1; j < this.atoms.length; j++ ) {
          // get the atom bounds and erode slightly because bounds should perfectly overlap at edges
          var atom1Bounds = this.atoms[ i ].boundingRect.bounds;
          var atom2Bounds = this.atoms[ j ].boundingRect.bounds;
          var boundsIntersect = atom1Bounds.intersectsBounds( atom2Bounds );
          assert && assert( !boundsIntersect, 'Atom bounds intersect' );
        }
      }
    }
  } );
} ); // define
