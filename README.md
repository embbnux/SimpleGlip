# [Simple Glip](https://embbnux.github.io/SimpleGlip/)

## Introduction

This is simple version of RingCentral Glip with RESTful API.

Built with:

* [RingCentral Commons](https://github.com/ringcentral/ringcentral-js-integration-commons/) and
* [RingCentral Widgets](https://github.com/ringcentral/ringcentral-js-widgets)

## Dependences

* yarn
* webpack 2
* react
* redux

## Visit Online

Visit [website](https://embbnux.github.io/SimpleGlip/) in github pages.

## How to develop based on this app

### Clone the code

```bash
$ git clone https://github.com/embbnux/SimpleGlip.git
```

### Create API secret file in project root path

```js
# api.json
{
  "appKey": "your ringcentral app key",
  "appSecret": "your ringcentral app sercet",
  "server": "ringcentral sever url, eg: https://platform.devtest.ringcentral.com"
}
```

The `appSecret` is optional to enable the authorization code flow. If you don't provide `appSecret`, the app will use the implicit grant flow.

App Permissions required: `Glip` and `Webhook Subscription`

### Start development server

```bash
$ yarn
$ yarn start
```

Open site: 'http://localhost:8080/' on browser
