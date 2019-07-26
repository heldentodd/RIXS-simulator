// Copyright 2013-2018, University of Colorado Boulder

/**
 * View for the synchrotron, which clicked for an explanation.
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
  const FireListener = require( 'SCENERY/listeners/FireListener' ); // new! **


  // images
  const SynchrotronImage = require( 'image!RIXS_SIMULATOR/synchrotron.png' );

  /**
   * Constructor for the SynchrotronNode which renders the Synchrotron as a scenery node.
   *
   * @param positionX - the x position of the center of the image on the canvas
   * @param positionY - the y position of the center of the image on the canvas
   * @constructor ??
   */
  function SynchrotronNode(positionX, positionY) {

    var self = this;

    // Call the super constructor
    Node.call( this, {

      // Show a cursor hand over the synchrotron
      cursor: 'pointer'
    } );

    // Add the synchrotron
    
    this.addChild( new Image( SynchrotronImage, {
      centerX: positionX,
      centerY: positionY,
      rotation: 1
    } ) );

    // new ** on click, open webpage
    var buttonListener = new FireListener( {
      press: function() { console.log( 'press' ); },
      release: function() { console.log( 'release' ); },
      drag: function() { console.log( 'drag' ); },
      fire: function() { console.log( 'fire' ); 
      open('http://www.google.com'); /*fireNode.opacity = 1;*/ }
    } );
    this.addInputListener( buttonListener );
  
  }

  rixsSimulator.register( 'SynchrotronNode', SynchrotronNode );

  return inherit( Node, SynchrotronNode );
} );
