import React from 'react';

import MaterialAsyncSelect from '../components/MaterialAsyncSelect';
import HidAPI from '../api/HidAPI';

class HidContacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      status: 'initial'
    };
    this.hidAPI = new HidAPI();
    this.handleChange = this.handleChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  getOptions (input) {
    let params = {};
    params.limit = 10;
    params.offset = 0;
    params.sort = 'name';
    params.q = input;
    return this.hidAPI
      .get('user', params)
      .then(data => {
        let formatedData = data.data.map(
          user => {
            user.label = user.name;
            return user;
          }
        );
        return data.data;
      });
  }

  handleChange (selectedOption) {
    this.setState({
      contacts: selectedOption
    });
    if (this.props.onChange) {
      this.props.onChange(selectedOption);
    }
  }

  async componentDidUpdate (prevProps, prevState, snapshot) {
    const that = this;
    if (this.state.status === 'initial') {
      if (this.props.value) {
        if (this.props.isMulti) {
          let promises = [];
          this.props.value.forEach(function (v) {
            if (v.name && v.email) {
              v.id = v.email;
              promises.push(v);
            }
            else {
              let user = that.hidAPI.getItem('user', v);
              user.label = user.name;
              promises.push(user);
            }
          });
          let out = await Promise.all(promises);
          this.setState({
            contacts: out,
            status: 'loaded'
          });
        }
        else {
          this.setState({
            contacts: that.props.value,
            status: 'loaded'
          });
        }
      }
      else {
        this.setState({
          status: 'loaded'
        });
      }
    }
  }

  render() {
    return (
      <MaterialAsyncSelect
        isMulti={this.props.isMulti}
        loadOptions={this.getOptions}
        value={this.state.contacts}
        className={this.props.className}
        onChange={this.handleChange}
        />
    );
  }
}

export default HidContacts;
