import React from 'react';
import Select from 'react-select';

class StringSelect extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.getValue = this.getValue.bind(this);
  }

  getValue (val) {
    let out = {};
    this.props.options.forEach(function (option) {
      if (option.value === val) {
        out = option;
      }
    });
    return out;
  }

  handleChange (selectedOption) {
    if (this.props.onChange) {
      this.props.onChange(selectedOption.value);
    }
  }

  render() {
    return (
        <Select
          isMulti={this.props.isMulti}
          id={this.props.id}
          name={this.props.name}
          onChange={this.handleChange}
          options={this.props.options}
          value={this.getValue(this.props.value)}
          className={this.props.className} />
    );
  }
}

export default StringSelect;
