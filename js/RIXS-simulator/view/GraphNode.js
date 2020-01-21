// Copyright 2014-2019, University of Colorado Boulder

/**
 * Graph Node responsible for positioning all of the graph elements
 * Handles or controls the majority of the over-arching graph logic
 *
 * @author Modified from Blackbody simulator by Todd Holden (QCC) Martin Veillette (Berea College)
 * @author Saurabh Totey
 * @author Arnab Purkayastha
 */
define( require => {
  'use strict';

  // modules
  const ColorConstants = require( 'SUN/ColorConstants' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  const Shape = require( 'KITE/Shape' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Vector2 = require( 'DOT/Vector2' );
  const WavelengthSpectrumNode = require( 'SCENERY_PHET/WavelengthSpectrumNode' );
  const ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  // constants
  const GRAPH_NUMBER_POINTS = 300; // number of points the theoretical curve is evaluated at
  const DEFAULT_LINE_WIDTH = 5; // regular line width for graph paths
  const OVERLAID_LINE_WIDTH = 3; // line width when saved graphs are initially created

  class GraphNode extends Node {

    /**
     * The node that handles keeping all of the graph elements together and working
     * @param {BlackbodySpectrumModel} model - model for the entire screen
     * @param {Object} options
     */
    constructor( histogram, peaks, graphParms, options ) {

      options = _.extend( {
        savedGraphPathColor: 'gray',
        intensityPathFillColor: 'rgba(100,100,100,0.75)',
        graphPathOptions: {
          stroke: PhetColorScheme.RED_COLORBLIND,
          lineWidth: DEFAULT_LINE_WIDTH / 5,
          lineJoin: 'round',
          lineCap: 'round'
        },
        axesPathOptions: {
            stroke: 'black',
            lineWidth: 3,
            lineCap: 'round',
            lineJoin: 'round',
            fill: 'white'
        },
        tandem: Tandem.required
      }, options );
      

      super();

      // @private
     //    this.model = model;

      // @private The axes with the ticks and EM spectrum labels
     //    this.axes = new ZoomableAxesView( model, { tandem: options.tandem.createTandem( 'axesView' ) } );

     /*     // @private Paths for the main and saved graphs
      this.mainGraph = new Path( null, options.graphPathOptions );
  
      this.innerGraphOverAxes.addChild( this.mainGraph );
      // Links different parts of GraphNode to update whenever specified tracked Properties change
      const updateMainGraphAndLayout = () => {
        this.update();
        this.moveMainGraphToFront();
      };
      const updateSavedGraphAndLayout = () => {
        this.updateSavedGraphPaths();
        this.moveSavedGraphToFront();
      };
      const updateAllGraphs = () => {
        this.update();
        this.updateSavedGraphPaths();
      };
    */ 
      // Sets layout of graph node elements to be all ultimately relative to the axes
      this.horizontalAxisLength = 500; // should get from canvasBounds
      this.verticalAxisLength = 200;
      this.addChild(new Path(new Shape().rect(0, 0, this.horizontalAxisLength, -this.verticalAxisLength), {fill: 'white'}));
      this.axesPath = new Path(
        new Shape()
          .moveTo( this.horizontalAxisLength, -5 )
          .lineTo( this.horizontalAxisLength, 0 )
          .lineTo( 0, 0 )
          .lineTo( 0, -this.verticalAxisLength )
          .lineTo( 5, -this.verticalAxisLength )
          /*.addPoint( this.horizontalAxisLength, -this.verticalAxisLength )*/,
        options.axesPathOptions
      );
     // const axesPath = this.axesPath;
     //  this.addChild( this.axes );
       this.addChild( this.axesPath );

 /* The old way the other program did it.
      this.mainGraph = new Path( null, options.graphPathOptions ); // too verbose, but may add flexibility later
       const updatedGraphShape = this.modelShape( peaks, graphParms );
       this.mainGraph.shape = updatedGraphShape;
       this.addChild( this.mainGraph );*/
//     this.draggablePointNode.visible = graphValuesVisible;

         this.mainGraph = new Node();
         this.addChild( this.mainGraph );
   //      this.modelShape( peaks, graphParms, options );
     //  const updatedGraphShape = this.modelShape( peaks, graphParms );
     //  this.addChild(new Path(updatedGraphShape, options.graphPathOptions)); 

  
        // A text node to label the x-axis
        var ENERGY_FONT2 = new PhetFont( { size: 30, weight: 'bold' } );
  
    
        const xText = new RichText( 'Relative Energy (eV)', {
            font: ENERGY_FONT2,
            fill: 'black',
            maxWidth: 200,
            align: 'center',
            top: 15,
            centerX: this.horizontalAxisLength / 2
        } );
        const maxText = new RichText( '0', {
            font: ENERGY_FONT2,
            fill: 'black',
            maxWidth: 200,
            align: 'center',
            top: 5,
            centerX: this.horizontalAxisLength
        } );
        const minText = new RichText( '-7', {
            font: ENERGY_FONT2,
            fill: 'black',
            maxWidth: 200,
            align: 'center',
            top: 5,
            centerX: 0
        } );
        
        const yText = new RichText( 'Counts (arb)', {
            font: ENERGY_FONT2,
            fill: 'black',
            maxWidth: 150,
            align: 'center',
            rotation: -Math.PI / 2,
            centerX: -15,
            centerY: - this.verticalAxisLength / 2
        } );

        this.addChild( xText );
        this.addChild( yText );
        this.addChild( maxText );
        this.addChild( minText );


       

       this.dataPointsNode = new Node();
       this.addChild( this.dataPointsNode );

       

//       this.dataPointsNode = this.dataPoints( histogram, graphParms );
//       this.addChild( this.dataPointsNode );

 /*
       dataPointNode = new Node( {
        children: [
            new Circle( 3, { fill: 'black' } ),
            new Line( 0, 0, ENERGY_LEVEL_LINE_LENGTH, 0, { stroke: ENERGY_LEVEL_COLOR } ),
            new Line( 2 * ENERGY_LEVEL_LINE_LENGTH, 0, 3 * ENERGY_LEVEL_LINE_LENGTH, 0, { stroke: ENERGY_LEVEL_COLOR } ),
            new Line( 4 * ENERGY_LEVEL_LINE_LENGTH, 0, 5 * ENERGY_LEVEL_LINE_LENGTH, 0, {stroke: ENERGY_LEVEL_COLOR } )
            ]
        } );
*/
    }
  
    /**
     * Reset Properties associated with this Node
     * @public
     */
    reset() {
      this.axes.reset();
      this.draggablePointNode.reset();
    }

    /**
     * Gets the shape of a given BlackbodyBodyModel
     * @param {Array} histogram
     * @param {} graphParms
     * @returns {Node} // Node with a child path for each data point
     * @private
     *
    histogramShapeNode = new Node();
    histogramShapeNode( histogram, graphParms ) {
        for (let i=0; i<histogram.length; i++) {

        }
    }*/

    /**
     * Returns a node with the datapoints based on a histogram array of the data
     * @param {Array} histogram // Arrays packaged into one object
     * @param {} graphParms
     * @returns {Shape}
     * @private
     */
    dataPoints( histogram, graphParms ) {
        self = this;
        self.dataPointsNode.removeAllChildren();
        const dataPointsOptions = {
            stroke: 'black',
            lineWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
        }
 //       const pointsNode = new Node();
 //       const deltaEnergy = (graphParms.EMax - graphParms.EMin) / ( histogram.length - 1 );
 //       var yValues = new Array(histogram.length);
        const pointsXOffset = this.horizontalAxisLength / ( histogram.length - 1 );
        var maxValue = 0;
        var histTotal = 0;
        var standardError = 0;
        var errorBar = new Array(histogram.length).fill(0);
        for ( let i = 0; i < histogram.length; i++ ) {
            maxValue = Math.max(maxValue, histogram[i]);
       //     console.log(maxValue, histogram[i]);
            histTotal += histogram[i];
        }
        if (maxValue == 0) return;

        const pointsYScale = - 0.85 * this.verticalAxisLength / maxValue; // 0.9 fudge factor to accomodate binning vs. direct calculation maxes
  //      console.log(histogram, maxValue)
        for ( let i = 0; i < histogram.length; i++ ) {
            errorBar = 1.65 * Math.sqrt(histogram[i] * (histTotal - histogram[i]) / histTotal) + 0.5; // 1 should be 0.5, but this is for close to 0
       //     self.dataPointsNode.addChild(new Path( new Shape.circle( pointsXOffset * i, pointsYScale * histogram[i], 3 ), dataPointsOptions) );
            self.dataPointsNode.addChild(new Path( new Shape ()
                .circle( pointsXOffset * i, pointsYScale * histogram[i], 3 )
                .moveToRelative(-3-pointsXOffset / 2 , Math.min(- pointsYScale * errorBar , - pointsYScale * histogram[i] ))
              //  .moveToRelative(-3-pointsXOffset / 2 , pointsYScale * errorBar)
                .lineToRelative(pointsXOffset , 0)
                .moveToRelative(-pointsXOffset / 2 , 0)
                .lineToRelative(0, 2 * pointsYScale * errorBar )
                .moveToRelative(-pointsXOffset / 2 , 0)
                .lineToRelative(pointsXOffset , 0), dataPointsOptions) );
        }          
  //      return pointsNode;
    }
  
      
    /**
     * Returns the shape of the curve based on the model in this.calcY
     * @param {Array} peaks // Arrays packaged into one object
     * @param {} graphParms
     * @returns {Shape}
     * @private
     */
    modelShape( peaks, graphParms, options ) {
        //const peaks = peaksIn.value; //  needs special processing because it is a derived property.
        self = this;
        self.mainGraph.removeAllChildren();
        const graphPathOptions = {
            stroke: PhetColorScheme.RED_COLORBLIND,
            lineWidth: DEFAULT_LINE_WIDTH / 5,
            lineJoin: 'round',
            lineCap: 'round'
          };
        
      var modelShape = new Shape();
      const deltaEnergy = (graphParms.EMax - graphParms.EMin) / ( GRAPH_NUMBER_POINTS - 1 );
      var yValues = new Array(GRAPH_NUMBER_POINTS);
      var maxValue = 0;
      const pointsXOffset = this.horizontalAxisLength / ( GRAPH_NUMBER_POINTS - 1 );
      for ( let i = 0; i < GRAPH_NUMBER_POINTS; i++ ) {
          yValues[i] = this.calcY(peaks, - ( graphParms.EMin + i * deltaEnergy ) );
    //      console.log(yValues[i]);
          if (yValues[i] > maxValue) maxValue = yValues[i];
      }

      const pointsYScale = - this.verticalAxisLength / maxValue;
      modelShape.moveTo( 0, pointsYScale * yValues[0] );
      for ( let i = 1; i < GRAPH_NUMBER_POINTS; i++ ) {
        modelShape.lineTo( pointsXOffset * i, pointsYScale * yValues[i] );
      }
     // return modelShape;
    //console.log(modelShape);
    self.mainGraph.addChild(new Path( modelShape, graphPathOptions));
    }

    /**
     * calculates y-value for a given energy based on a sum of Lorentzians
     * @private
     */
    calcY(peaks, energy) {
        var yValue = 0;
        for (let i = 0; i < peaks.widths.length; i++) {
            yValue += peaks.widths[i] * peaks.strengths[i] / ( Math.pow(energy - peaks.energies[i],2) + Math.pow(peaks.widths[i],2) );
        }
        return yValue;
    }
   

    /**
     * Updates the saved and main graph paths as well as their corresponding text boxes or intensity paths
     * @private
     */
    updateGraphPaths() {
      // Updates the main graph
      const updatedGraphShape = this.modelShape( this.model.mainBody );
      this.mainGraph.shape = updatedGraphShape;

      // Easiest way to implement intensity shape is to copy graph shape and bring down to x-axis
      this.intensityPath.shape = updatedGraphShape.copy();
      const newPoint = new Vector2( this.horizontalAxisLength, 0 );
      if ( this.intensityPath.shape.getLastPoint().minus( newPoint ).magnitude > 0 ) {
        this.intensityPath.shape.lineToPoint( newPoint );
      }
    }

    
    /**
     * Updates everything in the graph drawing node
     * @private
     */
    update() {
      this.updateGraphPaths();
      this.axes.update();
    }

  }

  return rixsSimulator.register( 'GraphNode', GraphNode );
} );