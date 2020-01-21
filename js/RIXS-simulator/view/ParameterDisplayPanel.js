// Copyright 2019, University of Colorado Boulder

/**
 * Parameter display panel.
 *
 * @author Todd Holden (QCC of CUNY)
 */
define( function( require ) {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Range = require( 'DOT/Range' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  const rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  const RIXSColorProfile = require( 'RIXS_SIMULATOR/RIXS-simulator/view/RIXSColorProfile' );
  const RIXSConstants = require( 'RIXS_SIMULATOR/RIXSConstants' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  
  // strings
  const photonEnergyString = require( 'string!RIXS_SIMULATOR/photonEnergy' );
  const energyUnitsString = require( 'string!RIXS_SIMULATOR/energyUnits' );
  const angleUnitsString = require( 'string!RIXS_SIMULATOR/angleUnits' );
  const wnUnitsString = require( 'string!RIXS_SIMULATOR/wnUnits' );

  // constants
  const ENERGY_FONT = new PhetFont( { size: 22, weight: 'bold' } );
  const TITLE_COLOR = RIXSColorProfile.titlesTextProperty;
  const ENERGY_COLOR = RIXSColorProfile.energyTextProperty;
  const INSET = 10;
  const LABEL_SPACING = 5;
  
  /**
   * @param {model} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function ParameterDisplayPanel( model, tandem, options ) {

    options = _.extend( {
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
      energyText.text = 'Photon Energy=' + Util.toFixed( energy, 0 ) + ' ' + energyUnitsString;
    } );

    // Links the current energy to the energy text above the slider
    model.Sample.orientationP.link( angle => {
      sampleOrientationText.text = 'θ<sub>i</sub>=' + Util.toFixed( 180 - angle * 180 / Math.PI, 0 ) + angleUnitsString;
    } );

    // Links the current energy to the energy text above the slider
    model.detectorAngleProperty.link( angle => {
      detectorAngleText.text = 'θ<sub>d</sub>=' + Util.toFixed( angle * 180 / Math.PI, 0 ) + angleUnitsString;
    } );

    // Links the current energy to the energy text above the slider
    model.finalAngleProperty.link( angle => {
      finalAngleText.text = 'θ<sub>f</sub>=' + Util.toFixed( angle * 180 / Math.PI, 0 ) + angleUnitsString;
    } );

    // Links the current energy to the energy text above the slider
    model.Sample.anglePhiProperty.link( angle => {
      anglePhiText.text = 'φ=' + Util.toFixed( angle * 180 / Math.PI, 0 ) + angleUnitsString;
    } );

    // Links the current energy to the energy text above the slider
    model.kProperties.link( kProperties => {
      var deltaP = kProperties.deltaK.magnitude * 1.0545718E-24;
      deltaKText.text = 'Photon Δp: ' +  deltaP.toPrecision(2).toString() + ' kg·m/s';
      kProjectionText.text = 'Δk<sub>a</sub>: ' + kProperties.kProjection.x.toPrecision(2) + ' ' + wnUnitsString
                       + '<br>Δk<sub>b</sub>: ' + kProperties.kProjection.y.toPrecision(2) + ' ' + wnUnitsString
                       + '<br>Δk<sub>c</sub>: ' + kProperties.kProjection.z.toPrecision(2) + ' ' + wnUnitsString ;
      reciprocolLatticeText.text = 'H: ' + Util.toFixed( kProperties.reciprocolLatticeVector.x, 2 ) 
                             + '<br>K: ' + Util.toFixed( kProperties.reciprocolLatticeVector.y, 2 ) 
                             + '<br>L: ' + Util.toFixed( kProperties.reciprocolLatticeVector.z, 2 ) ;     
    } );

    /*// Links the current energy to the energy text above the slider
    model.kProjection.link( kProjection => {
      kProjectionText.text = 'Δk<sub>a</sub>: ' + kProjection.x.toPrecision(2) + ' ' + wnUnitsString
                       + '<br>Δk<sub>b</sub>: ' + kProjection.y.toPrecision(2) + ' ' + wnUnitsString
                       + '<br>Δk<sub>c</sub>: ' + kProjection.z.toPrecision(2) + ' ' + wnUnitsString ;
    } );*/

    /*/ Links the current energy to the energy text above the slider
    model.reciprocolLatticeVector.link( reciprocolLattice => {
      reciprocolLatticeText.text = 'H: ' + Util.toFixed( reciprocolLattice.x, 2 ) 
                             + '<br>K: ' + Util.toFixed( reciprocolLattice.y, 2 ) 
                             + '<br>L: ' + Util.toFixed( reciprocolLattice.z, 2 ) ;
    } );*/

    //this.addChild( energyText );

    var content = new Node();
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

  return inherit( Panel, ParameterDisplayPanel );
} );
