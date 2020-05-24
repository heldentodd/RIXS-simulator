// Copyright 2020, University of Colorado Boulder

/**
 * @author Todd Holden
 */

// modules
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import BeamNode from './BeamNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Color from '../../../../scenery/js/util/Color.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import EnergyLevelNode from './EnergyLevelNode.js';
import GraphNode from './GraphNode.js';
import LaserPointerNode from '../../../../scenery-phet/js/LaserPointerNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MonochromatorNode from './MonochromatorNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import ParameterDisplayPanel from './ParameterDisplayPanel.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PhotonEnergySlider from './PhotonEnergySlider.js';
import PhotonSpaceNode from './PhotonSpaceNode.js';
import Property from '../../../../axon/js/Property.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import RIXSColorProfile from './RIXSColorProfile.js';
import RIXSConstants from '../RIXSConstants.js';
import rixsSimulator from '../../rixsSimulator.js';
import RixsSimulatorConstants from '../../common/RixsSimulatorConstants.js';
import rixsSimulatorStrings from '../../rixsSimulatorStrings.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import RotatingNode from './RotatingNode.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import Slider from '../../../../sun/js/Slider.js';
import SynchrotronNode from './SynchrotronNode.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Utils from '../../../../dot/js/Utils.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Vector2 from '../../../../dot/js/Vector2.js';

// images
import SampleImage from '../../../images/sample_png.js';
import DetectorImage from '../../../images/detector_png.js';

// strings
const photonEnergyString = rixsSimulatorStrings.photonEnergy;
const energyUnitsString = rixsSimulatorStrings.energyUnits;

// constants
const ENERGY_FONT = new PhetFont({ size: 22, weight: 'bold' });
const TITLE_COLOR = RIXSColorProfile.titlesTextProperty;
const INSET = 10;
const ENERGY_LABEL_SPACING = 5;
const ENERGY_FONT2 = new PhetFont( { size: 50, weight: 'bold' } );
const GUN_ROTATION = -7 * Math.PI / 12; // so the laser pointer points to the sample
const MOMENTUM_SCALAR = 1e2;
const MOMENTUM_ARROW_OPTIONS = { fill: 'black', stroke: null, tailWidth: 2, headWidth: 10, headHeight: 30 };
const LABEL_OPTIONS = RIXSConstants.LABEL_FONT;
const kInitialText = new RichText('p<sub>i</sub>', LABEL_OPTIONS);
const kFinalText = new RichText('p<sub>f</sub>', LABEL_OPTIONS);
const deltaKText = new RichText('Δp~Δk', LABEL_OPTIONS);
const deltaKSText = new RichText('Δk', LABEL_OPTIONS);
const deltaKSTextP = new RichText('Δk<sub>||</sub>', LABEL_OPTIONS);
const deltaKSTextS = new RichText('Δk<sub>Ʇ</sub>', LABEL_OPTIONS);

class RixsSimulatorScreenView extends ScreenView {

  /**
   * @param {RixsSimulatorModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( {
      tandem: tandem
    } );

    // properties
    this.showPhotonTraceProperty = new Property( RIXSConstants.DEFAULT_SHOW_TRACES );

    // @protected for layout in subtypes, alpha particle gun
    this.gunNode = new LaserPointerNode( model.gun.onProperty, {
      left: this.layoutBounds.right - 92,
      top: this.layoutBounds.centerY - 109,
      bodySize: new Dimension2( 75, 68 ),
      nozzleSize: new Dimension2( 20, 60 ),
      topColor: 'rgb(211, 140, 70)',
      highlightColor: 'rgb(229, 186, 144)',
      bottomColor: 'rgb(106, 70, 35)',
      buttonColor: 'rgb(0, 203, 230)',
      rotation: GUN_ROTATION, // pointing up
      buttonRotation: -GUN_ROTATION, // so button lighting is correct
      buttonAccessibleName: 'hi1',//toggleAlphaParticleString,
      buttonDescriptionContent: 'hi2' //alphaParticlesHelpTextString
    } );
    this.addChild( this.gunNode );

     // @protected, alpha particle beam
     this.beamNode = new BeamNode( model.gun.onProperty, {
      centerX: 890,
      bottom: 187,
      rotation: - Math.PI / 3,
      fill: 'white' //RIXSColorProfile.photonBeamColorProperty
    } );
    this.addChild( this.beamNode );


    const sampleCenter = new Vector2(this.layoutBounds.maxX - 400, 40);
    const sampleThickness = 20;
    const detectorStart = new Vector2(this.layoutBounds.maxX - 400, 240);

    const momentumDiagram = new Node();

    const kInitialArrow = new ArrowNode( 0, 0, 0, 0, MOMENTUM_ARROW_OPTIONS );
    momentumDiagram.addChild( kInitialArrow );

    const kInitialLabel = new Node( { children: [ kInitialText ] } );
    momentumDiagram.addChild( kInitialLabel );

    const kFinalArrow = new ArrowNode( 0, 0, 0, 0, MOMENTUM_ARROW_OPTIONS );
    momentumDiagram.addChild( kFinalArrow );

    const kFinalLabel = new Node( { children: [ kFinalText ] } );
    momentumDiagram.addChild( kFinalLabel );

    const deltaKArrow = new ArrowNode( 0, 0, 0, 0, MOMENTUM_ARROW_OPTIONS );
    momentumDiagram.addChild( deltaKArrow );

    const deltaKLabel = new Node( { children: [ deltaKText ] } );
    momentumDiagram.addChild( deltaKLabel );
    
    const deltaKSArrow = new ArrowNode( 0, 0, 0, 0, MOMENTUM_ARROW_OPTIONS );
    momentumDiagram.addChild( deltaKSArrow );

    const deltaKSLabel = new Node( { children: [ deltaKSText ] } );
    momentumDiagram.addChild( deltaKSLabel );
    
    const deltaKSArrowP = new ArrowNode( 0, 0, 0, 0, MOMENTUM_ARROW_OPTIONS );
    momentumDiagram.addChild( deltaKSArrowP );

    const deltaKSLabelP = new Node( { children: [ deltaKSTextP ] } );
    momentumDiagram.addChild( deltaKSLabelP );
    
    const deltaKSArrowS = new ArrowNode( 0, 0, 0, 0, MOMENTUM_ARROW_OPTIONS );
    momentumDiagram.addChild( deltaKSArrowS );
    
    const deltaKSLabelS = new Node( { children: [ deltaKSTextS ] } );
    momentumDiagram.addChild( deltaKSLabelS );
    

    const SampleNode = new RotatingNode(SampleImage, sampleCenter, sampleCenter, model.Sample.orientationP , tandem ); // need it like this to get reset to run
    const DetectorNode = new RotatingNode(DetectorImage, detectorStart, sampleCenter, model.detectorAngleProperty , tandem ); // need it like this to get reset to run
    const parameterDisplayPanel = new ParameterDisplayPanel(model, tandem.createTandem( 'parameterDisplayPanel' ), { maxWidth: 410 } );

    const EnergySliderNode = new PhotonEnergySlider(model.energyProperty, {
      tandem: tandem.createTandem( 'EnergySliderNode' )
    } );

      // Add slider to rotate sample about c-axis
      const phiRange = new RangeWithValue( -Math.PI/2, Math.PI/2, 0 );
      const phiSlider = new Slider( model.Sample.anglePhiProperty, phiRange );
      const phiSliderText = new RichText( 'Rotate around<br>c-axis (φ)', {
        font: ENERGY_FONT,
        fill: Color.YELLOW,
        align: 'center',
        maxWidth: 130,
        centerX: 900 } );
      phiSlider.centerX = 900;
      phiSlider.top = phiSliderText.bottom + INSET;
      this.addChild( phiSliderText );
      this.addChild( phiSlider );

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
      energyText.text = Utils.toFixed( energy, 0 ) + ' ' + energyUnitsString;
      energyText.centerX = energyLabel.centerX; // In case the size of the energy text changes
    } );

    model.kProperties.link( kProperties => {
      kInitialArrow.setTailAndTip( 450, 200,
        450 + Utils.roundSymmetric(MOMENTUM_SCALAR * kProperties.kInitial.magnitude * Math.cos( Math.PI * 5 / 6 ) ),
        200 - Utils.roundSymmetric(MOMENTUM_SCALAR * kProperties.kInitial.magnitude * Math.sin( Math.PI * 5 / 6 ) )
      );
      kInitialLabel.left = kInitialArrow.tipX + 5;
      kInitialLabel.y = kInitialArrow.tipY - 3;

      kFinalArrow.setTailAndTip( 450, 200,
        450 + Utils.roundSymmetric(MOMENTUM_SCALAR * kProperties.kFinal.magnitude * Math.cos( model.detectorAngleProperty.value + Math.PI * 5 / 6 ) ),
        200 - Utils.roundSymmetric(MOMENTUM_SCALAR * kProperties.kFinal.magnitude * Math.sin( model.detectorAngleProperty.value + Math.PI * 5 / 6) )
      );
      kFinalLabel.left = kFinalArrow.tipX + 5;
      kFinalLabel.y = kFinalArrow.tipY;

      deltaKArrow.setTailAndTip( kInitialArrow.tipX, kInitialArrow.tipY, kFinalArrow.tipX, kFinalArrow.tipY );
      deltaKLabel.right = deltaKArrow.tipX - 10;
      deltaKLabel.y = deltaKArrow.tipY;

      const sRotationAngle = kProperties.kInitial.angle - 2 * Math.PI / 3;
      const xStart = Utils.roundSymmetric(sampleCenter.x + sampleThickness * Math.cos(sRotationAngle));
      const yStart = Utils.roundSymmetric(sampleCenter.y - sampleThickness * Math.sin(sRotationAngle));
      deltaKSArrow.setTailAndTip(xStart , yStart, xStart + kFinalArrow.tipX - kInitialArrow.tipX,
        yStart + kFinalArrow.tipY - kInitialArrow.tipY);
      deltaKSLabel.left = deltaKSArrow.tipX + 3;
      deltaKSLabel.y = deltaKSArrow.tipY + 3;

      deltaKSArrowP.setTailAndTip(xStart , yStart,
        Utils.roundSymmetric(xStart - MOMENTUM_SCALAR * kProperties.deltaK.x * Math.sin(sRotationAngle)) ,
        Utils.roundSymmetric(yStart - MOMENTUM_SCALAR * kProperties.deltaK.x * Math.cos(sRotationAngle)) );
        deltaKSLabelP.left = deltaKSArrowP.tipX + 3;
        deltaKSLabelP.y = deltaKSArrowP.tipY + 3;
  
      deltaKSArrowS.setTailAndTip(xStart , yStart,
        Utils.roundSymmetric(xStart + MOMENTUM_SCALAR * kProperties.deltaK.y * Math.cos(sRotationAngle)) ,
        Utils.roundSymmetric(yStart - MOMENTUM_SCALAR * kProperties.deltaK.y * Math.sin(sRotationAngle)) );
        deltaKSLabelS.left = deltaKSArrowS.tipX + 3;
        deltaKSLabelS.y = deltaKSArrowS.tipY + 3;
    } );

    // photon animation space
    const spaceNodeX = 300; //ToDo - do this layout better
    const spaceNodeY = -100;
    const spaceNodeBounds = new Bounds2( spaceNodeX, spaceNodeY,
      spaceNodeX + RIXSConstants.SPACE_NODE_WIDTH,
      spaceNodeY + RIXSConstants.SPACE_NODE_HEIGHT );
    const modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( model.bounds, spaceNodeBounds );

    // @protected for layout in subtypes
    const photonSpaceNode = new PhotonSpaceNode( model.photonSpace, this.showPhotonTraceProperty, modelViewTransform, {
      canvasBounds: spaceNodeBounds
    } );

    const energyLevelNode = new EnergyLevelNode( 842, 392 );
    
    const graphWidth = 500;
    const graphHeight = 200;
    const graphNodeX = INSET + 230;
    const graphNodeY = this.layoutBounds.maxY - INSET;
    const graphNodeBounds = new Bounds2( graphNodeX, graphNodeY,
      graphNodeX + graphWidth,
      graphNodeY + graphHeight );

    const graphNode = new GraphNode( model.histogram, model.peaks, model.graph, {
      font: ENERGY_FONT2,
      canvasBounds: graphNodeBounds
    } );
    let slowDown = 1;

    // update view on model step
    model.addStepListener( function( dt ) {
      photonSpaceNode.invalidatePaint();
      energyLevelNode.paintArrows( model.RIXSTransitions.transitions );
      if (slowDown === 10) {
        slowDown = 1;
        graphNode.dataPoints( model.histogram, model.graph );
        if (model.modelVisibleProperty.value) { graphNode.modelShape( model.peaks.get(), model.graph ); }
        else { graphNode.mainGraph.removeAllChildren(); }
      }
      else { slowDown++; }
    } );

    // 3 checkboxes: Show Model, Show Data (or error bars), Take Data 10x faster
    const checkboxOptions = {
      checkboxColorBackground: 'black',
      checkboxColor: 'white'
    };
    const DISPLAY_FONT = new PhetFont( 18 );
    const CHECKBOX_TEXT_FILL = 'blackbodyColorProfile.white';
    const CHECKBOX_TEXT_WIDTH = 130;
    const checkboxTextOptions = { font: DISPLAY_FONT, fill: CHECKBOX_TEXT_FILL, maxWidth: CHECKBOX_TEXT_WIDTH };
    const showModelCheckbox = new Checkbox( new Text( 'show model', checkboxTextOptions ), model.modelVisibleProperty, checkboxOptions );
   /* const intensityCheckbox = new Checkbox( 'show data', model.intensityVisibleProperty,
      _.assign( checkboxOptions, { tandem: options.tandem.createTandem( 'intensityCheckbox' ) } )
    );*/
    const FasterCheckbox = new Checkbox( new Text('Data 50x faster', checkboxTextOptions ), model.fasterDataProperty,
      _.assign( checkboxOptions )
    );

    showModelCheckbox.touchArea = showModelCheckbox.localBounds.dilated( 6 );
    FasterCheckbox.touchArea = FasterCheckbox.localBounds.dilated( 6 );
  
    const checkboxes = new VBox( {
      children: [
        showModelCheckbox,
        FasterCheckbox
      ],
      align: 'left',
      spacing: 10
    } );

    // Erase button
    const clearDataButton = new TextPushButton('Clear Data', {
      iconWidth: 150,
      maxWidth: 150,
      font: DISPLAY_FONT,
      listener: () => {
        model.histogram.fill(0);
      }
    } );



    this.spaceNode = photonSpaceNode;
    this.spaceNode.visible = 'true';
    
    const nucleusVisible = 0;

    model.photonSpace.isVisible = !nucleusVisible;

    photonSpaceNode.visible = !nucleusVisible;

    this.addChild( this.spaceNode );
    
    graphNode.left = graphNodeX;
    graphNode.bottom = graphNodeY;
    //resetAllButton.right = this.layoutBounds.maxX - INSET;
    //resetAllButton.bottom = this.layoutBounds.maxY - INSET;
    EnergySliderNode.left = INSET;
    energyLabel.centerX = EnergySliderNode.right + EnergySliderNode.thermometerCenterXFromRight;
    energyText.centerX = energyLabel.centerX;
    energyLabel.top = this.layoutBounds.maxY /2;
    energyText.top = energyLabel.bottom + ENERGY_LABEL_SPACING;
    EnergySliderNode.top = energyText.bottom + ENERGY_LABEL_SPACING;
    //parameterDisplayPanel.left = 200;
    //parameterDisplayPanel.top = 200;
    //SampleNode.Image.centerX = this.layoutBounds.maxX - 400;
    //SampleNode.Image.centerY = 40;
    checkboxes.top = parameterDisplayPanel.bottom +10;
    clearDataButton.top = checkboxes.bottom +5;
    clearDataButton.left = 20;
    
    this.addChild( new SynchrotronNode(this.layoutBounds.maxX - 60, this.layoutBounds.maxY / 3 -10) );
    this.addChild( new MonochromatorNode(this.layoutBounds.maxX - 180, this.layoutBounds.maxY / 3 - 50) );
    this.addChild( SampleNode );
    this.addChild( DetectorNode );
    this.addChild( EnergySliderNode );
    this.addChild( energyLabel );
    this.addChild( energyText );
    this.addChild( parameterDisplayPanel );
    this.addChild( momentumDiagram );
    this.addChild( energyLevelNode );
    this.addChild( graphNode );
    this.addChild(checkboxes);
    this.addChild(clearDataButton);

    const diagText = new RichText( 'Energy diagram<br>(log scale)', {
      font: ENERGY_FONT2,
      fill: Color.YELLOW,
      maxWidth: 150,
      align: 'center',
      top: 332,
      centerX: 912
    } );

    this.addChild( diagText );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
        SampleNode.reset();
        DetectorNode.reset();
        EnergySliderNode.reset();
        model.gun.onProperty.reset();
      },
      right: this.layoutBounds.maxX - RixsSimulatorConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - RixsSimulatorConstants.SCREEN_VIEW_Y_MARGIN,
//      right: this.layoutBounds.maxX - INSET,
//      bottom: this.layoutBounds.maxY - INSET,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
  }

  /**
   * Steps the view.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

rixsSimulator.register( 'RixsSimulatorScreenView', RixsSimulatorScreenView );
export default RixsSimulatorScreenView;