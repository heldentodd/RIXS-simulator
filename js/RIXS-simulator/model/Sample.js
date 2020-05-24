// Copyright 2013-2018, University of Colorado Boulder

/**
 * Model of a sample crystal.
 * The sample has lattice parameters and an orientation relative to the incoming beam (of xrays).
 *
 * @author Todd Holden (Queensborough Community College of CUNY)
 */

  // modules
  import inherit from '../../../../phet-core/js/inherit.js';
  import NumberProperty from '../../../../axon/js/NumberProperty.js';
  import rixsSimulator from '../../rixsSimulator.js';
  //import Vector3 from '../../../../dot/js/Vector3.js';

  /**
   * Create a new sample crystal model. The mutable lattice constants (Assumed orthorhombic for now) and orientation.
   *
   * @param {Vector3} latticeConstants - the lattice constants of the sample in angstrom
   * @param {number} orientation - Theta, // phi, (and third as a ToDo) in radians
   * @constructor
   */
  function Sample( latticeConstants, orientation, tandem ) {

    this.anglePhiProperty = new NumberProperty(0, {
      tandem: tandem.createTandem( 'anglePhiProperty' )
    } );
    
    // @public {Vector3} the Lattice Constants of the sample (a, b, c)
    this.latticeConstantsP = new NumberProperty( latticeConstants, {
      tandem: tandem.createTandem( 'latticeConstantsP' )
    } );

    // @public {number} the orientation in radians relative to the incoming light
    this.orientationP =  new NumberProperty( orientation, {
      tandem: tandem.createTandem( 'orientationP' )
    } );
  }

  rixsSimulator.register( 'Sample', Sample );

  inherit( Object, Sample, {

    /**
    * Restores the initial state of the Sample. This method is called when the simulation "Reset All" button is
    * pressed.
    * @public
    */
    reset: function() {
      //this.latticeConstants.reset();
      this.orientationP.reset();
      this.anglePhiProperty.reset();
      //this.position.reset();
      //this.orientationP = this.orientationP._initialValue; 
    }
  } );

  export default Sample;