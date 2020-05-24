// Copyright 2013-2018, University of Colorado Boulder

/**
 * View for the synchrotron, which clicked for an explanation.
 *
 * @author Todd Holden (Queensborough Community College of CUNY)
 *
 */

  // modules
  import Image from '../../../../scenery/js/nodes/Image.js';
  import inherit from '../../../../phet-core/js/inherit.js';
  import Node from '../../../../scenery/js/nodes/Node.js';
  import FireListener from '../../../../scenery/js/listeners/FireListener.js';
  import rixsSimulator from '../../rixsSimulator.js';
  import SynchrotronImage from '../../../images/synchrotron_png.js';
  
  /**
   * Constructor for the SynchrotronNode which renders the Synchrotron as a scenery node.
   *
   * @param positionX - the x position of the center of the image on the canvas
   * @param positionY - the y position of the center of the image on the canvas
   * @constructor ??
   */
  function SynchrotronNode(positionX, positionY) {

    // Call the super constructor
    Node.call( this, {

      // Show a cursor hand over the synchrotron
      cursor: 'pointer'
    } );

    // Add the synchrotron
    
    this.addChild( new Image( SynchrotronImage, {
      centerX: positionX,
      centerY: positionY,
      rotation: - Math.PI / 12
    
    } ) );

    // on click, open webpage
    const synchrotronListener = new FireListener( {
      fire: function () { open('synchrotron.html'); }
    } );
    this.addInputListener( synchrotronListener );
  
  }

  rixsSimulator.register( 'SynchrotronNode', SynchrotronNode );

  inherit( Node, SynchrotronNode );
  export default SynchrotronNode;
