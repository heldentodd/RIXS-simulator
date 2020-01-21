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
  const rixsSimulator = require( 'RIXS_SIMULATOR/rixsSimulator' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const FireListener = require( 'SCENERY/listeners/FireListener' );

  // images
  const MonochromatorImage = require( 'image!RIXS_SIMULATOR/monochromator.png' );

  /**
   * Constructor for the MonochromatorNode which renders the Monochromator as a scenery node.
   *
   * @param positionX - the x position of the center of the image on the canvas
   * @param positionY - the y position of the center of the image on the canvas
   * @constructor ??
   */
  function MonochromatorNode(positionX, positionY) {

    var self = this;

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
    var MonochromatorListener = new FireListener( {
      fire: function () {open('Monochromator.html')}  
    } );
    this.addInputListener( MonochromatorListener );
  
  }

  rixsSimulator.register( 'MonochromatorNode', MonochromatorNode );

  return inherit( Node, MonochromatorNode );
} );
