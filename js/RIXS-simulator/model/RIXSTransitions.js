// Copyright 2016-2019, University of Colorado Boulder

/**
 * Model for RIXS transitions and arrows to represent them.
 *
 * @author Jesse Greenberg - modified by Todd Holden (QCC) - from RS/common/model/AtomSpace.js
 */

  // modules
  import inherit from '../../../../phet-core/js/inherit.js';
  import rixsSimulator from '../../rixsSimulator.js';
   
  /**
   * Constructor.
   */
  function RIXSTransitions( ) {

    // @public (read-only)
    this.transitions = []; // all RIXS transitions
    
    // @public - whether this space is visible or not
    this.isVisible = true; //do I need this?
  }

  rixsSimulator.register( 'RIXSTransitions', RIXSTransitions );

  inherit( Object, RIXSTransitions, {

    /**
     * Add an upward transition arrow
     * at first.
     * @param {Photon} photon
     * @public
     */
    addTransition: function( typeIndex ) { //typeIndex 1 = z2, 2=xz/yz, 3=xy, 4=CT, 5=magnon, 6=elastic
      const transition = {xPosition:phet.joist.random.nextDouble(), timeLeft:2, decayType:typeIndex};
      this.transitions.push( transition );
    },

    /**
     * Remove a transition from the array.
     * @param  {Photon} photon
     * @public
     */
    removeTransition: function( transition ) { //ToDo, can probably just keep the most recent 30 instead
      const index = this.transitions.indexOf( transition );
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
      for( let i = 0 ; i < this.transitions.length ; i++ ) {
        this.transitions[i].timeLeft -= dt;
        if (this.transitions[i].timeLeft <= 0) {
          this.removeTransition(this.transitions[i]);
        }
      }
    }
  } );

  export default RIXSTransitions;