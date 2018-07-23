import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Chip from '@material-ui/core/Chip';

import HRInfoSelect from './HRInfoSelect';
import HRInfoAsyncSelect from './HRInfoAsyncSelect';

const styles = theme => ({
  list: {
    width: 250
  }
});

class FiltersDrawer extends React.Component {

    render() {
      const { classes, contentType, spaceType, filters, toggleDrawer, drawerState} = this.props;

      return (
        <Drawer open={drawerState} onClose={toggleDrawer}>
          <div className={classes.list}>
            { (contentType === 'documents' || contentType === 'infographics')
              ? <FormControl fullWidth margin="normal">
                  <FormLabel>
    							  { contentType === 'documents'
    		              ? 'Filter by Document type'
    		              : 'Filter by Infographic type' }
                  </FormLabel>
    		            {
                      contentType === 'documents'
                      ? <HRInfoSelect type='document_types'
                          onChange={(s) => this.props.setFilter('document_type', s)}
                          value={filters.document_type} />
                      : <HRInfoSelect type='infographic_types'
                          onChange={(s) => this.props.setFilter('infographic_type', s)}
                          value={filters.infographic_type} />
                    }
    		        </FormControl> : ''
            }
            <FormControl fullWidth margin="normal">
              <FormLabel>Filter by Organization(s)</FormLabel>
              <HRInfoAsyncSelect type="organizations"
                onChange={(s) => this.props.setFilter('organizations', s)}
                value={filters.organizations}/>
            </FormControl>
            { spaceType === 'operation'
              ? <FormControl fullWidth margin="normal">
      					   <FormLabel>Filter by Clusters/Sectors</FormLabel>
                   <HRInfoSelect
          						type="bundles"
          						spaces={this.props.doc ? this.props.doc : null}
          						isMulti={true}
          						onChange={(s) => this.props.setFilter('bundles', s)}
          						value={filters.bundles}/>
      				  </FormControl> : ''
            }
            { spaceType === 'operation'
              ? <FormControl fullWidth margin="normal">
        				<FormLabel>Filter by Coordination hub(s)</FormLabel>
        				<HRInfoSelect
        					type="offices"
        					spaces={this.props.doc ? this.props.doc : null}
        					isMulti={true}
        					onChange={(s) => this.props.setFilter('offices', s)}
        					value={filters.offices}/>
        			</FormControl> : ''
            }
            <FormControl fullWidth margin="normal">
              <FormLabel>Filter by Theme(s)</FormLabel>
              <HRInfoSelect type="themes"
                isMulti={true}
                onChange={(s) => this.props.setFilter('themes', s)}
								value={filters.themes}
                id="themes"/>
            </FormControl>
            { spaceType === 'operation'
              ? <FormControl fullWidth margin="normal">
      					<FormLabel>Filter by Disaster</FormLabel>
      					<HRInfoSelect
      						type="disasters"
      						spaces={this.props.doc ? this.props.doc : null}
      						isMulti={true}
      						onChange={(s) => this.props.setFilter('disasters', s)}
      						value={filters.disasters}/>
      				</FormControl> : ''
            }
          </div>
        </Drawer>
      );
    }
}

FiltersDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

class FilterChips extends React.Component {
  render () {
    const {filters, removeFilter} = this.props;

    const chips = Object.keys(filters).map(key => {
      if (Array.isArray(filters[key])) {
        return filters[key].map (prop => {
          return (<Chip key={key + '_' + prop.id} label={prop.label} onDelete={() => {removeFilter(key, prop)}} />);
        });
      }
      else {
        return (<Chip key={key + '_' + filters[key].id} label={filters[key].label} onDelete={() => {removeFilter(key, filters[key])}} />);
      }
    });

    return (
      <span>{chips}</span>
    )
  }
}

const Filters = withStyles(styles)(FiltersDrawer);

export {Filters, FilterChips};