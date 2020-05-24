// Copyright 2019, University of Colorado Boulder

/**
 * Parameter display panel.
 *
 * @author Todd Holden (QCC of CUNY)
 */

  // modules
  import Color from '../../../../scenery/js/util/Color.js';
  import inherit from '../../../../phet-core/js/inherit.js';
  import merge from '../../../../phet-core/js/merge.js';
  import Node from '../../../../scenery/js/nodes/Node.js';
  import Panel from '../../../../sun/js/Panel.js';
  import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
  import RichText from '../../../../scenery/js/nodes/RichText.js';
  import rixsSimulator from '../../rixsSimulator.js';
  import rixsSimulatorStrings from '../../rixsSimulatorStrings.js';
  import Utils from '../../../../dot/js/Utils.js';

  // strings
  const energyUnitsString = rixsSimulatorStrings.energyUnits;
  const angleUnitsString = rixsSimulatorStrings.angleUnits;
  const wnUnitsString = rixsSimulatorStrings.wnUnits;

  // constants
  const ENERGY_FONT = new PhetFont( { size: 22, weight: 'bold' } );
  const INSET = 10;
  const LABEL_SPACING = 5;
  
  /**
   * @param {model} model
   * @param {Tandem} tandem
   * @constructor
   */
  function ParameterDisplayPanel( model, tandem, options ) {

    options = merge( {
      xMargin: 15,
      yMargin: 8,
      fill: '#F0F0F0',
      stroke: 'gray',
      lineWidth: 1,
      tandem: tandem
    }, options );

    // A text node that reflects the energy of the slider or main model
    const energyText = new RichText( '?', {
      font: ENERGY_FONT,
      fill: Color.BLACK,
      maxWidth: 400,
      tandem: tandem.createTandem( 'energyText' )
    } );

    // A text node that reflects incident angle of light
    const sampleOrientationText = new RichText( '?', {
      font: ENERGY_FONT,
      fill: Color.BLACK,
      maxWidth: 75,
      tandem: tandem.createTandem( 'sampleOrientationText' )
    } );

    // A text node that reflects the detector angle
    const detectorAngleText = new RichText( '?', {
      font: ENERGY_FONT,
      fill: Color.BLACK,
      maxWidth: 250,
      tandem: tandem.createTandem( 'detectorAngleText' )
    } );

    // A text node that reflects the outgoing angle of light
    const finalAngleText = new RichText( '?', {
      font: ENERGY_FONT,
      fill: Color.BLACK,
      maxWidth: 72,
      tandem: tandem.createTandem( 'detectorAngleText' )
    } );

    // A text node that reflects the energy of the slider or main model
    const anglePhiText = new RichText( '?', {
      font: ENERGY_FONT,
      fill: Color.BLACK,
      maxWidth: 250,
      tandem: tandem.createTandem( 'anglePhiText' )
    } );
    
    // A text node that reflects incident angle of light
    const deltaKText = new RichText( '?', {
      font: ENERGY_FONT,
      fill: Color.BLACK,
      maxWidth: 250,
      tandem: tandem.createTandem( 'deltaKText' )
    } );

    // A text node that reflects incident angle of light
    const kProjectionText = new RichText( '?', {
      font: ENERGY_FONT,
      fill: Color.BLACK,
      maxWidth: 250,
      tandem: tandem.createTandem( 'kProjectionText' )
    } );

    // A text node that reflects incident angle of light
    const reciprocolLatticeText = new RichText( '?', {
      font: ENERGY_FONT,
      fill: Color.BLACK,
      maxWidth: 250,
      tandem: tandem.createTandem( 'reciprocolLatticeText' )
    } );

    // Links the current energy to the energy text above the slider
    model.energyProperty.link( energy => {
      energyText.text = 'Photon Energy=' + Utils.toFixed( energy, 0 ) + ' ' + energyUnitsString;
    } );

    // Links the current energy to the energy text above the slider
    model.Sample.orientationP.link( angle => {
      sampleOrientationText.text = 'θ<sub>i</sub>=' + Utils.toFixed( 180 - angle * 180 / Math.PI, 0 ) + angleUnitsString;
    } );

    // Links the current energy to the energy text above the slider
    model.detectorAngleProperty.link( angle => {
      detectorAngleText.text = 'θ<sub>d</sub>=' + Utils.toFixed( angle * 180 / Math.PI, 0 ) + angleUnitsString;
    } );

    // Links the current energy to the energy text above the slider
    model.finalAngleProperty.link( angle => {
      finalAngleText.text = 'θ<sub>f</sub>=' + Utils.toFixed( angle * 180 / Math.PI, 0 ) + angleUnitsString;
    } );

    // Links the current energy to the energy text above the slider
    model.Sample.anglePhiProperty.link( angle => {
      anglePhiText.text = 'φ=' + Utils.toFixed( angle * 180 / Math.PI, 0 ) + angleUnitsString;
    } );

    // Links the current energy to the energy text above the slider
    model.kProperties.link( kProperties => {
      const deltaP = kProperties.deltaK.magnitude * 1.0545718E-24;
      deltaKText.text = 'Photon Δp: ' +  deltaP.toPrecision(2).toString() + ' kg·m/s';
      kProjectionText.text = 'Δk<sub>a</sub>: ' + kProperties.kProjection.x.toPrecision(2) + ' ' + wnUnitsString
                       + '<br>Δk<sub>b</sub>: ' + kProperties.kProjection.y.toPrecision(2) + ' ' + wnUnitsString
                       + '<br>Δk<sub>c</sub>: ' + kProperties.kProjection.z.toPrecision(2) + ' ' + wnUnitsString;
      reciprocolLatticeText.text = 'H: ' + Utils.toFixed( kProperties.reciprocolLatticeVector.x, 2 )
                             + '<br>K: ' + Utils.toFixed( kProperties.reciprocolLatticeVector.y, 2 )
                             + '<br>L: ' + Utils.toFixed( kProperties.reciprocolLatticeVector.z, 2 );
    } );

    const content = new Node();
    content.addChild( energyText );
    content.addChild( deltaKText );
    content.addChild( sampleOrientationText );
    content.addChild( finalAngleText );
    content.addChild( detectorAngleText );
    content.addChild( anglePhiText );
    content.addChild( kProjectionText );
    content.addChild( reciprocolLatticeText );
    
    energyText.left = INSET;
    energyText.top = INSET;
    deltaKText.left = INSET;
    deltaKText.top = energyText.bottom + LABEL_SPACING;
    sampleOrientationText.left = INSET;
    sampleOrientationText.top = deltaKText.bottom + LABEL_SPACING;
    finalAngleText.left = sampleOrientationText.right + 1.5 * INSET;
    finalAngleText.top = deltaKText.bottom + LABEL_SPACING;
    detectorAngleText.left = finalAngleText.right + 2.2 * INSET;
    detectorAngleText.top = deltaKText.bottom + LABEL_SPACING;
    anglePhiText.left = detectorAngleText.right + INSET;
    anglePhiText.top = deltaKText.bottom + LABEL_SPACING;
    kProjectionText.left = INSET;
    kProjectionText.top = sampleOrientationText.bottom + LABEL_SPACING;
    reciprocolLatticeText.left = kProjectionText.right + 5 * INSET;
    reciprocolLatticeText.top = sampleOrientationText.bottom + LABEL_SPACING;
    
    //slider.left = label.right + 10; 
    //slider.centerY = label.centerY;

    Panel.call( this, content, options );
  }

  rixsSimulator.register( 'ParameterDisplayPanel', ParameterDisplayPanel );

  inherit( Panel, ParameterDisplayPanel );
  export default ParameterDisplayPanel;