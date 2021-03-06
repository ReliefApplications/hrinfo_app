import React from 'react';

class Login extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        email: "",
        password: ""
      };

      this.validateForm = this.validateForm.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    validateForm() {
      return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange (event) {
      this.setState({
        [event.target.id]: event.target.value
      });
    }

    handleSubmit (event) {
      event.preventDefault();
      let body = this.state;
      body.exp = Math.floor(Date.now() / 1000) + 3600;
      fetch('https://auth.humanitarian.id/api/v2/jsonwebtoken', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        })
        .then(results => {
            return results.json();
        })
        .then(data => {
          if (data.user && data.token) {
            this.props.userHasAuthenticated(true, data.user, data.token);
            this.props.history.push('/home');
          }
          else {
            alert('Could not log you in');
          }
        });
    }

    render() {
      return (
        <div className="Login">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" className="form-control" name="email" id="email" value={this.state.email} onChange={this.handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" name="password" id="password" value={this.state.password} onChange={this.handleChange} />
            </div>
            <button className="btn btn-default" type="submit">Login</button>
          </form>
        </div>
      );
    }
}

export default Login;
