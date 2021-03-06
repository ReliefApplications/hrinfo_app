import React from 'react';
import HRInfoLocation from './HRInfoLocation';

class HRInfoLocations extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      locations: [[]],
      inputNumber: 1
    };
    this.getRow = this.getRow.bind(this);
    this.onAddBtnClick = this.onAddBtnClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getRow (number) {
    const locations1 = this.state.locations[number][0] ? (
      <HRInfoLocation level="1" parent={this.state.locations[number][0]} row={number} onChange={this.handleChange} value={this.state.locations[number][1]} />
    ) : '';

    const locations2 = this.state.locations[number][1] ? (
      <HRInfoLocation level="2" parent={this.state.locations[number][1]} row={number} onChange={this.handleChange} value={this.state.locations[number][2]} />
    ) : '';

    const locations3 = this.state.locations[number][2] ? (
      <HRInfoLocation level="3" parent={this.state.locations[number][2]} row={number} onChange={this.handleChange} value={this.state.locations[number][3]} />
    ) : '';

    return (
      <div className="row" key={number}>
        <HRInfoLocation level="0" onChange={this.handleChange} row={number} value={this.state.locations[number][0]} />
        {locations1}
        {locations2}
        {locations3}
      </div>
    );
  }

  handleChange (row, level, selected) {
    let state = {};
    state['locations'] = this.state.locations;
    for (let i = Number(level); i < 4; i++) {
      state["locations"][row][i] = '';
    }
    if (selected && selected.id) {
      state["locations"][row][level] = selected.id;
    }
    this.setState(state);
    if (this.props.onChange) {
      this.props.onChange(state['locations']);
    }
  }

  onAddBtnClick (event) {
    let locations = this.state.locations;
    for (let i = 0; i < this.state.inputNumber + 1; i++) {
      if (!locations[i]) {
        locations[i] = [];
      }
    }
    this.setState({
      inputNumber: this.state.inputNumber + 1,
      locations: locations
    });
  }

  render () {
    let rows = [];
    for (let i = 0; i < this.state.inputNumber; i++) {
      rows.push(this.getRow(i));
    }
    return (
      <div>
        {rows}
        <button onClick={this.onAddBtnClick}>Add location</button>
      </div>
      );
  }
}

export default HRInfoLocations;
