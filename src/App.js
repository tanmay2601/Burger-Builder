import React, { Component } from 'react';
import Layout from './components/layout/layout';
import BurgerBuilder from './containers/Burgerbuilder/BurgerBuilder';
import Checkout from './containers/Burgerbuilder/Checkout/Checkout';
import { Route, Switch } from 'react-router-dom';
import Orders from './containers/Burgerbuilder/Orders/Orders';

import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <Switch>
            <Route path="/checkout" component={Checkout} />
            <Route path="/orders" component={Orders} />
            <Route path="/" component={BurgerBuilder} />
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;
