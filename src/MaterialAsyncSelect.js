/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import { components } from 'react-select';
import AsyncSelect from 'react-select/lib/Async';

class Option extends React.Component {
  	handleClick = event => {
    	this.props.selectOption(this.props.data, event);
  	};

  	render() {
    	const { children, isFocused, isSelected, onFocus } = this.props;

    	return (
      		<MenuItem
        		onFocus={onFocus}
        		selected={isFocused}
        		onClick={this.handleClick}
        		component="div"
		        style={{
          			fontWeight: isSelected ? 500 : 400,
        		}}
      		>
        		{children}
      		</MenuItem>
    	);
  	}
}

const DropdownIndicator = (props) => {
  	return components.DropdownIndicator && (
    	<components.DropdownIndicator {...props}>
      		<i className="icon-arrow-down" style={{margin: '5px', cursor: 'pointer'}}/>
    	</components.DropdownIndicator>
  	);
}

const ClearIndicator = (props) => {
  	return components.DropdownIndicator && (
    	<components.DropdownIndicator {...props}>
      		<i className="icon-cancel" style={{margin: '5px', cursor: 'pointer'}}/>
    	</components.DropdownIndicator>
  	);
}

const LoadingIndicator = (props) => {
  	return (
    	<CircularProgress size={20}/>
  	);
}

function SelectWrapped(props) {
  const { classes, ...other } = props;
  return (
	<AsyncSelect
      components={{
        Option: Option,
        DropdownIndicator: DropdownIndicator,
		ClearIndicator: ClearIndicator,
		IndicatorSeparator: null,
		LoadingIndicator: LoadingIndicator
      }}
	  noOptionsMessage={() => <Typography>{'No results found (type at least one character)'}</Typography>}
	  loadingMessage={() => <Typography>{'Loading...'}</Typography>}
      styles={customStyles}
      isClearable={true}
	  isMulti
	  placeholder=""
      {...other}
    />
  );
}

const ITEM_HEIGHT = 48;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 200
  },
  chip: {
    margin: theme.spacing.unit / 4
  }
});

const customStyles = {
  control: () => ({
    display: "flex",
    alignItems: "center",
    border: 0,
    height: "auto",
    background: "transparent",
    "&:hover": {
      boxShadow: "none"
    }
  }),
  menu: () => ({
    backgroundColor: "white",
    boxShadow: "1px 2px 6px #888888", // should be changed as material-ui
    position: "absolute",
    left: 0,
    top: `calc(100% + 1px)`,
    width: "100%",
    zIndex: 2,
    maxHeight: ITEM_HEIGHT * 4.5
  }),
  menuList: () => ({
    maxHeight: ITEM_HEIGHT * 4.5,
    overflowY: "auto"
  })
};

class MaterialAsyncSelect extends React.Component {
	constructor(props) {
      	super(props);
      	this.handleChange = this.handleChange.bind(this);
    }


  	handleChange (selectedOption) {
	  	if (this.props.onChange) {
	       	this.props.onChange(selectedOption);
	  	}
  	};

  	render() {
	    return (
	        <TextField
	          fullWidth
	          onChange={this.handleChange}
	          placeholder={this.props.placeholder}
	          name={this.props.id}
	          label={this.props.label}
	          InputLabelProps={{
	            shrink: true,
	          }}
	          InputProps={{
	            inputComponent: SelectWrapped,
	            inputProps: {
	              isMulti: this.props.isMulti,
	              instanceId: this.props.id,
	              id: this.props.id,
	              simpleValue: true,
	              loadOptions: this.props.loadOptions
	            },
	          }}
	        />
	    );
  }
}

export default withStyles(styles)(MaterialAsyncSelect);
