import React  from 'react';

import moment                  from 'moment';
import MaterialSelect          from './MaterialSelect';
import 'moment-timezone';

// Material
import FormControl  from '@material-ui/core/FormControl';
import FormControlLabel  from '@material-ui/core/FormControlLabel';
import FormLabel    from '@material-ui/core/FormLabel';
import Checkbox     from '@material-ui/core/Checkbox';
import Typography   from '@material-ui/core/Typography';
import Card         from '@material-ui/core/Card';
import CardContent  from '@material-ui/core/CardContent';

//Material date picker
import MomentUtils                    from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider        from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker                     from 'material-ui-pickers/DatePicker';

class SimpleDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items   : [],
      endDate : true,
      val : {
        value_from  : '',
        value_to    : '',
        timezone    : 'UTC',
        offset      : 0,
        offset2     : 0,
        timezone_db : 'UTC'
      },
      status    : 'initial',
    };
    this.handleChange = this.handleChange.bind(this);
    this.setCheckbox  = this.setCheckbox.bind(this);
    this.setTimezone  = this.setTimezone.bind(this);
  }

  // Checkbox
  setCheckbox (event) {
    const target  = event.target;
    const value   = target.checked;
    const name    = target.name;
    let newState  = {};

    newState[name] = value;

    if (target.name === 'allDay' && value) {
      newState.val        = this.state.val;
      newState.val.value_from.setHours(0);
      newState.val.value_from.setMinutes(0);

      newState.val.value_to.setHours(0);
      newState.val.value_to.setMinutes(0);
    }
    if (target.name === 'endDate' && value) {
      newState.val = this.state.val;
      newState.val.value_to = newState.val.value_from;
    }
    else if (target.name === 'endDate' && !value) {
      newState.val = this.state.val;
      newState.val.value_to = (new Date(0, 0, 0));
    }
    this.setState(newState);
  }

  //Changes
  handleChange (event, type) {
    let value: Date;
    let val = this.state.val;
    if (!event.target) {
      value = event.toDate();
      // FROM
      if (type === 'from') {
        val.value_from = value;
      }
      // TO
      if (type === 'to') {
        val.value_to = value;
      }
    }

    this.setState({
      val: val
    });

    if (this.props.onChange) {
      this.props.onChange(val);
    }
  }

  // Set timezone from departure to arrival
  setTimezone (timezone) {
    let val         = this.state.val;
    let dateVal     = new Date();
    let date2Val    = new Date();

    val.timezone_db  = timezone;
    val.timezone     = timezone;

    if (val.value_from) {
      dateVal = new Date(val.value_from);
    }
    val.offset = moment.tz.zone(timezone.value).utcOffset(dateVal.valueOf());
    val.offset = -val.offset * 60;

    if (val.value_to) {
      date2Val = new Date(val.value_to);
    }
    val.offset2 = moment.tz.zone(timezone.value).utcOffset(date2Val.valueOf());
    val.offset2 = -val.offset2 * 60;

    this.setState({
      val: val
    });

    if (this.props.onChange) {
      this.props.onChange(val);
    }
  }

  // update component
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.value && this.state.status === 'initial') {
      let val = this.props.value;
      moment.tz.names().forEach (function (timezone) {
        if (timezone === val.timezone) {
          val.timezone = {value: timezone, label: timezone};
          val.timezone_db = {value: timezone, label: timezone};
        }
        if (!val.value_from && !val.value_to && val.value && val.value2) {
          val.value_from = new Date(val.value);
          val.value_to = new Date(val.value2);
        }
        else if (val.value_from && val.value_to)
        {
          val.value_from = new Date(val.value_from);
          val.value_to = new Date(val.value_to);
        }
        else if (val.value_to) {
          console.error("There is an issue with the date storage")
        }
      });
      let newState = {
        val       : val,
        endDate   : this.state.endDate,
        status    : 'ready'
      };
      this.setState(newState);
    }
  }

  render() {
    return (
      <Card className="card-container">
        <CardContent className="date-container">
          {/* Date 'from' */}
          <FormControl margin = "normal">
            <FormLabel htmlFor="from">From</FormLabel>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                id             = "from"
                name           = "from"
                label          = "Date"
                format         = "DD/MM/YYYY"
                value          = {this.state.val.value_from ? this.state.val.value_from : ''}
                invalidLabel   = ""
                autoOk
                onChange       = {(e) => this.handleChange(e, 'from')}
                leftArrowIcon  = {<i className="icon-arrow-left" />}
                rightArrowIcon = {<i className="icon-arrow-right" />}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </MuiPickersUtilsProvider>
          </FormControl>

          {/* Date 'To'*/}
          {this.state.endDate === true &&
          <FormControl  margin="normal">
            <FormLabel htmlFor="to">To</FormLabel>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                id             = "to"
                name           = "to"
                label          = "Date"
                format         = "DD/MM/YYYY"
                minDate        = {this.state.val.value_from}
                value          = {this.state.val.value_to ? this.state.val.value_to : ''}
                invalidLabel   = ""
                autoOk
                onChange       = {(e) => this.handleChange(e, 'to')}
                leftArrowIcon  = {<i className="icon-arrow-left" />}
                rightArrowIcon = {<i className="icon-arrow-right" />}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </MuiPickersUtilsProvider>
          </FormControl>
          }
        </CardContent>

        {/* 'End date' checkbox */}
        <CardContent className = "date-container">
          <FormControlLabel
            control = {
              <Checkbox name     = "endDate"
                        color    = "primary"
                        onChange = {this.setCheckbox}
                        checked  = {this.state.endDate}
              />
            }
            label   = "End date"
          />
        </CardContent>

        {/* Timezone */}
        <CardContent >
          <Typography> Timezone </Typography>
          <MaterialSelect options  = {moment.tz.names().map(function (timezone) { return {label: timezone, value: timezone}; })}
                          onChange = {this.setTimezone}
                          value    = {this.state.val.timezone} />
        </CardContent>
      </Card>
    );
  }
}

export default SimpleDate;