import { Module } from 'ringcentral-integration/lib/di';
import DataFetcher from 'ringcentral-integration/lib/DataFetcher';

/**
 * @class
 * @description Accound info managing module.
 */
@Module({
  deps: ['Client', { dep: 'GLipCompanyOptions', optional: true }]
})
export default class GlipCompany extends DataFetcher {
  /**
   * @constructor
   * @param {Object} params - params object
   * @param {Client} params.client - client module instance
   */
  constructor({
    client,
    ...options
  }) {
    super({
      name: 'glipCompany',
      client,
      fetchFunction: async () => await client.glip().companies('~').get(),
      ...options,
    });

    this.addSelector(
      'info',
      () => this.data,
      data => data || {},
    );
  }

  get info() {
    return this._selectors.info();
  }

  get name() {
    return this.info.name;
  }

  get domain() {
    return this.info.domain;
  }

  get id() {
    return this.info.id;
  }
}
