// Copyright 2019, University of Colorado Boulder

/**
 * @author Todd Holden (Queensborough Community College of CUNY)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var BeamNode = require( 'RIXS_SIMULATOR/RIXS-simulator/view/BeamNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  const Checkbox = require( 'SUN/Checkbox' );
  const Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  const EnergyLevelNode = require( 'RIXS_SIMULATOR/RIXS-simulator/view/EnergyLevelNode' );
  const GraphNode = require( 'RIXS_SIMULATOR/RIXS-simulator/view/GraphNode' );
  var LaserPointerNode = require( 'SCENERY_PHET/LaserPointerNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const MonochromatorNode = require( 'RIXS_SIMULATOR/RIXS-simulator/view/MonochromatorNode' );
  var Node = require( 'SCENERY/nodes/Node' );
 // const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const ParameterDisplayPanel = require( 'RIXS_SIMULATOR/RIXS-simulator/view/ParameterDisplayPanel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PhotonEnergySlider = require( 'RIXS_SIMULATOR/RIXS-simulator/view/PhotonEnergySlider' );
  const PhotonSpaceNode = require( 'RIXS_SIMULATOR/RIXS-simulator/view/PhotonSpaceNode' );
  const Property = require( 'AXON/Property' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const RIXSColorProfile = require( 'RIXS_SIMULATOR/RIXS-simulator/view/RIXSColorProfile' );
  const RIXSConstants = require( 'RIXS_SIMULATOR/RIXSConstants' );
  const rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  const RotatingNode = require( 'RIXS_SIMULATOR/RIXS-simulator/view/RotatingNode' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Slider = require( 'SUN/Slider' );
  const SynchrotronNode = require( 'RIXS_SIMULATOR/RIXS-simulator/view/SynchrotronNode' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );
  
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  
  
  // strings
  const photonEnergyString = require( 'string!RIXS_SIMULATOR/photonEnergy' );
  const energyUnitsString = require( 'string!RIXS_SIMULATOR/energyUnits' );
  
  // constants
  const ENERGY_FONT = new PhetFont( { size: 22, weight: 'bold' } );
  const TITLE_COLOR = RIXSColorProfile.titlesTextProperty;
  const ENERGY_COLOR = RIXSColorProfile.energyTextProperty;
  const INSET = 10;
  const ENERGY_LABEL_SPACING = 5;
  const GUN_ROTATION = -7 * Math.PI / 12; // so the laser pointer points to the sample
  const MOMENTUM_SCALAR = 1e2;
  const MOMENTUM_ARROW_OPTIONS = {fill: 'black', stroke: null, tailWidth: 2, headWidth: 10, headHeight: 30 };
  const LABEL_OPTIONS = RIXSConstants.LABEL_FONT;
  const kInitialText = new RichText( 'p<sub>i</sub>', LABEL_OPTIONS );
  const kFinalText = new RichText( 'p<sub>f</sub>', LABEL_OPTIONS );
  const deltaKText = new RichText( 'Δp~Δk', LABEL_OPTIONS );
  const deltaKSText = new RichText( 'Δk', LABEL_OPTIONS );
  const deltaKSTextP = new RichText( 'Δk<sub>||</sub>', LABEL_OPTIONS );
  const deltaKSTextS = new RichText( 'Δk<sub>Ʇ</sub>', LABEL_OPTIONS );
  
  
  
  // images
  const SampleImage = require( 'image!RIXS_SIMULATOR/sample.png' );
  const DetectorImage = require( 'image!RIXS_SIMULATOR/detector.png' );
  
  class RixsSimulatorScreenView extends ScreenView {

    /**
     * @param {RixsSimulatorModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super();

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

      var momentumDiagram = new Node();

      var kInitialArrow = new ArrowNode( 0, 0, 0, 0, MOMENTUM_ARROW_OPTIONS );
      momentumDiagram.addChild( kInitialArrow );

      var kInitialLabel = new Node( { children: [ kInitialText ] } );
      momentumDiagram.addChild( kInitialLabel );

      var kFinalArrow = new ArrowNode( 0, 0, 0, 0, MOMENTUM_ARROW_OPTIONS );
      momentumDiagram.addChild( kFinalArrow );

      var kFinalLabel = new Node( { children: [ kFinalText ] } );
      momentumDiagram.addChild( kFinalLabel );

      var deltaKArrow = new ArrowNode( 0, 0, 0, 0, MOMENTUM_ARROW_OPTIONS );
      momentumDiagram.addChild( deltaKArrow );

      var deltaKLabel = new Node( { children: [ deltaKText ] } );
      momentumDiagram.addChild( deltaKLabel );
      
      var deltaKSArrow = new ArrowNode( 0, 0, 0, 0, MOMENTUM_ARROW_OPTIONS );
      momentumDiagram.addChild( deltaKSArrow );

      var deltaKSLabel = new Node( { children: [ deltaKSText ] } );
      momentumDiagram.addChild( deltaKSLabel );
      
      var deltaKSArrowP = new ArrowNode( 0, 0, 0, 0, MOMENTUM_ARROW_OPTIONS );
      momentumDiagram.addChild( deltaKSArrowP );

      var deltaKSLabelP = new Node( { children: [ deltaKSTextP ] } );
      momentumDiagram.addChild( deltaKSLabelP );
      
      var deltaKSArrowS = new ArrowNode( 0, 0, 0, 0, MOMENTUM_ARROW_OPTIONS );
      momentumDiagram.addChild( deltaKSArrowS );
      
      var deltaKSLabelS = new Node( { children: [ deltaKSTextS ] } );
      momentumDiagram.addChild( deltaKSLabelS );
      

      const SampleNode = new RotatingNode(SampleImage, sampleCenter, sampleCenter, model.Sample.orientationP , tandem ); // need it like this to get reset to run
      const DetectorNode = new RotatingNode(DetectorImage, detectorStart, sampleCenter, model.detectorAngleProperty , tandem ); // need it like this to get reset to run
      const parameterDisplayPanel = new ParameterDisplayPanel(model, tandem.createTandem( 'parameterDisplayPanel' ), { maxWidth: 410 } );

      const EnergySliderNode = new PhotonEnergySlider(model.energyProperty, {
        tandem: tandem.createTandem( 'EnergySliderNode' )
      } );   

        // Add slider to rotate sample about c-axis
        var phiRange = new RangeWithValue( -Math.PI/2, Math.PI/2, 0 );        
        var phiSlider = new Slider( model.Sample.anglePhiProperty, phiRange );
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
        energyText.text = Util.toFixed( energy, 0 ) + ' ' + energyUnitsString;
        energyText.centerX = energyLabel.centerX; // In case the size of the energy text changes
      } );

      // Links the current energy to the energy text above the slider
      /* ToDo might be better accomlished with one big Multilink instead of all the derived properties - i.e. 
       *var momentumDiagramMultilink = Property.multilink( [
       *model.sample.orientationP, model.detectorAngleProperty, model.energyProperty, model.anglePhiProperty, ...
       *], updateMomentumDiagram );
       * test for better performance
       */ 
      model.kProperties.link( kProperties => {
        kInitialArrow.setTailAndTip( 450, 200,
          450 + Math.round(MOMENTUM_SCALAR * kProperties.kInitial.magnitude * Math.cos( Math.PI * 5 / 6 ) ),
          200 - Math.round(MOMENTUM_SCALAR * kProperties.kInitial.magnitude * Math.sin( Math.PI * 5 / 6 ) )
        );
        kInitialLabel.left = kInitialArrow.tipX + 5;
        kInitialLabel.y = kInitialArrow.tipY - 3;

        kFinalArrow.setTailAndTip( 450, 200,
          450 + Math.round(MOMENTUM_SCALAR * kProperties.kFinal.magnitude * Math.cos( model.detectorAngleProperty.value + Math.PI * 5 / 6 ) ),
          200 - Math.round(MOMENTUM_SCALAR * kProperties.kFinal.magnitude * Math.sin( model.detectorAngleProperty.value + Math.PI * 5 / 6) )
        );
        kFinalLabel.left = kFinalArrow.tipX + 5;
        kFinalLabel.y = kFinalArrow.tipY;

        deltaKArrow.setTailAndTip( kInitialArrow.tipX, kInitialArrow.tipY, kFinalArrow.tipX, kFinalArrow.tipY );
        deltaKLabel.right = deltaKArrow.tipX - 10;
        deltaKLabel.y = deltaKArrow.tipY;

        var sRotationAngle = kProperties.kInitial.angle - 2 * Math.PI / 3;
        var xStart = Math.round(sampleCenter.x + sampleThickness * Math.cos(sRotationAngle));
        var yStart = Math.round(sampleCenter.y - sampleThickness * Math.sin(sRotationAngle));
        deltaKSArrow.setTailAndTip(xStart , yStart, xStart + kFinalArrow.tipX - kInitialArrow.tipX, 
          yStart + kFinalArrow.tipY - kInitialArrow.tipY);
        deltaKSLabel.left = deltaKSArrow.tipX + 3;
        deltaKSLabel.y = deltaKSArrow.tipY + 3;
  
        deltaKSArrowP.setTailAndTip(xStart , yStart, 
          Math.round(xStart - MOMENTUM_SCALAR * kProperties.deltaK.x * Math.sin(sRotationAngle)) ,
          Math.round(yStart - MOMENTUM_SCALAR * kProperties.deltaK.x * Math.cos(sRotationAngle)) );
          deltaKSLabelP.left = deltaKSArrowP.tipX + 3;
          deltaKSLabelP.y = deltaKSArrowP.tipY + 3;
    
        deltaKSArrowS.setTailAndTip(xStart , yStart, 
          Math.round(xStart + MOMENTUM_SCALAR * kProperties.deltaK.y * Math.cos(sRotationAngle)) ,
          Math.round(yStart - MOMENTUM_SCALAR * kProperties.deltaK.y * Math.sin(sRotationAngle)) );
          deltaKSLabelS.left = deltaKSArrowS.tipX + 3;
          deltaKSLabelS.y = deltaKSArrowS.tipY + 3;  
      } );

      // photon animation space
      var spaceNodeX = 300; //ToDo - do this layout better
      var spaceNodeY = -100;
      var spaceNodeBounds = new Bounds2( spaceNodeX, spaceNodeY,
        spaceNodeX + RIXSConstants.SPACE_NODE_WIDTH,
        spaceNodeY + RIXSConstants.SPACE_NODE_HEIGHT );
      var modelViewTransform = new ModelViewTransform2.createRectangleInvertedYMapping( model.bounds, spaceNodeBounds );

      // @protected for layout in subtypes
      var photonSpaceNode = new PhotonSpaceNode( model.photonSpace, this.showPhotonTraceProperty, modelViewTransform, {
        canvasBounds: spaceNodeBounds 
      } );

      var energyLevelNode = new EnergyLevelNode( 842, 392 );
      
      const graphWidth = 500;
      const graphHeight = 200;
      const graphNodeX = INSET + 230;
      const graphNodeY = this.layoutBounds.maxY - INSET;
      var graphNodeBounds = new Bounds2( graphNodeX, graphNodeY,
        graphNodeX + graphWidth,
        graphNodeY + graphHeight );

      var graphNode = new GraphNode( model.histogram, model.peaks, model.graph, {
        font: ENERGY_FONT2,
        canvasBounds: graphNodeBounds 
      } );
    //  this.dataPointsNode = this.graphNode.dataPoints( model.histogram, model.graph );
    //  this.addChild(this.dataPointsNode);
      var slowDown = 1;

      // update view on model step
      model.addStepListener( function( dt ) {
        photonSpaceNode.invalidatePaint();
        energyLevelNode.paintArrows( model.RIXSTransitions.transitions );
        if (slowDown == 10) {
          slowDown = 1;
          graphNode.dataPoints( model.histogram, model.graph );
          if (model.modelVisibleProperty.value) graphNode.modelShape( model.peaks.get(), model.graph );
          else graphNode.mainGraph.removeAllChildren();
        }
        else slowDown++;
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
      
      var nucleusVisible = 0;

      model.photonSpace.isVisible = !nucleusVisible;

      photonSpaceNode.visible = !nucleusVisible;

      
      this.addChild( this.spaceNode );
      
      const resetAllButton = new ResetAllButton( {
        listener: () => {
          model.reset();
          SampleNode.reset();
          DetectorNode.reset();
          EnergySliderNode.reset();
          model.gun.onProperty.reset();
        },
        right: this.layoutBounds.maxX - INSET,
        bottom: this.layoutBounds.maxY - INSET,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );

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
      
      this.addChild( resetAllButton );
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




      var ENERGY_FONT2 = new PhetFont( { size: 50, weight: 'bold' } );
  
    
      const diagText = new RichText( 'Energy diagram<br>(log scale)', {
        font: ENERGY_FONT2,
        fill: Color.YELLOW,
        maxWidth: 150,
        align: 'center',
        top: 332,
        centerX: 912
      } );

      this.addChild( diagText );
    

    }

    // @public
   // step( dt ) {
      //TODO Handle view animation here.
      //console.log('hi');
    //}
  }

  return rixsSimulator.register( 'RixsSimulatorScreenView', RixsSimulatorScreenView );
} );