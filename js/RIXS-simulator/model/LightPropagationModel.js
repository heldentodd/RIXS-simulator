// Copyright 2016-2019, University of Colorado Boulder

/**
 * Base object for the models. Keeps track of all active photons.
 * Code to simulate light beam
 *
 * @author Dave Schmitz (Schmitzware) - modified by Todd Holden (QCC) from RSBaseModel.js
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Emitter = require( 'AXON/Emitter' );
  var Gun = require( 'RIXS_SIMULATOR/RIXS-simulator/model/Gun' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var RIXSConstants = require( 'RIXS_SIMULATOR/RIXSConstants' );
  const rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  
  /**
   * @constructor
   */
  function LightPropagationModel() {

    assert && assert( RIXSConstants.SPACE_NODE_WIDTH === RIXSConstants.SPACE_NODE_HEIGHT, 'Space must be square.' );

    // @public {number}
    //this.photonEnergyProperty = new Property( RSConstants.DEFAULT_ALPHA_ENERGY );

    // @public {boolean}
    this.runningProperty = new Property( true );

    // @public (read-only) model computation space
    this.bounds = new Bounds2(
      -RIXSConstants.SPACE_NODE_WIDTH / 4,
      -RIXSConstants.SPACE_NODE_HEIGHT / 4,
      RIXSConstants.SPACE_NODE_WIDTH / 4,
      RIXSConstants.SPACE_NODE_HEIGHT / 4 );

    // @public (read-only) - {Photon[]} all active photon models
    this.photons = [];

    // @protected - {Array.<RutherfordAtomSpace|PlumPuddingAtomSpace|RutherfordNucleusSpace>}
    this.sampleSpaces = []; // will only have one for now. Need to fix this up. ToDo

    // @protected - manual step size used when sim is paused
    this.maunalStepDt = 1 / 60;

    // @protected - the gun which introduces (aka. 'shoots') photons
    this.gun = new Gun( this );

    // @protected - used to signal when a sim step has occurred
    this.stepEmitter = new Emitter( { validators: [ { valueType: 'number' } ] } );
  }

  rixsSimulator.register( 'LightPropagationModel', LightPropagationModel );

  return inherit( Object, LightPropagationModel, {

    /**
     * Registers a listener to be called at each step of the model execution
     * @param {function()} listener
     * @public
     */
    addStepListener: function( listener ) {
      this.stepEmitter.addListener( listener );
    },

    /**
     * Get the space which is currently visible.
     * @returns {AtomSpace}
     * @public
     */
    getVisibleSpace: function() {
      var visibleSpace;
      this.sampleSpaces.forEach( function( space ) {
        if ( space.isVisible ) {
          visibleSpace = space;
          return;
        }
      } );
      assert && assert( visibleSpace, 'There must be a visible space' );

      return visibleSpace;
    },

    /**
     * Add a photon to the visible space.
     * @param {photon} photon
     * @public
     */
    addPhoton: function( photon ) {
      this.photons.push( photon );

      // add the photon to the space
      this.getVisibleSpace().addPhoton( photon );
    },

    /**
     * Remove a photon from the visible space
     * @param {Photon} photon
     * @public
     */
    removePhoton: function( photon ) {
      // remove the photon from the visible space
      var visibleSpace = this.getVisibleSpace();
      visibleSpace.removePhoton( photon );

      // remove the photon from its atom if scattered
      visibleSpace.atoms.forEach( function( atom ) {
        atom.removePhoton( photon );
      } );

      // remove the photon from the base model
      var index = this.photons.indexOf( photon );
      if ( index > -1 ) {
        this.photons.splice( index, 1 );
      }
    },

    /**
     * Remove all photons from this model and its atoms.
     * @public
     */
    removeAllPhotons: function() {
      // remove the photons from the visible space
      var visibleSpace = this.getVisibleSpace();
      visibleSpace.removeAllPhotons();

      // remove all photons from the atoms
      visibleSpace.atoms.forEach( function( atom ) {
        atom.photons.length = 0;
      } );

      // dispose all photons
      this.photons.forEach( function( photon ) {
        photon.dispose();
      } );
      this.photons.length = 0;
      this.stepEmitter.emit( this.maunalStepDt );
    },

    /**
     * A stub function to be implemented by derived objects. This just makes certain one is implemented.
     * @param {Photon} photon
     * @param {number} dt
     * @protected
     */
    movePhoton: function( photon, dt ) {
      assert && assert( false, 'No movePhoton model function implemented.' );
    },

    /**
     * Move all photons in the visible space.
     * @param {number} dt
     * @private
     */
    movePhotons: function( dt ) {

      // move photons owned by the visible space
      this.getVisibleSpace().movePhotons( dt );
    },

    /**
     * Culls alpha photons that have left the bounds of model space.
     * @protected
     */
    cullPhotons: function() {
      var self = this;
      console.log('cullphotons called');
      this.photons.forEach( function( photon ) {
//        console.log(bounds);
//        console.log(photon.positionProperty);
        if ( !self.bounds.containsPoint( photon.positionProperty.get() ) ) {
          self.removePhoton( photon );
        }
      } );
    },

    /**
     * {number} dt - time step
     * @public
     */
    step: function( dt ) {
      if ( this.runningProperty.get() && !this.userInteractionProperty.value && dt < 1 ) {
        this.gun.step( dt );

        // move photons
        this.movePhotons( dt );

        // remove photons out of bounds
        this.cullPhotons();
      }

      this.stepEmitter.emit( dt );
    },

    /**
     * Step one frame manually.  Assuming 60 frames per second.
     * @public
     */
    manualStep: function() {
      if ( !this.userInteractionProperty.value ) {
        this.gun.step( this.maunalStepDt );
        this.movePhotons( this.maunalStepDt );
        this.cullPhotons();
      }

      this.stepEmitter.emit( this.maunalStepDt );
    },

    /**
     * @public
     */
    reset: function() {
      this.gun.reset();
      this.removeAllPhotons();
     // this.photonEnergyProperty.reset();
      this.runningProperty.reset();
    }

  } ); // inherit

} ); // define
