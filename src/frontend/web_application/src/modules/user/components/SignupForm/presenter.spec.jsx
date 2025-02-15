import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

jest.mock('../../../../modules/routing', () => ({
  withPush: () => (C) =>
    function (props) {
      return <C {...props} />;
    },
}));
jest.mock('../../../../modules/device', () => ({
  withDevice: () => (C) =>
    function (props) {
      return <C {...props} />;
    },
}));
jest.mock('../../../../modules/settings/hoc/withSettings', () => {
  const withSettings = () => (C) =>
    function (props) {
      return <C {...props} />;
    };

  return withSettings;
});

describe('scene - Signup', () => {
  const props = {
    i18n: { _: (str) => str },
    onSignupSuccess: jest.fn(),
    settings: {},
    push: () => {
      // noop
    },
  };

  it('render', () => {
    const comp = shallow(<Presenter {...props} />)
      // dive() for each hoc
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      // dive once more for the rendered Comp
      .dive();

    expect(comp.text()).toContain('SignupForm');
  });
});
