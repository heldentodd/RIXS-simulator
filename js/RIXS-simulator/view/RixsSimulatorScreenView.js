// Copyright 2019, University of Colorado Boulder

/**
 * @author Todd Holden (Queensborough Community College of CUNY)
 */
define( function( require ) {
  'use strict';

  // modules
  const RIXSColorProfile = require( 'RIXS_SIMULATOR/RIXS-simulator/view/RIXSColorProfile' );
  const RIXSConstants = require( 'RIXS_SIMULATOR/RIXSConstants' );
  const SynchrotronNode = require( 'RIXS_SIMULATOR/RIXS-simulator/view/SynchrotronNode' );
  const MonochromatorNode = require( 'RIXS_SIMULATOR/RIXS-simulator/view/MonochromatorNode' );
  const SampleNode = require( 'RIXS_SIMULATOR/RIXS-simulator/view/SampleNode' );
  const PhotonEnergySlider = require( 'RIXS_SIMULATOR/RIXS-simulator/view/PhotonEnergySlider' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Color = require( 'SCENERY/util/Color' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  
  // strings
  const photonEnergyString = require( 'string!RIXS_SIMULATOR/photonEnergy' );
  const energyUnitsString = require( 'string!RIXS_SIMULATOR/energyUnits' );

  // constants
  const ENERGY_FONT = new PhetFont( { size: 22, weight: 'bold' } );
  const TITLE_COLOR = RIXSColorProfile.titlesTextProperty;
  const ENERGY_COLOR = RIXSColorProfile.energyTextProperty;
  const INSET = 10;
  const ENERGY_LABEL_SPACING = 5;


  class RixsSimulatorScreenView extends ScreenView {

    /**
     * @param {RixsSimulatorModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super();

      const SSampleNode = new SampleNode(this.layoutBounds.maxX - 400, 40, model, tandem ); // need it like this to get reset to run
      
      const EnergySliderNode = new PhotonEnergySlider(model.energyProperty, {
        tandem: tandem.createTandem( 'EnergySliderNode' )
      } );

      const energyLabel = new RichText( photonEnergyString, {
        font: RIXSConstants.LABEL_FONT,
        fill: TITLE_COLOR,
        align: 'center',
        maxWidth: 130,
        tandem: tandem.createTandem( 'energyLabel' )
      } );

      // A text node that reflects the energy of the slider or main model
      const energyText = new Text( '?', {
        font: ENERGY_FONT,
        fill: Color.YELLOW,
        maxWidth: 130,
        tandem: tandem.createTandem( 'energyText' )
      } );

      // Links the current energy to the energy text above the slider
      model.energyProperty.link( energy => {
        energyText.text = Util.toFixed( energy, 0 ) + ' ' + energyUnitsString;
        energyText.centerX = energyLabel.centerX; // In case the size of the energy text changes
      } );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          model.reset();
          SSampleNode.reset();
          EnergySliderNode.reset();
        },
        right: this.layoutBounds.maxX - INSET,
        bottom: this.layoutBounds.maxY - INSET,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      
      //graphNode.left = INSET;
      //graphNode.bottom = this.layoutBounds.maxY - INSET;
      //resetAllButton.right = this.layoutBounds.maxX - INSET;
      //resetAllButton.bottom = this.layoutBounds.maxY - INSET;
      EnergySliderNode.left = 100 + INSET;
      energyLabel.centerX = EnergySliderNode.right + EnergySliderNode.thermometerCenterXFromRight;
      energyText.centerX = energyLabel.centerX;
      energyLabel.top = INSET + ENERGY_LABEL_SPACING;
      energyText.top = energyLabel.bottom + ENERGY_LABEL_SPACING;
      EnergySliderNode.top = energyText.bottom + ENERGY_LABEL_SPACING;
      
      this.addChild( resetAllButton );
      this.addChild( new SynchrotronNode(this.layoutBounds.maxX - 60, this.layoutBounds.maxY / 3) );
      this.addChild( new MonochromatorNode(this.layoutBounds.maxX - 180, this.layoutBounds.maxY / 3 - 40) );
      this.addChild( SSampleNode );
      this.addChild( EnergySliderNode );
      this.addChild( energyLabel );
      this.addChild( energyText );

    }

    // @public
   // step( dt ) {
      //TODO Handle view animation here.
      //console.log('hi');
    //}
  }

  return rixsSimulator.register( 'RixsSimulatorScreenView', RixsSimulatorScreenView );
} );