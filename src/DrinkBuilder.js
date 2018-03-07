import classNames from 'classnames';
import React from 'react';
import { ACTIONS, SUPPLIES } from './Data.js';
import { whatCanIMake, searchDrinks } from './Algorithms.js';


export default class DrinkBuilder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      steps: [],
      drinkName: '',
      drinkNameIsFocused: false,
      supplyRuleEnforced: null,
      disableSaveButton: false,
    };

    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleDrinkNameChange = this.handleDrinkNameChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.renderWhatCanIMake = this.renderWhatCanIMake.bind(this);
    this.renderSearchDrinks = this.renderSearchDrinks.bind(this);

  }

  render() {
    const { isCreatingDrink, isSearchingForDrink, isInWhatCanIMake } =
      this.props;
    const isOpen = isCreatingDrink || isSearchingForDrink || isInWhatCanIMake;
    const { steps, drinkName, drinkNameIsFocused,disableSaveButton } = this.state;

    return ([
      <div
        className={classNames({
          'veil': true,
          'veil-showing': isOpen
        })}
        key='veil'
      />,

      <div
        key='drink-builder'
        className='page flex-stack'
        style={{
          top: isOpen ? '0px' : '100%'
        }}
      >
        <div
          className='control-bar flex'
        >
          <div
            className='cancel'
            onClick={this.handleCancel}
          >
            {
              isCreatingDrink ? 'Cancel' : 'Close'
            }
          </div>

          {
            isCreatingDrink && [
              <div
                className={classNames({
                  'input-container': true,
                  'input-container-active': drinkNameIsFocused || drinkName.length > 0
                })}
              >
                <input
                  value={drinkName}
                  id='drinkName'
                  onChange={this.handleDrinkNameChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                />
                <label
                  htmlFor='drinkName'
                >
                  Name Your Drink
                </label>
              </div>,
              <div
                className={this.disableSave( this.props.drinks, steps) ? 'big-button-noclick' : 'big-button' }
                onClick={this.handleSave}
              >
                Save
              </div>
            ]
          }
        </div>

        <div className='columns flex-grow'>
          <div className='column'>
            <div className='column-name'>
              {
                isInWhatCanIMake ? 'Supplies' : 'Supplies & Actions'
              }
            </div>
            <div className='column-content'>
              {
                (isCreatingDrink || isSearchingForDrink) &&
                [
                  <div className='section-header' key='header'>
                    Actions
                    </div>,

                  ACTIONS.map(this.renderItem),

                  <div className='section-header' key='header-2'>
                    Supplies
                    </div>
                ]
              }

              {
                SUPPLIES.map(this.renderItem)
              }
            </div>
          </div>
          <div className='column'>
            <div className='column-name'>
              {
                isCreatingDrink ? 'Recipe' :
                  (isSearchingForDrink ? 'Recipe & Matches' : 'Your Supplies & Matches')
              }
            </div>
            <div className='column-content steps'>
              {
                (isSearchingForDrink || isInWhatCanIMake) &&
                <div className='section-header'>
                  Your {isSearchingForDrink ? 'Recipe' : 'Supplies'}
                </div>
              }

              {
                steps.map((step, index) =>
                  <div
                    className='step'
                    key={step}
                  >
                    <div className='number'>
                      {
                        index + 1
                      }
                    </div>
                    <div>
                      {
                        step
                      }
                    </div>
                  </div>
                )
              }

              {
                steps.length === 0 ?
                  <div className='needed'>
                    Get started by adding {isInWhatCanIMake ? 'some supplies' : 'an action'}
                  </div>
                  : null
              }

              {
                isInWhatCanIMake &&
                this.renderWhatCanIMake()
              }

              {
                isSearchingForDrink &&
                this.renderSearchDrinks()
              }
            </div>
          </div>
        </div>
      </div>
    ]);
  }

  renderItem(item) {

    return (
      <div
        className={(this.isSupply(item) && this.state.supplyRuleEnforced)? 'btn':'button'}
        onClick={() => this.handleItemClick(item)}
        key={item}
      >
        {
          item
        }
      </div>
    );
  }

  renderWhatCanIMake() {
    let whatICanMake = whatCanIMake(this.props.drinks, this.state.steps);
    if (whatICanMake === null) {
      whatICanMake = [];
    }

    return (
      <div>
        <div className='section-header'>
          What You Can Make
        </div>
        {
          whatICanMake.length === 0 &&
          <div className='needed'>
            You can't make anything.
            </div>
        }
        {
          whatICanMake.map((drink) => (
            <div className='step'>
              {
                drink.name
              }
            </div>
          ))
        }
      </div>
    );
  }

  renderSearchDrinks() {

    let searchResults = searchDrinks(this.props.drinks, this.state.steps);
    if (searchResults === null || searchResults == undefined) {
      searchResults = [];
    }

    return (
      <div>
        <div className='section-header'>
          Search Results
        </div>
        {
          searchResults.length === 0 &&
          <div className='needed'>
            No matching recipes.
            </div>
        }
        {
          searchResults.map((drink) => (
            <div className='step'>
              {
                drink.name
              }
            </div>
          ))
        }
      </div>
    );
  }

  handleItemClick(item) {
    this.setState({
      supplyRuleEnforced: (this.isAction(item) && item !== "Add")? true: false,
      steps: this.state.steps.concat([item])
    });
  }

  handleDrinkNameChange(event) {
    this.setState({
      drinkName: event.target.value
    });
  }

  handleSave() {
    this.props.onSaveDrink({
      name: this.state.drinkName,
      steps: this.state.steps
    });

    this.setState({
      steps: [],
      drinkName: ''
    });
  }

  handleCancel() {
    this.setState({
      steps: [],
      drinkName: ''
    });

    this.props.onCancel();
  }

  handleFocus() {
    this.setState({
      drinkNameIsFocused: true
    });
  }

  handleBlur() {
    this.setState({
      drinkNameIsFocused: false
    });
  }

  disableSave(drinks, steps) {
      const duplicate  = searchDrinks(drinks, steps);
      if(duplicate.length != 0 ){
          return true
      }
      return false
  }
  //helper functions

  isAction(action){
      return ACTIONS.includes(action);

  }
  isSupply(supply){
      return SUPPLIES.includes(supply);
  }



}
