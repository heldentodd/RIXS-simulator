// Copyright 2013-2018, University of Colorado Boulder

/**
 * View for the Monochromator, which clicked for an explanation.
 *
 * @author Todd Holden (Queensborough Community College of CUNY)
 *
 */

 // modules
  import Image from '../../../../scenery/js/nodes/Image.js';
  import inherit from '../../../../phet-core/js/inherit.js';
  import MonochromatorImage from '../../../images/monochromator_png.js';
  import Node from '../../../../scenery/js/nodes/Node.js';
  import FireListener from '../../../../scenery/js/listeners/FireListener.js';
  import rixsSimulator from '../../rixsSimulator.js';
  
  /**
   * Constructor for the MonochromatorNode which renders the Monochromator as a scenery node.
   *
   * @param positionX - the x position of the center of the image on the canvas
   * @param positionY - the y position of the center of the image on the canvas
   * @constructor ??
   */
  function MonochromatorNode(positionX, positionY) {

    // Call the super constructor
    Node.call( this, {

      // Show a cursor hand over the Monochromator
      cursor: 'pointer'
    } );

    // Add the Monochromator
    
    this.addChild( new Image( MonochromatorImage, {
      centerX: positionX,
      centerY: positionY,
      rotation: Math.PI / 6,
      scale: (0.5, 0.5)
    
    } ) );

    // on click, open webpage
    const MonochromatorListener = new FireListener( {
      fire: function () { open('Monochromator.html'); }
    } );
    this.addInputListener( MonochromatorListener );
  
  }

  rixsSimulator.register( 'MonochromatorNode', MonochromatorNode );

  inherit( Node, MonochromatorNode );
  export default MonochromatorNode;

