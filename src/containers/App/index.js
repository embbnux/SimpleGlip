import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';

import PhoneProvider from 'ringcentral-widgets/lib/PhoneProvider';

import AlertContainer from 'ringcentral-widgets/containers/AlertContainer';
import ContactsPage from 'ringcentral-widgets/containers/ContactsPage';

import getAlertRenderer from '../../components/AlertRenderer';

import MainView from '../MainView';
import AppView from '../AppView';
import SideView from '../../components/SideView';

import GlipGroups from '../GlipGroups';
import GlipChat from '../GlipChat';
import GlipPersonProfile from '../GlipPersonProfile';
import GlipContactDetail from '../GlipContactDetail';
import GlipSettings from '../GlipSettings';
import WelcomePage from '../WelcomePage';

export default function App({
  phone,
  hostingUrl,
}) {
  return (
    <PhoneProvider phone={phone}>
      <Provider store={phone.store} >
        <Router history={phone.routerInteraction.history} >
          <Route
            component={routerProps => (
              <AppView
                hostingUrl={hostingUrl}
              >
                {routerProps.children}
                <AlertContainer
                  callingSettingsUrl="/settings/calling"
                  regionSettingsUrl="/settings/region"
                  getAdditionalRenderer={getAlertRenderer}
                />
              </AppView>
            )} >
            <Route
              path="/"
              component={WelcomePage}
            />
            <Route
              path="/"
              component={routerProps => (
                <MainView>
                  {routerProps.children}
                </MainView>
              )}
            >
              <Route
                path="/glip"
                component={routerProps => (
                  <SideView
                    side={<GlipGroups />}
                  >
                    {routerProps.children}
                  </SideView>
                )} >
                <Route
                  path="persons/:personId"
                  component={
                    routerProps => (
                      <GlipPersonProfile params={routerProps.params} />
                    )
                  }
                />
                <Route
                  path="groups/:groupId"
                  component={
                    routerProps => (
                      <GlipChat params={routerProps.params} />
                    )
                  }
                />
              </Route>
              <Route
                path="/contacts"
                component={routerProps => (
                  <SideView
                    side={
                      <ContactsPage />
                    }
                  >
                    {routerProps.children}
                  </SideView>
                )}
              >
                <Route
                  path=":contactType/:contactId"
                  component={routerProps => (
                    <GlipContactDetail params={routerProps.params} />
                  )}
                />
              </Route>
              <Route
                path="/settings"
                component={GlipSettings}
              />
            </Route>
          </Route>
        </Router>
      </Provider>
    </PhoneProvider>
  );
}

App.propTypes = {
  phone: PropTypes.object.isRequired,
  hostingUrl: PropTypes.string.isRequired,
};
