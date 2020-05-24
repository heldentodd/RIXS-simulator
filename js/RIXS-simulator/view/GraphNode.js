// Copyright 2014-2019, University of Colorado Boulder

/**
 * Graph Node responsible for positioning all of the graph elements
 * Handles or controls the majority of the over-arching graph logic
 *
 * @author Modified from Blackbody simulator by Todd Holden (QCC) Martin Veillette (Berea College)
 * @author Saurabh Totey
 * @author Arnab Purkayastha
 */

  // modules
  import Node from '../../../../scenery/js/nodes/Node.js';
  import Path from '../../../../scenery/js/nodes/Path.js';
  import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
  import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
  import RichText from '../../../../scenery/js/nodes/RichText.js';
  import rixsSimulator from '../../rixsSimulator.js';
  import Shape from '../../../../kite/js/Shape.js';
  import Vector2 from '../../../../dot/js/Vector2.js';
  
  // constants
  const GRAPH_NUMBER_POINTS = 300; // number of points the theoretical curve is evaluated at
  const DEFAULT_LINE_WIDTH = 5; // regular line width for graph paths
  
  class GraphNode extends Node {

    /**
     * The node that handles keeping all of the graph elements together and working
     * @param histogram array - where the datapoint y-values are stored (counts data)
     */
    constructor( histogram, peaks, graphParms, options ) {

      super();

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

         this.mainGraph = new Node();
         this.addChild( this.mainGraph );
  
        // A text node to label the x-axis
        const ENERGY_FONT2 = new PhetFont( { size: 30, weight: 'bold' } );
  
    
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
     * Returns a node with the datapoints based on a histogram array of the data
     * @param {Array} histogram // Arrays packaged into one object
     * @param {} graphParms
     * @returns {Shape}
     * @private
     */
    dataPoints( histogram, graphParms ) {
        this.dataPointsNode.removeAllChildren();
        const dataPointsOptions = {
            stroke: 'black',
            lineWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
        };
        const pointsXOffset = this.horizontalAxisLength / ( histogram.length - 1 );
        let max = 0;
        let histTotal = 0;
        let errorBar = new Array(histogram.length).fill(0);
        for ( let i = 0; i < histogram.length; i++ ) {
          if(histogram[i] > histogram[max]) { max = i; }
            histTotal += histogram[i];
        }
        if (max === 0) { return; }

        const pointsYScale = Math.max(- 0.88 * this.verticalAxisLength / histogram[max],
                                      - this.verticalAxisLength / ( histogram[max] +  1.65 * Math.sqrt(histogram[max] * (histTotal - histogram[max]) / histTotal) + 0.5) ) ; // 0.9 fudge factor to accomodate binning vs. direct calculation maxes
  //      console.log(histogram, maxValue)
        for ( let i = 0; i < histogram.length; i++ ) {
          // Confidence Interval 68%  1.0; 80% 1.28; 90% 1.65; 95% 1.96; 99% 2.58
          // max function to avoid 0 error bars for 0 bins
            errorBar = 1.28 * Math.sqrt(Math.max(histogram[i],0.5) * (histTotal - histogram[i]) / histTotal); // 1 should be 0.5, but this is for close to 0
              this.dataPointsNode.addChild(new Path( new Shape ()
                .circle( pointsXOffset * i, pointsYScale * histogram[i], 3 )
               // .moveToRelative(-3-pointsXOffset / 2 , Math.min(- pointsYScale * errorBar , - pointsYScale * histogram[i] ))
                .moveToRelative(-3-pointsXOffset / 2 , pointsYScale * errorBar)
                .lineToRelative(pointsXOffset , 0)
                .moveToRelative(-pointsXOffset / 2 , 0)
                .lineToRelative(0, - pointsYScale * Math.min( 2 * errorBar, errorBar + histogram[i] ) )
                .moveToRelative(-pointsXOffset / 2 , 0)
                .lineToRelative(pointsXOffset , 0), dataPointsOptions) );
        }
    }
     
    /**
     * Returns the shape of the curve based on the model in this.calcY
     * @param {Array} peaks // Arrays packaged into one object
     * @param {} graphParms
     * @returns {Shape}
     * @private
     */
    modelShape( peaks, graphParms, options ) {
    this.mainGraph.removeAllChildren();
    const graphPathOptions = {
        stroke: PhetColorScheme.RED_COLORBLIND,
        lineWidth: DEFAULT_LINE_WIDTH / 5,
        lineJoin: 'round',
        lineCap: 'round'
      };
        
      const modelShape = new Shape();
      const deltaEnergy = (graphParms.EMax - graphParms.EMin) / ( GRAPH_NUMBER_POINTS - 1 );
      const yValues = new Array(GRAPH_NUMBER_POINTS);
      let maxValue = 0;
      const pointsXOffset = this.horizontalAxisLength / ( GRAPH_NUMBER_POINTS - 1 );
      for ( let i = 0; i < GRAPH_NUMBER_POINTS; i++ ) {
          yValues[i] = this.calcY(peaks, - ( graphParms.EMin + i * deltaEnergy ) );
          if (yValues[i] > maxValue) { maxValue = yValues[i]; }
      }

      const pointsYScale = - this.verticalAxisLength / maxValue;
      modelShape.moveTo( 0, pointsYScale * yValues[0] );
      for ( let i = 1; i < GRAPH_NUMBER_POINTS; i++ ) {
        modelShape.lineTo( pointsXOffset * i, pointsYScale * yValues[i] );
      }
     // return modelShape;
    this.mainGraph.addChild(new Path( modelShape, graphPathOptions));
    }

    /**
     * calculates y-value for a given energy based on a sum of Lorentzians
     * @private
     */
    calcY(peaks, energy) {
        let yValue = 0;
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

  rixsSimulator.register( 'GraphNode', GraphNode );
  export default GraphNode;
