import React from 'react';
import { Button, Form, FormGroup, FormText, Label, Input } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import HRInfoAPI from './HRInfoAPI';
import HidAPI from './HidAPI';

class Login extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        email: "",
        password: "",
        status: 'initial'
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange (event) {
      this.setState({
        [event.target.id]: event.target.value
      });
    }

    handleSubmit (event) {
      event.preventDefault();
      const that = this;
      this.setState({
        status: 'submitting'
      });
      let tokenData = {};
      this.hidAPI = new HidAPI();
      this.hidAPI
        .getJWT(this.state.email, this.state.password)
        .then(data => {
          if (!data.user || !data.token) {
            throw "Unknown exception";
          }
          else {
            tokenData = data;
            that.hrinfoAPI = new HRInfoAPI(data.token);
            return that.hrinfoAPI
              .getProfile();
          }
        })
        .then(data => {
          tokenData.user.hrinfo = {
            roles: data.roles,
            spaces: data.spaces
          };
          this.props.userHasAuthenticated(true, tokenData.user, tokenData.token);
          this.props.history.push('/home');
        })
        .catch(err => {
          this.setState({
            status: 'initial'
          });
          this.props.setAlert('danger', 'Could not log you in. Please check your email and password.');
        });
    }

    render() {
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" name="email" id="email" value={this.state.email} onChange={this.handleChange} required />
            <FormText color="muted">Your Humanitarian ID email</FormText>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange} required />
            <FormText color="muted">Your Humanitarian ID password</FormText>
          </FormGroup>
          {this.state.status === 'initial' &&
            <Button color="primary">Login</Button>
          }
          {this.state.status === 'submitting' &&
            <FontAwesomeIcon icon={faSpinner} pulse fixedWidth />
          }
        </Form>
      );
    }
}

export default Login;
