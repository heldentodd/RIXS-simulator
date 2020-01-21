// Copyright 2016-2019, University of Colorado Boulder

/**
 * Model for RIXS transitions and arrows to represent them.
 *
 * @author Jesse Greenberg - modified by Todd Holden (QCC) - from RS/common/model/AtomSpace.js
 */
define( function( require ) {
  'use strict';

  // modules
 // var Photon = require( 'RIXS_SIMULATOR/RIXS-simulator/model/Photon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Constructor.
   * @param {Bounds2} bounds
   * @param {Object} options
   */
  function RIXSTransitions( ) {

    // @public (read-only)
    this.transitions = []; // all RIXS transitions
    
    // @public - whether this space is visible or not
    this.isVisible = true; //do I need this?
  }

  rixsSimulator.register( 'RIXSTransitions', RIXSTransitions );

  return inherit( Object, RIXSTransitions, {

    /**
     * Add an upward transition arrow
     * at first.
     * @param {Photon} photon
     * @public
     */
    addTransition: function( typeIndex ) { //typeIndex 1 = z2, 2=xz/yz, 3=xy, 4=CT, 5=magnon, 6=elastic
      var transition = {xPosition:Math.random(), timeLeft:2, decayType:typeIndex};
      this.transitions.push( transition );
    },

    /**
     * Remove a transition from the array.
     * @param  {Photon} photon
     * @public
     */
    removeTransition: function( transition ) { //ToDo, can probably just keep the most recent 30 instead
      var index = this.transitions.indexOf( transition );
      if ( index > -1 ) {
        this.transitions.splice( index, 1 );
      }
    },

    /**
     * Remove all Transitions that have been detected.
     */
    removeAllTransitions: function() {
      this.transitions.length = 0;
    },

    /**
     * Update the time since the transition happened (or was detected)
     * @private
     */
    updateTransitions: function( dt ) {
      // update transition state
      var removed = 0;
      self = this;
    //  console.log(this.transitions);
      this.transitions.forEach( function (transition) {
        transition.timeLeft -= dt;
     //   console.log(transition.timeLeft);
        if (transition.timeLeft <= 0) {
     //     console.log(self.transitions);
          self.removeTransition(transition);
     //     console.log(self.transitions);
     //     removed += 1;
        }
      });
    },
  } );
} ); // define
