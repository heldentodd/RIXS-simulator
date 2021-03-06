// Copyright 2016-2018, University of Colorado Boulder

/**
 * The space in which atoms and alpha particles are rendered.  The particles can be represented two
 * ways, 'nucleus' and 'particle'.  When represented by a nucleus, the particle is shown as an image of
 * two protons and two neutrons.  When represented as a particle, it is represented as a small magenta
 * circle.
 *
 * @author Dave Schmitz (Schmitzware) modified by TH from ParticleSpaceNode.js
 * @author Jesse Greenberg
 */

  // modules
  import CanvasNode from '../../../../scenery/js/nodes/CanvasNode.js';
  import Color from '../../../../scenery/js/util/Color.js';
  import inherit from '../../../../phet-core/js/inherit.js';
  import merge from '../../../../phet-core/js/merge.js';
  import ParticleNodeFactory from './ParticleNodeFactory.js';
  import RIXSColorProfile from './RIXSColorProfile.js';
  import rixsSimulator from '../../rixsSimulator.js';
  import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
  import Utils from '../../../../dot/js/Utils.js';

  // constants
  const SPACE_BORDER_WIDTH = 2;
  const SPACE_BORDER_COLOR = 'grey';
  //const SPACE_BORDER_COLOR = RIXSColorProfile.backgroundColorProperty.get().toCSS();  
  const PARTICLE_TRACE_WIDTH = 1.5;
  const FADEOUT_SEGMENTS = 80;

  /**
   * @param {photonSpace} photonSpace - space containing photons
   * @param {Property} showAlphaTraceProperty
   * @param {ModelViewTransform2} modelViewTransform - model to view  transform
   * @constructor
   */
  function PhotonSpaceNode( photonSpace, showAlphaTraceProperty, modelViewTransform, options ) {

    assert && assert( options && options.hasOwnProperty( 'canvasBounds' ), 'No canvasBounds specified.' );

    // the bounds should be eroded by 10 so it appears that particles glide into the space
    //options.canvasBounds = options.canvasBounds.eroded( RIXSConstants.SPACE_BUFFER );

    options = merge( {
      particleStyle: 'particle', // 'nucleus'|'particle'
      particleTraceColor: new Color(255,0,255)
    }, options );
    this.particleStyle = options.particleStyle;
    this.particleTraceColor = options.particleTraceColor;

    CanvasNode.call( this, options );

    const self = this;

    // @private
    this.photonSpace = photonSpace;

    // @private
    this.photonImage = null;

    // @private - model to view coordinate transform
    this.modelViewTransform = modelViewTransform;

    // @private
    this.showAlphaTraceProperty = showAlphaTraceProperty;

    // @private
    this.particleTraceColorWithFade = 'rgba(' + options.particleTraceColor.r + ',' + options.particleTraceColor.g + ',' + options.particleTraceColor.b + ',{0})';

    // @private - the area to be used as the 'viewport', border not included
    this.clipRect = {
      x: this.canvasBounds.getX() + SPACE_BORDER_WIDTH / 2,
      y: this.canvasBounds.getY() + SPACE_BORDER_WIDTH / 2,
      width: this.canvasBounds.getWidth() - SPACE_BORDER_WIDTH,
      height: this.canvasBounds.getHeight() - SPACE_BORDER_WIDTH
    };

    // create a single photon image to use for rendering all particles - asynchronous
   /* var photon;
    if ( this.particleStyle === 'nucleus' ) {
      photon = ParticleNodeFactory.createNucleusAlpha();
    }
    else if ( this.particleStyle === 'particle' ) {
      photon = ParticleNodeFactory.createParticleAlpha();
    }*/
    let photon = ParticleNodeFactory.createParticleAlpha();
    photon = ParticleNodeFactory.createParticleAlpha();
    photon.toImage( function( image, x, y ) {
      self.photonImage = image;
      self.particleImageHalfWidth = self.photonImage.width / 2;
      self.particleImageHalfHeight = self.photonImage.height / 2;
    } );

    this.invalidatePaint();
  }

  rixsSimulator.register( 'PhotonSpaceNode', PhotonSpaceNode );

  inherit( CanvasNode, PhotonSpaceNode, {

    /**
     * A no/op function to be implemented by derived objects
     * @param {CanvasRenderingContext2D} context
     * @protected
     */
    paintSpace: function( context ) {
      assert && assert( false, 'subtype needs to implement' );
    },

    /**
     * @param {CanvasRenderingContext2D} context
     * @override
     * @private
     */
    paintCanvas: function( context ) {

      const self = this;

      const bounds = this.canvasBounds;
      const renderTrace = self.showAlphaTraceProperty.value;

      // clear
      context.clearRect( bounds.getX(), bounds.getY(), bounds.getWidth(), bounds.getHeight() );

      // border
      context.beginPath();
      context.lineWidth = SPACE_BORDER_WIDTH;
      context.strokeStyle = SPACE_BORDER_COLOR;
      context.rect( bounds.getX(), bounds.getY(), bounds.getWidth(), bounds.getHeight() );
      context.stroke();

      // viewport clip
      context.beginPath();
      context.strokeStyle = 'transparent';
      context.fillStyle = RIXSColorProfile.backgroundColorProperty.get().toCSS();
      context.rect( this.clipRect.x, this.clipRect.y, this.clipRect.width, this.clipRect.height );
      context.stroke();
      context.fill();
      context.clip();

      // render derived space
      this.paintSpace( context );

      // Slight chance the image used isn't loaded. In that case, return & try again on next frame
      if ( self.photonImage === null ) {
        return;
      }

      // render all alpha particles & corresponding traces in the space
      self.renderPhotons( context, this.photonSpace, renderTrace );
    },

    /**
     * Render alpha particles that belong to a parent particleContainer
     * @param  {Context2D} context
     * @param  {Atom|photonSpace} particleContainer
     * @param  {boolean} renderTrace
     * @private
     */
    renderPhotons: function( context, particleContainer, renderTrace ) {
      const self = this;

      if ( renderTrace ) {

        // if style is 'nucleus' we can get away with rendering with one path for performance
        if ( self.particleStyle === 'nucleus' ) {
          context.beginPath();
          context.lineWidth = PARTICLE_TRACE_WIDTH;
          context.strokeStyle = self.particleTraceColor.getCanvasStyle();
        }
      }

      particleContainer.photons.forEach( function( particle ) {

        // render the traces (if enabled)
        if ( renderTrace ) {

          // add trace segments
          for ( let i = 1; i < particle.positions.length; i++ ) {
            if ( self.particleStyle === 'particle' ) {

              // if the style is of a 'particle', each segment needs a new path to create the gradient effect
              context.beginPath();
            }

            const segmentStartViewPosition = self.modelViewTransform.modelToViewPosition( particle.positions[ i - 1 ] );
            context.moveTo( segmentStartViewPosition.x, segmentStartViewPosition.y );
            const segmentEndViewPosition = self.modelViewTransform.modelToViewPosition( particle.positions[ i ] );
            context.lineTo( segmentEndViewPosition.x, segmentEndViewPosition.y );

            if ( self.particleStyle === 'particle' ) {

              // only the last FADEOUT_SEGMENTS should be visible, map i to the opacity
              const length = particle.positions.length;
              const alpha = Utils.linear( length - FADEOUT_SEGMENTS, length, 0, 0.5, i );
              const strokeStyle = StringUtils.format( self.particleTraceColorWithFade, alpha );
              context.strokeStyle = strokeStyle;
              context.stroke();
              context.closePath();
            }
          }
        }

        // render particle
        const particleViewPosition = self.modelViewTransform.modelToViewPosition( particle.positionProperty.get() );
        context.drawImage( self.photonImage,
          particleViewPosition.x - self.particleImageHalfWidth,
          particleViewPosition.y - self.particleImageHalfHeight );
      } );

      // render traces as single path in nucleus representation for performance
      if ( renderTrace ) {
        if ( self.particleStyle === 'nucleus' ) {
          context.stroke();
        }
      }
    }
  } );
  
  export default PhotonSpaceNode;