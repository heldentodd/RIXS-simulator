// Copyright 2013-2018, University of Colorado Boulder

/**
 * View for the Monochromator, which clicked for an explanation.
 *
 * @author Todd Holden (Queensborough Community College of CUNY)
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' )
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const Color = require( 'SCENERY/util/Color' );
  const FireListener = require( 'SCENERY/listeners/FireListener' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  
  const TRANSITION_ARROW_OPTIONS = {fill: new Color( 255, 0, 255 ), stroke: null, tailWidth: 2, headWidth: 7, headHeight: 21 };

  // images
  //const MonochromatorImage = require( 'image!RIXS_SIMULATOR/monochromator.png' );

  /**
   * Constructor for the MonochromatorNode which renders the Monochromator as a scenery node.
   *
   * @param positionX - the x position of the center of the image on the canvas
   * @param positionY - the y position of the center of the image on the canvas
   * @constructor ??
   */
  function EnergyLevelNode(positionX, positionY) {

    this.positionX = positionX
    this.positionY = positionY

  //  var self = this;

    // Call the super constructor
    Node.call( this, {

      // Show a cursor hand over the Monochromator
      cursor: 'pointer'
    } );

    // Add the Outline

    this.heightED = 50;
    this.offsetED = 20;
    this.widthED = 100;
    const diagramOutlineShape = new Shape()
        .moveTo(positionX, positionY)
        .lineToRelative(this.offsetED, 0)
        .lineToRelative(0, this.heightED * Math.log10(11000))
        .lineToRelative(this.widthED, 0)
        .lineToRelative(0, - this.heightED * Math.log10(11000))
        .lineToRelative(this.offsetED, 0);

    const diagramOutline = new Path(diagramOutlineShape,{
        stroke: 'black',
        lineWidth: 4  
    } );
    //energyLevels: //typeIndex 0 = x2-y2, 1 = z2, 2=xz/yz, 3=xy, 4=CT, 5=magnon, 6=elastic, 7 = L3 edge
    this.energyLevels = [Math.log10(1.5), Math.log10(3), Math.log10(3.7), Math.log10(4.5), Math.log10(7), Math.log10(1.5), Math.log10(1.5), Math.log10(932)];
    const levelLinesShape = new Shape()
        .moveTo(positionX + this.offsetED, positionY + this.heightED * Math.log10(8979))
        .lineToRelative(this.widthED, 0)
        .moveTo(positionX + this.offsetED, positionY + this.heightED * Math.log10(1097))
        .lineToRelative(this.widthED, 0)
        .moveTo(positionX + this.offsetED, positionY + this.heightED * Math.log10(952))
        .lineToRelative(this.widthED, 0)
        .moveTo(positionX + this.offsetED, positionY + this.heightED * this.energyLevels[7])
        .lineToRelative(this.widthED, 0)
        .moveTo(positionX + this.offsetED, positionY + this.heightED * Math.log10(123))
        .lineToRelative(this.widthED, 0)
        .moveTo(positionX + this.offsetED, positionY + this.heightED * Math.log10(77.5))
        .lineToRelative(this.widthED, 0)
        .moveTo(positionX + this.offsetED, positionY + this.heightED * Math.log10(75))
        .lineToRelative(this.widthED, 0)
        .moveTo(positionX + this.offsetED, positionY + this.heightED * this.energyLevels[4])
        .lineToRelative(this.widthED, 0)
        .moveTo(positionX + this.offsetED, positionY + this.heightED * this.energyLevels[3])
        .lineToRelative(this.widthED, 0)
        .moveTo(positionX + this.offsetED, positionY + this.heightED * this.energyLevels[2])
        .lineToRelative(this.widthED, 0)
        .moveTo(positionX + this.offsetED, positionY + this.heightED * this.energyLevels[1])
        .lineToRelative(this.widthED, 0)
        .moveTo(positionX + this.offsetED, positionY + this.heightED * this.energyLevels[0])
        .lineToRelative(this.widthED, 0)
        .moveTo(0,0);
     
    const levelLinesPath = new Path(levelLinesShape,{
        stroke: 'black',
        lineWidth: 1  
    } );

    const fermiLevelShape = new Shape()
        .moveTo(positionX + this.offsetED/2, positionY + this.heightED * Math.log10(2.2))
        .lineToRelative(this.widthED + this.offsetED, 0);

    const fermiLevelPath = new Path(fermiLevelShape,{
        lineDash: [ 3, 3 ],
        stroke: 'white',
        lineWidth: 1  
    } );

        
    const kTextNode = new Text( 'k edge', {
        font: new PhetFont( { size: 18 } ),
        fill: 'black',
        maxWidth: 100
     } );
     kTextNode.centerY = positionY + this.heightED * Math.log10(8979);
     kTextNode.right = positionX + this.offsetED - 5;

     const lTextNode = new Text( 'l edge', {
        font: new PhetFont( { size: 18 } ),
        fill: 'black',
        maxWidth: 100
     } );
     lTextNode.centerY = positionY + this.heightED * Math.log10(1000);
     lTextNode.right = positionX + this.offsetED - 5;

     const mTextNode = new Text( 'm edge', {
        font: new PhetFont( { size: 18 } ),
        fill: 'black',
        maxWidth: 100
     } );
     mTextNode.centerY = positionY + this.heightED * Math.log10(90);
     mTextNode.right = positionX + this.offsetED - 5;

     const ctTextNode = new Text( 'CT', {
        font: new PhetFont( { size: 18 } ),
        fill: 'black',
        maxWidth: 100
     } );
     ctTextNode.centerY = positionY + this.heightED * Math.log10(8);
     ctTextNode.right = positionX + this.offsetED - 5;

     const dTextNode = new Text( 'd levels', {
        font: new PhetFont( { size: 18 } ),
        fill: 'black',
        maxWidth: 100
     } );
     dTextNode.centerY = positionY + this.heightED * Math.log10(3);
     dTextNode.right = positionX + this.offsetED - 5;

     const efNode = new RichText( 'E<sub>F', {
        font: new PhetFont( { size: 18 } ),
        fill: 'white',
        maxWidth: 100
     } );
     efNode.centerY = positionY + this.heightED * Math.log10(2.3);
     efNode.left = positionX + this.widthED + 2 * this.offsetED;

     const textNode = new Node( {
        children: [ kTextNode , lTextNode , mTextNode , ctTextNode , dTextNode, efNode ]
      } );


    this.addChild( diagramOutline ); // 
    this.addChild( levelLinesPath ); // 
    this.addChild( fermiLevelPath ); // 
    this.addChild( textNode ); // 
    this.drawArrowsNode = new Node();
    this.addChild( this.drawArrowsNode );
    
    // on click, open webpage
    var EnergyLevelListener = new FireListener( {
      fire: function () {open('EnergyLevels.html')}  
    } );
    this.addInputListener( EnergyLevelListener );
  }

  rixsSimulator.register( 'EnergyLevelNode', EnergyLevelNode );

  return inherit( Node, EnergyLevelNode, {

    paintArrows: function( transitions, drawArrowsNode ) {
        var radius = 5;
        var self = this;
        var energyLevels = self.energyLevels;
        self.drawArrowsNode.removeAllChildren();
        transitions.forEach( function ( transition ) {
            var arrowUp = new ArrowNode(self.positionX + self.offsetED + self.widthED * transition.xPosition, self.positionY + self.heightED * energyLevels[7], 
                        self.positionX + self.offsetED + self.widthED * transition.xPosition, self.positionY + self.heightED * energyLevels[0],
                        TRANSITION_ARROW_OPTIONS);
            self.drawArrowsNode.addChild(arrowUp);
            var lStateShape = new Shape()
                .arc(radius + self.positionX + self.offsetED + self.widthED * transition.xPosition, self.positionY + self.heightED * energyLevels[7],
                    radius, 0, 2*Math.PI,);
       //         electronShape.moveTo(self.positionX + self.offsetED + self.widthED * transition.xPosition, self.positionY + self.heightED * energyLevels[0]);
            var valenceElectronShape = new Shape()
                .arc( radius + self.positionX + self.offsetED + self.widthED * transition.xPosition, self.positionY + self.heightED * energyLevels[0],
                    radius, 0, 2*Math.PI,);
            const lStatePath = new Path(lStateShape,{
              stroke: 'red',
              fill: 'white',
              lineWidth: 1  
            } );
                  
            const valenceElectronPath = new Path(valenceElectronShape,{
              stroke: 'red',
              fill: 'red',
              lineWidth: 1  
            } );
            self.drawArrowsNode.addChild(valenceElectronPath);
            
            if (transition.timeLeft > 1.0) {
              lStatePath.fill = 'white'
            }
            else {
              var arrowDown = new ArrowNode(2* radius + self.positionX + self.offsetED + self.widthED * transition.xPosition, 
                  self.positionY + self.heightED * energyLevels[transition.decayType], 
                  2 * radius + self.positionX + self.offsetED + self.widthED * transition.xPosition, 
                  self.positionY + self.heightED * energyLevels[7], TRANSITION_ARROW_OPTIONS);
              self.drawArrowsNode.addChild(arrowDown);
              lStatePath.fill = 'red';

              var dStateShape = new Shape()
                .arc( radius + self.positionX + self.offsetED + self.widthED * transition.xPosition, self.positionY + self.heightED * energyLevels[transition.decayType],
                    radius, 0, 2*Math.PI,);
              
              const dStatePath = new Path(dStateShape,{
                stroke: 'red',
                fill: 'white',
                lineWidth: 1  
              } );
              self.drawArrowsNode.addChild(dStatePath);
            }

            self.drawArrowsNode.addChild(lStatePath);


        });

        
    }
  } );
} );
