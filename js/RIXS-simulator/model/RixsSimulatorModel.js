// Copyright 2020, University of Colorado Boulder

/**
 * @author Todd Holden (Queensborough Community College of CUNY)
 */

import rixsSimulator from '../../rixsSimulator.js';

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import Emitter from '../../../../axon/js/Emitter.js';
import LightPropagationModel from './LightPropagationModel.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PhotonSpace from './PhotonSpace.js';
import Range from '../../../../dot/js/Range.js';
import RIXSConstants from '../RIXSConstants.js';
import RIXSTransitions from './RIXSTransitions.js';
import Sample from './Sample.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import Vector2 from '../../../../dot/js/Vector2.js';

//to convert from photon energy in eV to wavenumber in inverse Angstrom = 8065.5 * 2 * Math.PI / 100000000;
const EVtoInverseA = 0.00050677;
  
/**
 * @constructor
 */
class RixsSimulatorModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    
      // @public {Sample} initial sample elements YBCO lattice constants and three orientation angles

    this.graph = new Object();
    this.graph.EMax = 0;
    this.graph.EMin = -7;
    this.graph.bins = (this.graph.EMax-this.graph.EMin) * 10 + 1;

    this.histogram = new Array(this.graph.bins).fill(0);

    this.Sample = new Sample( new Vector3( 3.82, 3.89, 11.68 ), 2 * Math.PI / 3, tandem.createTandem( 'Sample' )  );

    this.fasterDataProperty = new BooleanProperty( false );
    
    this.modelVisibleProperty = new BooleanProperty( false );
    
    //code for the detector
    this.detectorAngleProperty = new NumberProperty( Math.PI * 120/ 180, {
      tandem: tandem.createTandem( 'detectorAngleProperty' )
    } );

    // @public {Property.<Vector2>} create a derived property that tracks the change in photon wavenumber
    this.detectorCenterProperty = new DerivedProperty( [this.detectorAngleProperty], computeDetectorCenter,
      {
        tandem: tandem.createTandem( 'detectorCenterProperty' )
      }
    );

    // @public {Property.<number>} energy in eV
    this.energyProperty = new NumberProperty( 932.0, {
      range: new Range (100,10000),//( BlackbodyConstants.minTemperature, BlackbodyConstants.maxTemperature ),
      tandem: tandem.createTandem( 'energyProperty' )
    } );
    // Do not account for energy loss yet - ToDo add energy loss (maybe somewhere eles)
    this.finalEnergyProperty = new DerivedProperty( [this.energyProperty], computeFinalEnergy,
      {
        tandem: tandem.createTandem( 'finalEnergyProperty' ),
        phetioType: DerivedPropertyIO( NumberIO )
      }
    );

    // Do final angle relative to the sample surface
    this.finalAngleProperty = new DerivedProperty( [this.detectorAngleProperty, this.Sample.orientationP], computeFinalAngle,
      {
        tandem: tandem.createTandem( 'finalAngleProperty' )
      }
    );

    // @public {Property.<Vector2>} create a derived property that tracks the change in photon wavenumber
    this.kProperties = new DerivedProperty(
      [ this.energyProperty, this.finalEnergyProperty, this.Sample.orientationP, this.finalAngleProperty, this.Sample.anglePhiProperty, this.Sample.latticeConstantsP ],
      computeKProperties,
      {
        tandem: tandem.createTandem( 'kProperties' ),
        units: 'InverseAngstrom'
      }
    );
    
    this.peaks/*.strengths*/ = new DerivedProperty(
      [ this.Sample.orientationP, this.finalAngleProperty, this.energyProperty, this.Sample.anglePhiProperty ],
      computePeaks,
      {
        tandem: tandem.createTandem( 'peaks' ),
        units: 'Arbitrary'
      }
    );
    /*
     * Code to simulate light beam
     */
    LightPropagationModel.call(this);
    // @public (read-only) model computation space
    this.bounds = new Bounds2(
    -RIXSConstants.SPACE_NODE_WIDTH / 4,
    -RIXSConstants.SPACE_NODE_HEIGHT / 4,
    RIXSConstants.SPACE_NODE_WIDTH / 4,
    RIXSConstants.SPACE_NODE_HEIGHT / 4 );

   /**
   * Create the node in which photons are rendered.  Visibility is controlled from this node.
   *
   * @param {Property.<boolean>} showAlphaTraceProperty
   * @param {Bounds2} canvasBounds
   * @returns {Node}
   * @protected
   */

   // @public (read-only) - spaces containing the atoms
   this.photonSpace = new PhotonSpace( this.bounds );
   this.RIXSTransitions = new RIXSTransitions(  );

  // @protected - used to signal when a sim step has occurred
  this.stepEmitter = new Emitter( { validators: [ { valueType: 'number' } ] } );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.Sample.reset();
    this.detectorAngleProperty.reset();
    this.energyProperty.reset();
    this.histogram.fill(0);
  }

  // a function
  movePhotons( dt ) {
    this.photonSpace.movePhotons( dt );
  }

  /**
   * Add a particle to the visible space.
   * @param {photon} photon
   * @public
   */
  addPhoton( photon ) {
    this.photons.push( photon );

    // add the particle to the space
    this.photonSpace.addPhoton( photon );
  }

  /**
   * Registers a listener to be called at each step of the model execution
   * @param {function()} listener
   * @public
   */
  addStepListener( listener ) {
    this.stepEmitter.addListener( listener );
  }

  /**
   * Culls photons that have left the bounds of model space.
   * @protected
   */
  cullPhotons() {
    const self = this;
    this.photons.forEach( function( photon ) {
      if ( !self.bounds.containsPoint( photon.positionProperty.get() ) ) {
        self.removePhoton( photon );
      }
      else if ( photon.scattered && (self.detectorCenterProperty.get().distance(photon.positionProperty.get() ) < 6.2 ) ) {//check to see if photon is at detector
        self.absorptionModel(self.peaks);
        /*if(self.energyProperty.value == 932) self.absorptionModel(self.peaks); // check that photon was absorbed and not elastically scattered
        else { // should be below in absorptionModel, but too lazy
          var scatteredPhotonEnergy = 0 + .1 * Math.tan(Math.PI*(phet.joist.random.nextDouble()-0.5));
          var binWidth = (self.graph.EMax -self.graph.EMin)/(self.graph.bins - 1);

          if ((-scatteredPhotonEnergy > self.graph.EMin - binWidth/2) && (-scatteredPhotonEnergy < self.graph.EMax + binWidth/2)) {
            var binIndex = Utils.roundSymmetric( (-scatteredPhotonEnergy - self.graph.EMin) / binWidth ); // ToDo round cuts top and bottom bin in half - should allow a little extra space on either side.
            self.histogram[binIndex] += 1;
          }
        }*/
        self.removePhoton( photon );
      }
    } );
  }

  /**
   * Model for absorption and reemission of photons that reach the detector position.
   * @protected
   */
  absorptionModel(peaks) {
    
  //  const oscillatorName = [ 'elastic', 'magnon/2J', 'xy', 'yz', 'z2', 'CT' ]; // names for the oscillators
  //  const oscillatorEnergy = [ 0, 0.4, 1.5, 1.8, 2.3, 5.5 ]; // energy relative to x2-y2 in eV
  //  const oscillatorWidth = [ 0.06, 0.06, 0.09, 0.11, 0.12, 0.7 ]; // broadening parameters in eV
   // var oscillatorStrength = [ 0.04 , 0.04 , 0.4, 0.4, 0.4, 0.2 ]; // set somewhere else
    const oscillatorEnergy = peaks.value.energies; // energy relative to x2-y2 in eV
    const oscillatorWidth = peaks.value.widths; // broadening parameters in eV
   

    const oscillatorIndex = this.weightedRandom(this.peaks.value.strengths);

    this.RIXSTransitions.addTransition(oscillatorIndex);
    
    const scatteredPhotonEnergy = oscillatorEnergy[oscillatorIndex] + oscillatorWidth[oscillatorIndex] * Math.tan(Math.PI*(phet.joist.random.nextDouble()-0.5));
    const binWidth = (this.graph.EMax -this.graph.EMin)/(this.graph.bins - 1);

    if ((-scatteredPhotonEnergy > this.graph.EMin - binWidth/2) && (-scatteredPhotonEnergy < this.graph.EMax + binWidth/2)) {
      const binIndex = Utils.roundSymmetric( (-scatteredPhotonEnergy - this.graph.EMin) / binWidth ); // ToDo round cuts top and bottom bin in half - should allow a little extra space on either side.
      this.histogram[binIndex] += 1;
    }

    //do 10 more times for speed without energy diagram animation
    for( let i = 1; i < this.fasterDataProperty.value * 50; i++) {
      const oscillatorIndex = this.weightedRandom(this.peaks.value.strengths);

      const scatteredPhotonEnergy = oscillatorEnergy[oscillatorIndex] + oscillatorWidth[oscillatorIndex] * Math.tan(Math.PI*(phet.joist.random.nextDouble()-0.5));
      const binWidth = (this.graph.EMax -this.graph.EMin)/(this.graph.bins - 1);

      if ((-scatteredPhotonEnergy > this.graph.EMin - binWidth/2) && (-scatteredPhotonEnergy < this.graph.EMax + binWidth/2)) {
        const binIndex = Utils.roundSymmetric( (-scatteredPhotonEnergy - this.graph.EMin) / binWidth ); // ToDo round cuts top and bottom bin in half - should allow a little extra space on either side.
        this.histogram[binIndex] += 1;
      }
    }
  }

  /**
   * returns the index with the randomly selected index on a weighted basis
   * @protected
   */
  weightedRandom(oscillatorStrength) {
    const total = oscillatorStrength.reduce((a, b) => a + b, 0);
    const processPicker = total * phet.joist.random.nextDouble();
    let accumulate = 0;

    for (let i = 0; i < oscillatorStrength.length; i++) {
      accumulate += oscillatorStrength[i];
      if (processPicker <= accumulate) { return i;}
    }
  }
  
  /**
   * scatters photons that reach the sample position.
   * ToDo - Should be in PhotonSpace
   * @protected
   */
  scatterPhotons() {
    const self = this;
    this.photons.forEach( function( photon ) {
      if ( !photon.scattered && photon.positionProperty.get().x < 35 ) {// ToDo position of sample set empirically
        //console.log(photon.positionProperty.get().x, photon.positionProperty.get().y);
        const pathchoice = phet.joist.random.nextDouble();
        if (self.energyProperty.get() === 932) {
          if (pathchoice < 0.15) {
            photon.orientationProperty.set( 5 * Math.PI / 6 + self.detectorAngleProperty.get() );
          } else {
            photon.orientationProperty.set(phet.joist.random.nextDouble() * 2 * Math.PI);
          }
        }
        else {
          // Select one of the possible diffraction angles 15% + 1/(n+1) not diffracted 1/(n+1) in each possible diffraction direction.
          if ( self.kProperties.get().diffractionAngles.length > 1 && (pathchoice < 0.85) ){// ToDo Math.PI * 5/6 is just the initial angle of the photons in the simulation. Should be a constant or set by the light source/monochromator.
            photon.orientationProperty.set(Math.PI * 5/6  + self.Sample.orientationP.get()
              - self.kProperties.get().diffractionAngles[Math.floor(self.kProperties.get().diffractionAngles.length * (pathchoice/.85))] );
          }
        }
        photon.scattered = true;
      }
    } );
  }

  removePhoton( photon ) {
    // remove the photon from the visible space
    this.photonSpace.removePhoton( photon );

    // remove the photon from the base model
    const index = this.photons.indexOf( photon );
    if ( index > -1 ) {
      this.photons.splice( index, 1 );
    }
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    this.gun.step( dt );

    // move particles
    this.movePhotons( dt );

    // scatter photons at the sample
    this.scatterPhotons();

    // remove particles out of bounds
    this.cullPhotons();

    // update detected transitions
    this.RIXSTransitions.updateTransitions( dt );

    this.stepEmitter.emit( dt );
  }
}

/**
  * The function used to compute detector position so that photons can be detected
  * @param thetaFinal
  * @returns {Vector2} - change in wavenumber (= momentum/h_bar)
  */
 function computeDetectorCenter( detectorAngle ) { // ToDo hard coded numbers for now. Should fix up. 

  const detectorX = 34.5 + 90 * Math.cos(detectorAngle + 5 * Math.PI / 6 );
  const detectorY = 57.5 + 90 * Math.sin(detectorAngle + 5 * Math.PI / 6 );
  //console.log(detectorX, detectorY);
  return new Vector2(detectorX, detectorY);
}
 
 /**
 * The function used to compute strengths of various transitions
 * const oscillatorName = [ 'elastic', 'magnon/2J', 'xy', 'yz', 'z2', 'CT' ]; // names for the oscillators
 * @param thetaFinal
 * @param thetaInitial
 * @param phi
 * @returns {Array} - change in wavenumber (= momentum/h_bar)
 */
function computePeaks( thetaInitial, thetaFinal, energy, phi ) {
 const peaks = new Object();
 peaks.name = [ 'elastic', 'magnon/2J', 'xy', 'yz', 'z2', 'CT' ]; // names for the oscillators
 peaks.energies = [ 0, 0.4, 1.45, 1.78, 2.37, 5.5 ]; // energy relative to x2-y2 in eV
 peaks.widths = [ 0.06, 0.06, 0.09, 0.11, 0.12, 1 ]; // broadening parameters in eV
  if (energy === 932) {
    const oscillatorStrength = [ 0.04 , 0.04 , 0.4, 0.4, 0.4, 0.2 ]; // initiallize to default values for the oscillators
    const sinFinSq = Math.pow(Math.sin(thetaFinal),2);
    //const sinIniSq = Math.pow(Math.sin(thetaInitial),2);
    const cosFinSq = Math.pow(Math.cos(thetaFinal),2);
    const cosIniSq = Math.pow(Math.cos(thetaInitial),2);
    oscillatorStrength[0] = 4; // sigma-polarization
    oscillatorStrength[0] += 4 * cosIniSq * cosFinSq; // pi-polarization
    oscillatorStrength[0] = oscillatorStrength[0] / 10 ; // reduce by a factor of 10 for monochromator cutoff/self-absorption
    oscillatorStrength[1] = cosFinSq;// sigma-polarization
    oscillatorStrength[1] += cosIniSq; // pi-ploarization
    oscillatorStrength[1] = oscillatorStrength[1] / 2; // reduce by a factor of 2 to account for sigma+pi, magnon self-absorption, etc.
    oscillatorStrength[2] = 4 * cosFinSq + 1; // only sigma from now on, both normal and spin-flip
    oscillatorStrength[3] = 2 + 4 * sinFinSq;
    oscillatorStrength[4] = 5 / 3 + sinFinSq; // Based on graph - DOES NOT MATCH MY CALCULATION
    oscillatorStrength[5] = 5; // arbitrary for charge transfer - do not yet know angle dependence here
    peaks.strengths = oscillatorStrength;
  }
  else { peaks.strengths = [1, 0, 0 , 0, 0, 0]; }
  
  return peaks;
 }

/**
 * The function used to compute the change in the light's wavenumber vector (minus to account for coordinate/sample vs. light)
 * @param energy
 * @param finalEnergy
 * @param thetaInitial
 * @param thetaFinal
 * @returns {Vector2} - change in wavenumber (= momentum/h_bar)
 */
 function computeKProperties( energy, finalEnergy, thetaInitial, thetaFinal, phi, latticeConstants ) {
   const kP = {};
   const angleRel = Math.PI/2; // relative angle between surface normal and x-axis
   kP.kInitial = new Vector2( energy * EVtoInverseA * Math.cos(thetaInitial-angleRel), energy * EVtoInverseA * Math.sin(thetaInitial-angleRel) );
   kP.kFinal = new Vector2( finalEnergy * EVtoInverseA * Math.cos(thetaFinal-angleRel), finalEnergy * EVtoInverseA * Math.sin(thetaFinal-angleRel) );
   kP.deltaK = kP.kInitial.minus(kP.kFinal);
   kP.kProjection = new Vector3( kP.deltaK.x * Math.cos(phi), kP.deltaK.x * Math.sin(phi), kP.deltaK.y );
   const GbasisX = 2 * Math.PI / latticeConstants.x;
   const GbasisY = 2 * Math.PI / latticeConstants.y;
   const GbasisZ = 2 * Math.PI / latticeConstants.z;
   kP.reciprocolLatticeVector = new Vector3( kP.kProjection.x / GbasisX, kP.kProjection.y / GbasisY, kP.kProjection.z / GbasisZ );
  const G = new Vector3(0,0,0);
   const kI = new Vector3(kP.kInitial.x, 0, kP.kInitial.y);
   kP.diffractionAngles = [];
   const kMag=kP.kInitial.magnitude;
   for ( let h = Math.ceil( (-kI.x - kMag) / GbasisX ); h < Math.ceil( (kMag - kI.x) / GbasisX ) ; h++) {
     //for ( let k = Math.ceil( (-kI.y - kMag) / GbasisY ); k < Math.ceil( (kMag - kI.y) / GbasisY ) ; k++) { //ToDo can't display diffraction in 3rd dimension.
       for ( let l = Math.ceil( (-kI.z - kMag) / GbasisZ ); l < Math.ceil( (kMag - kI.z) / GbasisZ ) ; l++) {
         G.setXYZ(h*GbasisX,0*GbasisY,l*GbasisZ);
         if ( Math.abs(G.add(kI).magnitude - kI.magnitude) < 0.06 ) {
           kP.diffractionAngles.push(Math.atan2( G.z, G.x )+angleRel); //ToDo - might want to fix up the screwy way angles are difined relative to sample surface.
         }
     //  }
     }
   }
   return kP;
 }

/**
 * The function used compute the final angle relative to the sample
 * @param detectorAngle
 * @param sampleAngle
 * @returns var - final angle relative to the surface
 */
function computeFinalAngle( detectorAngle, sampleAngle ) {
 return sampleAngle - detectorAngle;
}

function computeFinalEnergy( initialEnergy ) {return initialEnergy; }

rixsSimulator.register( 'RixsSimulatorModel', RixsSimulatorModel );
export default RixsSimulatorModel;