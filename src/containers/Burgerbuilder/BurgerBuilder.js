import React, { Component } from 'react';
import Aux from '../../hoc/auxiliary';
// eslint-disable-next-line 
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Backdrop/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Backdrop/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount() {
        axios.get('https://react-burger-builder-dec26.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ ingredients: response.data })
            })
            .catch(error => {
                this.setState({ error: true });
            })
    };

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients).map((igkey) => {
            return ingredients[igkey];
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);

        this.setState({ purchasable: sum > 0 });
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({ ingredients: updatedIngredients, totalPrice: newPrice });
        this.updatePurchaseState(updatedIngredients);
    }
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({ ingredients: updatedIngredients, totalPrice: newPrice });
        this.updatePurchaseState(updatedIngredients);
    }
    purchaseHandler = () => {
        this.setState({
            purchasing: true
        })
    };
    purchseCancelHandler = () => {
        this.setState({
            purchasing: false
        })
    };
    purchseContinueHandler = () => {
        //alert("You continue!");
        /*this.setState({ loading: true });

        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice.toFixed(2),
            customer: {
                name: 'Tanmay',
                address: {
                    streetNumber: 3,
                    pincode: 202001,
                    country: 'India'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'Fastest'
        };

        axios.post('/orders.json', order)
            .then(response => { this.setState({ loading: false, purchasing: false }) })
            .catch(e => { this.setState({ loading: false, purchasing: false }) })*/
            const queryParams = [];
            for(let i in this.state.ingredients)
            {
                queryParams.push(encodeURIComponent(i)+'='+encodeURIComponent(this.state.ingredients[i]));
            }
            queryParams.push('price=' + this.state.totalPrice)
            const queryString = queryParams.join('&');
            
            this.props.history.push({
                pathname:'/checkout',
                search: '?'+queryString
            });
    }

    render() {

        const disabledInfo = {
            ...this.state.ingredients
        }

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Oops!! Ingredients cannot be loaded</p> : <Spinner />

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary ingredients={this.state.ingredients} price={this.state.totalPrice} purchaseCancel={this.purchseCancelHandler} purchaseContinue={this.purchseContinueHandler} />
        }

        if (this.state.loading) {
            orderSummary = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

export default withErrorHandler(BurgerBuilder, axios);