// Copyright 2020, University of Colorado Boulder

/**
 * @author Todd Holden
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import rixsSimulator from '../rixsSimulator.js';
import RixsSimulatorModel from './model/RixsSimulatorModel.js';
import RixsSimulatorScreenView from './view/RixsSimulatorScreenView.js';

class RixsSimulatorScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      backgroundColorProperty: new Property( 'rgb(100,100,100)' ),
      tandem: tandem
    };

    super(
      () => new RixsSimulatorModel( tandem.createTandem( 'model' ) ),
      model => new RixsSimulatorScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

rixsSimulator.register( 'RixsSimulatorScreen', RixsSimulatorScreen );
export default RixsSimulatorScreen;