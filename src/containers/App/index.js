import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';

import PhoneProvider from 'ringcentral-widgets/lib/PhoneProvider';

import AlertContainer from 'ringcentral-widgets/containers/AlertContainer';
import ContactsPage from 'ringcentral-widgets/containers/ContactsPage';
import GlipGroups from '@ringcentral-integration/glip-widgets/containers/GlipGroups';
import GlipChat from '@ringcentral-integration/glip-widgets/containers/GlipChat';

import getAlertRenderer from '../../components/AlertRenderer';

import MainView from '../MainView';
import AppView from '../AppView';
import MobileView from '../MobileView';
import SideView from '../../components/SideView';

import GlipPersonProfile from '../GlipPersonProfile';
import GlipContactDetail from '../GlipContactDetail';
import GlipSettings from '../GlipSettings';
import WelcomePage from '../WelcomePage';

export default function App({
  phone,
  hostingUrl,
  mobile,
  showHeader,
}) {
  if (mobile) {
    return (
      <PhoneProvider phone={phone}>
        <Provider store={phone.store}>
          <Router history={phone.routerInteraction.history}>
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
                component={(routerProps) => {
                  if (!showHeader) {
                    return (
                      <div style={{ height: '100%', width: '100%'}}>
                        {routerProps.children}
                      </div>
                    );
                  }
                  return (
                    <MobileView>
                      {routerProps.children}
                    </MobileView>
                  );
                }}
              >
                <Route
                  path="/glip"
                  component={
                    () =>
                      (
                        <GlipGroups
                          hiddenCurrentGroup
                          onSelectGroup={(id) => {
                            phone.routerInteraction.push(`/glip/groups/${id}`);
                          }}
                        />
                      )
                  }
                />
                <Route
                  path="/contacts"
                  component={ContactsPage}
                />
                <Route
                  path="/settings"
                  component={GlipSettings}
                />
              </Route>
              <Route
                path="/glip/persons/:personId"
                component={
                  routerProps => (
                    <GlipPersonProfile
                      params={routerProps.params}
                      onBackClick={() => {
                        phone.routerInteraction.push('/glip');
                      }}
                    />
                  )
                }
              />
              <Route
                path="/glip/groups/:groupId"
                component={
                  routerProps => (
                    <GlipChat
                      mobile
                      params={routerProps.params}
                      onBackClick={() => {
                        phone.routerInteraction.push('/glip');
                      }}
                      onViewPersonProfile={
                        (id) => {
                          phone.routerInteraction.push(`/glip/persons/${id}`);
                        }
                      }
                      onViewGroup={
                        (id) => {
                          phone.routerInteraction.push(`/glip/groups/${id}`);
                        }
                      }
                    />
                  )
                }
              />
              <Route
                path="/contacts/:contactType/:contactId"
                component={routerProps => (
                  <GlipContactDetail
                    params={routerProps.params}
                    onBackClick={() => {
                      phone.routerInteraction.push('/contacts');
                    }}
                  />
                )}
              />
            </Route>
          </Router>
        </Provider>
      </PhoneProvider>
    );
  }
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
                    side={
                      <GlipGroups
                        hiddenCurrentGroup={
                          routerProps.location.pathname.indexOf('/glip/groups') === -1
                        }
                        onSelectGroup={(id) => {
                          phone.routerInteraction.push(`/glip/groups/${id}`);
                        }}
                      />
                    }
                  >
                    {routerProps.children}
                  </SideView>
                )}
              >
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
                      <GlipChat
                        mobile={false}
                        params={routerProps.params}
                        onViewPersonProfile={
                          (id) => {
                            phone.routerInteraction.push(`/glip/persons/${id}`);
                          }
                        }
                        onViewGroup={
                          (id) => {
                            phone.routerInteraction.push(`/glip/groups/${id}`);
                          }
                        }
                      />
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
  mobile: PropTypes.bool.isRequired,
  showHeader: PropTypes.bool,
};

App.defaultProps = {
  showHeader: true,
};
