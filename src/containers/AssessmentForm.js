import React from 'react';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import {stateToHTML} from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import Select from 'react-select';
import { translate, Trans } from 'react-i18next';

import HRInfoAPI from '../api/HRInfoAPI';

// Components
import HRInfoSelect       from '../components/HRInfoSelect';
import HRInfoLocations    from '../components/HRInfoLocations';
import HRInfoAsyncSelect  from '../components/HRInfoAsyncSelect';
import HidContacts        from '../components/HidContacts';
import EventDate          from '../components/EventDate';
import AssessmentStatus from "../components/AssessmentStatus";
import HRInfoFilesAccessibility from "../components/HRInfoFilesAccessibility";
import LanguageSelect     from '../components/LanguageSelect';

// Material plugin
import FormHelperText   from '@material-ui/core/FormHelperText';
import FormControl      from '@material-ui/core/FormControl';
import FormLabel        from '@material-ui/core/FormLabel';
import TextField        from '@material-ui/core/TextField';
import Button           from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse         from '@material-ui/core/Collapse';
import Card             from '@material-ui/core/Card';
import Grid             from '@material-ui/core/Grid';
import Snackbar         from '@material-ui/core/Snackbar';
import Typography       from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox         from '@material-ui/core/Checkbox';

class AssessmentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      collection_methods: [
        { value: 'Structured Interview', label: 'Structured Interview'},
        { value: 'Unstructured Interview', label: 'Unstructured Interview'},
        { value: 'Key Informant Interview', label: 'Key Informant Interview'},
        { value: 'Focus group discussion', label: 'Focus group discussion'},
        { value: 'Observation', label: 'Observation'},
        { value: 'Baseline data analysis', label: 'Baseline data analysis'},
        { value: 'Field Interview', label: 'Field Interview'},
        { value: 'Email / Mail Interview', label: 'Email / Mail Interview'},
        { value: 'Mixed', label: 'Mixed'},
        { value: 'Other', label: 'Other'}
      ],
      measurement_units: [
        { value: 'Community', label: 'Community'},
        { value: 'Settlements', label: 'Settlements'},
        { value: 'Households', label: 'Households'},
        { value: 'Individuals', label: 'Individuals'},
      ],
      geographic_levels: [
        { value: 'District', label: 'District'},
        { value: 'National', label: 'National'},
        { value: 'Non-representative', label: 'Non-representative'},
        { value: 'Other', label: 'Other'},
        { value: 'Province', label: 'Province'},
        { value: 'Regional', label: 'Regional'},
        { value: 'Sub-district', label: 'Sub-district'},
        { value: 'Village', label: 'Village'}
      ],
      status: ''
    };

    this.hrinfoAPI = new HRInfoAPI();

    // this.handleInputChange = this.handleInputChange.bind(this);
    // this.handleSelectChange = this.handleSelectChange.bind(this);
    // this.onEditorStateChange = this.onEditorStateChange.bind(this);
    // this.validateForm = this.validateForm.bind(this);
    // this.isValid = this.isValid.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleDelete = this.handleDelete.bind(this);
    this.submit    = this.submit.bind(this);
  }

  submit() {
    this.setState({ wasSubmitted: true });
  }

  // handleInputChange(event) {
  //   const target = event.target;
  //   const value = target.type === 'checkbox' ? target.checked : target.value;
  //   const name = target.name;
  //
  //   let doc = this.state.doc;
  //   doc[name] = value;
  //   this.setState({
  //     doc: doc
  //   });
  // }

  // handleSelectChange (name, selected) {
  //   let doc = this.state.doc;
  //   if (name === 'date') {
  //     doc[name][0] = selected;
  //   }
  //   else {
  //     doc[name] = selected;
  //   }
  //   let hasOperation = this.state.doc.hasOperation ? this.state.doc.hasOperation : false;
  //   if (name === 'spaces') {
  //     doc.spaces.forEach(function (val) {
  //       if (val.type === 'operations') {
  //         hasOperation = true;
  //       }
  //     });
  //   }
  //   doc.hasOperation = hasOperation;
  //   this.setState({
  //     doc: doc
  //   });
  // }

  // validateForm () {
  //   const doc = this.state.doc;
  //   if (this.isValid(doc.language) &&
  //     this.isValid(doc.spaces) &&
  //     this.isValid(doc.label) &&
  //     this.isValid(doc.category)  &&
  //     this.isValid(doc.date) &&
  //     this.isValid(doc.organizations)) {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }

  // handleSubmit(event, isDraft = 0) {
  //   event.preventDefault();
  //   const isValid = this.validateForm();
  //   /*if (!isValid) {
  //     this.setState({
  //       status: 'was-validated'
  //     });
  //     return;
  //   }*/
  //   this.setState({
  //     status: 'submitting'
  //   });
  //   const token = this.props.token;
  //   let doc = {};
  //   let body = JSON.stringify(this.state.doc);
  //   body = JSON.parse(body);
  //   body.published = isDraft ? 0 : 1;
  //   body.category = body.category.value;
  //   body.operation = [];
  //   body.space = [];
  //   body.spaces.forEach(function (sp) {
  //     if (sp.type === 'operations') {
  //       body.operation.push(sp.id);
  //     }
  //     else {
  //       body.space.push(sp.id);
  //     }
  //   });
  //   delete body.spaces;
  //   delete body.hasOperation;
  //   const selectFields = ['organizations', 'bundles', 'offices', 'disasters', 'themes'];
  //   selectFields.forEach(function (field) {
  //     if (body[field]) {
  //       for (let i = 0; i < body[field].length; i++) {
  //         body[field][i] = parseInt(body[field][i].id, 10);
  //       }
  //     }
  //   });
  //   if (body.locations) {
  //     let locations = [];
  //     body.locations.forEach(function (location, index) {
  //       let last = 0;
  //       for (let j = 0; j < location.length; j++) {
  //         if (typeof location[j] === 'object') {
  //           last = j;
  //         }
  //       }
  //       locations.push(parseInt(location[last].id, 10));
  //     });
  //     body.locations = locations;
  //   }
  //   body.language = body.language.value;
  //   if (body.address && body.address.country && typeof body.address.country === 'object') {
  //     body.address.country = body.address.country.pcode;
  //   }
  //   if (body.date[0] && body.date[0].timezone_db) {
  //     body.date[0].timezone_db = body.date[0].timezone_db.value;
  //   }
  //   if (body.date[0] && body.date[0].timezone) {
  //     body.date[0].timezone = body.date[0].timezone.value;
  //   }
  //
  //   this.hrinfoAPI
  //     .save('assessments', body)
  //     .then(doc => {
  //       this.props.history.push('/assessments/' + doc.id);
  //     })
  //     .catch(err => {
  //       this.props.setAlert('danger', 'There was an error uploading your document');
  //     });
  // }

  // handleDelete () {
  //   if (this.props.match.params.id) {
  //     const that = this;
  //     this.setState({
  //       status: 'deleting'
  //     });
  //     this.hrinfoAPI
  //       .remove('assessments', this.props.match.params.id)
  //       .then(results => {
  //         that.props.setAlert('success', 'Assessment deleted successfully');
  //         that.props.history.push('/home');
  //       }).catch(function(err) {
  //         that.props.setAlert('danger', 'There was an error deleting your assessment');
  //         that.props.history.push('/home');
  //       });
  //   }
  // }

  // onEditorStateChange (editorState) {
  //   let html = stateToHTML(editorState.getCurrentContent());
  //   let doc = this.state.doc;
  //   doc.body = html;
  //   this.setState({
  //     editorState,
  //     doc: doc
  //   });
  // }

  async componentDidMount() {
    if (this.props.match.params.id) {
      const doc = await this.hrinfoAPI.getItem('assessments', this.props.match.params.id);
      doc.spaces = [];
      doc.operation.forEach(function (op) {
        if (op) {
          doc.hasOperation = true;
          op.type = "operations";
          doc.spaces.push(op);
        }
      });
      doc.space.forEach(function (sp) {
        if (sp) {
          sp.type = "spaces";
          doc.spaces.push(sp);
        }
      });
      this.state.languages.forEach(function (lang) {
        if (doc.language === lang.value) {
          doc.language = lang;
        }
      });
      this.state.event_categories.forEach(function (category) {
        if (category.value === parseInt(doc.category, 10)) {
          doc.category = category;
        }
      });
      let state = {
        doc: doc
      };
      if (doc['body-html']) {
        const blocksFromHTML = convertFromHTML(doc['body-html']);
        const contentState = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );
        state.editorState = EditorState.createWithContent(contentState);
      }
      this.setState(state);
    }
  }

  render() {
    const { t, label } = this.props;
    const { editorState } = this.state;

    return (
      <Grid container direction="column" alignItems="center">
        <Typography color="textSecondary" gutterBottom variant = "headline">{t(label + '.create')}</Typography>
        <Grid item>
          <Grid container justify="space-around">

            {/* LEFT COLUMN */}
            <Grid item md={6} xs={11}>

                {/*<div className="invalid-feedback">*/}
                  {/*Please enter the assessment title*/}
                {/*</div>*/}
              {/* Title */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.label)}>{t('title')}</FormLabel>
                <TextField type     = "text"
                           name     = "label"
                           id       = "label"
                           value    = {this.props.doc.label || ''}
                           onChange = {this.props.handleInputChange}/>
                <FormHelperText id = "label-text">
                  <Trans i18nKey={label + '.helpers.title'}>Type the original title of the document.
                    Try not to use abbreviations. To see Standards and Naming Conventions click
                  <a href = "https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Dates */}
              <FormControl required fullWidth margin="normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.date)}>{t('date')}</FormLabel>
                <EventDate value    = {this.props.doc.date}
                           onChange = {(val) => {this.props.handleSelectChange('date', val);}}
                           required />
                <FormHelperText>
                  <Trans i18nKey={label + '.helpers.date'}>Indicate the date of the assessment.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Leading Organization */}
              <FormControl fullWidth margin = "normal">
                <FormLabel focused error    = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.organizations)}>{t('leading_organizations')}</FormLabel>
                <HRInfoAsyncSelect type="organizations"
                                   value     = {this.props.doc.organizations}
                                   onChange  = {(s) => this.props.handleSelectChange('organizations', s)}
                                   className = {this.props.isValid(this.props.doc.organizations) ? 'is-valid' : 'is-invalid'}
                                   classNamePrefix = {this.props.isValid(this.props.doc.organizations) ? 'is-valid' : 'is-invalid'}/>
                <FormHelperText id = "organizations-text">
                  <Trans i18nKey={label + '.helpers.leading_organizations'}>Type in and select from the list the organization(s)
                    conducting the assessment. To indicate multiple organizations add a comma after each entry.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Participation Organization(s) */}
              <FormControl fullWidth margin = "normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.participating_organizations)}>{t('participating_organizations')}</FormLabel>
                <HRInfoAsyncSelect type      = "organizations"
                                   value     = {this.props.doc.participating_organizations}
                                   onChange  = {(s) => this.props.handleSelectChange('participating_organizations', s)}
                                   className = {this.props.isValid(this.props.doc.participating_organizations) ? 'is-valid' : 'is-invalid'}
                                   classNamePrefix = {this.props.isValid(this.props.doc.participating_organizations) ? 'is-valid' : 'is-invalid'}/>
                <FormHelperText id = "participating_organizations-text">
                  <Trans i18nKey={label + '.helpers.participating_organizations'}>Type in and select from the list
                    the organization(s) taking part into (but not leading) the assessment.
                    To indicate multiple organizations add a comma after each entry.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Locations */}
              <FormControl fullWidth margin = "normal">
                <FormLabel focused error  = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.locations)}>{t('locations')}</FormLabel>
                <HRInfoLocations isMulti  = {true}
                                 onChange = {(s) => this.props.handleSelectChange('locations', s)}
                                 value    = {this.props.doc.locations}/>
                <FormHelperText id = "locations-text">
                  <Trans i18nKey={label + '.helpers.locations'}>Select from the menu the country(ies) the assessment is
                    about and indicate more specific locations by selecting multiple layers (region, province, town). </Trans>
                </FormHelperText>
              </FormControl>

              {/* Other location */}
              <FormControl fullWidth margin = "normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.other_location)}>{t('other_location')}</FormLabel>
                <TextField id       = "other_location"
                           type     = "text"
                           name     = "other_location"
                           value    = {this.props.doc.other_location}
                           onChange = {this.props.handleInputChange}/>
                <FormHelperText id = "other_location-text">
                  <Trans i18nKey={label + '.helpers.other_location'}>You can specify here a location not available
                    in the Location(s) field list.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Population Type(s) */}
              <FormControl fullWidth margin = "normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.population_types)}>{t('population_types')}</FormLabel>
                <HRInfoSelect type     = "population_types"
                              isMulti  = {true}
                              onChange = {(s) => this.props.handleSelectChange('population_types', s)}
                              value    = {this.props.doc.population_types}/>
                <FormHelperText id = "population_types-text">
                  <Trans i18nKey={label + '.helpers.population_types'}>Click on the field and select the segment(s) of
                    the population targeted by the assessment. You can select multiple population types. </Trans>
                </FormHelperText>
              </FormControl>

              {/* Subject */}
              <FormControl fullWidth margin = "normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.subject)}>{t('subject')}</FormLabel>
                <TextField id       = "subject"
                           type     = "textarea"
                           name     = "subject"
                           value    = {this.props.doc.subject}
                           onChange = {this.props.handleInputChange}/>
                <FormHelperText id = "subject-text">
                  <Trans i18nKey={label + '.helpers.subject'}>Insert a brief description of the topic of the
                    assessment and what its goals are.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Methodology */}
              <FormControl fullWidth margin = "normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.methodology)}>{t('methodology')}</FormLabel>
                <TextField id       = "methodology"
                           type     = "textarea"
                           name     = "methodology"
                           value    = {this.props.doc.methodology}
                           onChange = {this.props.handleInputChange}/>
                <FormHelperText id = "methodology-text">
                  <Trans i18nKey={label + '.helpers.methodology'}>Insert a brief description of the topic of the
                    assessment and what its goals are.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Key findings */}
              <FormControl fullWidth margin = "normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.key_findings)}>{t('key_findings')}</FormLabel>
                <TextField id       = "key_findings"
                           type     = "textarea"
                           name     = "key_findings"
                           value    = {this.props.doc.key_findings}
                           onChange = {this.props.handleInputChange}/>
                <FormHelperText id = "key_findings-text">
                  <Trans i18nKey={label + '.helpers.key_findings'}>Insert a brief summary of the assessment’s results.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Collection Method(s) */}
              <FormControl fullWidth margin = "normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.collection_method)}>{t('collection_method')}</FormLabel>
                <HRInfoSelect type     = "collection_method"
                              onChange = {(s) => this.props.handleSelectChange('collection_method', s)}
                              options  = {this.state.collection_method}
                              value    = {this.props.doc.collection_method}/>
                <FormHelperText id = "collection_method-text">
                  <Trans i18nKey={label + '.helpers.collection_method'}>Click on the field and select the collection
                    method(s) used to gather information during the assessment.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Sample size */}
              <FormControl fullWidth margin = "normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.sample_size)}>{t('sample_size')}</FormLabel>
                <TextField id       = "sample_size"
                           type     = "text"
                           name     = "sample_size"
                           onChange = {(s) => this.props.handleSelectChange('sample_size', s)}
                           value    = {this.props.doc.sample_size}/>
                <FormHelperText id = "sample_size-text">
                  <Trans i18nKey={label + '.helpers.sample_size'}>Indicate the number of
                    communities/households/individuals surveyed during the assessment.</Trans>
                </FormHelperText>
              </FormControl>

              {/*/!* Contact(s) *!/*/}
              {/*<FormControl fullWidth margin = "normal">*/}
                {/*<FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.contacts)}>{t('contacts')}</FormLabel>*/}
                {/*<HidContacts isMulti={true}*/}
                             {/*token={this.props.token}*/}
                             {/*onChange={(s) => this.props.handleSelectChange('contacts', s)}*/}
                             {/*value={this.props.doc.contacts}/>*/}
                {/*<FormHelperText id = "contacts-text">*/}
                  {/*<Trans i18nKey={label + '.helpers.contacts'}>Select at what geographical level the*/}
                    {/*assessment is (has been) conducted.</Trans>*/}
                {/*</FormHelperText>*/}
              {/*</FormControl>*/}

              {/*/!* Agenda(s) *!/*/}
              {/*<FormControl fullWidth margin = "normal">*/}
                {/*<FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.agendas)}>{t('agendas')}</FormLabel>*/}
                {/*<HRInfoAsyncSelect type     = "documents"*/}
                                   {/*onChange = {(s) => this.props.handleSelectChange('agendas', s)}*/}
                                   {/*value    = {this.props.doc.agendas}/>*/}
                {/*<FormHelperText id = "agendas-text">*/}
                  {/*<Trans i18nKey={label + '.helpers.agendas'}>Add the agenda of the event as a document first, and*/}
                    {/*then reference this document from here.</Trans>*/}
                {/*</FormHelperText>*/}
              {/*</FormControl>*/}

              {/*/!* Meeting minute(s) *!/*/}
              {/*<FormControl fullWidth margin = "normal">*/}
                {/*<FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.meeting_minutes)}>{t('meeting_minutes')}</FormLabel>*/}
                {/*<HRInfoAsyncSelect type     = "documents"*/}
                                   {/*onChange = {(s) => this.props.handleSelectChange('meeting_minutes', s)}*/}
                                   {/*value    = {this.props.doc.meeting_minutes}/>*/}
                {/*<FormHelperText id = "agendas-text">*/}
                  {/*<Trans i18nKey={label + '.helpers.agendas'}>Add the meeting minutes of the event as a document first,*/}
                    {/*and then reference this document from here.</Trans>*/}
                {/*</FormHelperText>*/}
              {/*</FormControl>*/}

              {/*/!* Related Content *!/*/}
              {/*<FormControl fullWidth margin = "normal">*/}
                {/*<FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.related_content)}>{t('related_content.related_content')}</FormLabel>*/}
                {/*<RelatedContent onChange = {(s) => this.props.handleSelectChange('related_content', s)}*/}
                                {/*value    = {this.props.doc.related_content}/>*/}
                {/*<FormHelperText id = "agendas-text">*/}
                  {/*<Trans i18nKey={label + '.helpers.agendas'}>Add the meeting minutes of the event as a document first,*/}
                    {/*and then reference this document from here.</Trans>*/}
                {/*</FormHelperText>*/}
              {/*</FormControl>*/}
            </Grid>

            {/* SECOND COLUMN */}
            <Grid item md={3} xs={11}>
              {/*<div className="invalid-feedback">*/}
              {/*Please select a language*/}
              {/*</div>*/}
              {/*/!* Languages *!/*/}
              {/*<FormControl required fullWidth margin="normal">*/}
                {/*<FormLabel focused error  = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.language)}>{t('language')}</FormLabel>*/}
                {/*<LanguageSelect value     = {this.props.doc.language}*/}
                                {/*onChange  = {(s) => this.props.handleSelectChange('language', s)}*/}
                                {/*className = {this.props.isValid(this.props.doc.language) ? 'is-valid' : 'is-invalid'}/>*/}
                {/*<FormHelperText id="language-text">*/}
                  {/*<Trans i18nKey={label + '.helpers.language'}>Select the language of the document.</Trans>*/}
                {/*</FormHelperText>*/}
              {/*</FormControl>*/}

              {/*<div className="invalid-feedback">*/}
              {/*You must select an assessment status*/}
              {/*</div>*/}
              {/* Status */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused error    = {this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.status)}>{t('status')}</FormLabel>
                <AssessmentStatus value     = {this.props.doc.status}
                                  onChange  = {(s) => this.props.handleSelectChange('status', s)}
                                  className = {this.props.isValid(this.props.doc.status) ? 'is-valid' : 'is-invalid'}
                                  classNamePrefix = {this.props.isValid(this.props.doc.status) ? 'is-valid' : 'is-invalid'}/>
                <FormHelperText id = "status-text">
                  <Trans i18nKey={label + '.helpers.status'}>Indicate the phase of the assessment.
                    Please remember to update this field as phases move on.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Bundles */}
              <FormControl fullWidth margin="normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.bundles)}>{t('bundles')}</FormLabel>
                <HRInfoSelect type="bundles"
                              spaces={this.props.doc.spaces}
                              isMulti={true}
                              onChange={(s) => this.props.handleSelectChange('bundles', s)}
                              value={this.props.doc.bundles} />
                <FormHelperText id = "bundles-text">
                  <Trans i18nKey={label + '.helpers.bundles'}>Indicate the cluster(s)/sector(s) the assessment refers to.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Theme(s) */}
              <FormControl fullWidth margin = "normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.themes)}>{t('themes')}</FormLabel>
                <HRInfoSelect type     = "themes"
                              isMulti  = {true}
                              onChange = {(s) => this.props.handleSelectChange('themes', s)}
                              value    = {this.props.doc.themes}/>
                <FormHelperText id = "themes-text">
                  <Trans i18nKey={label + '.helpers.themes'}>Click on the field and select all relevant themes.
                    Choose only themes the document substantively refers to.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Disasters */}
              <FormControl fullWidth margin="normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.disasters)}>{t('disasters')}</FormLabel>
                <HRInfoSelect type     = "disasters"
                              spaces   = {this.props.doc.spaces}
                              isMulti  = {true}
                              onChange = {(s) => this.props.handleSelectChange('disasters', s)}
                              value    = {this.props.doc.disasters} />
                <FormHelperText id = "disasters-text">
                  <Trans i18nKey={label + '.helpers.disasters'}>Click on the field and select the disaster(s) or emergency the assessment refers to.
                    Each disaster/emergency is associated with a number, called GLIDE, which is a common standard used by a wide network of organizations.
                    See <a href="http://glidenumer.net/?ref=hrinfo">glidenumber.net</a>.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Level of Representation */}
              <FormControl fullWidth margin = "normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.geographic_level)}>{t('geographic_level')}</FormLabel>
                <HRInfoSelect type     = "geographic_level"
                              onChange = {(s) => this.props.handleSelectChange('geographic_level', s)}
                              options  = {this.props.geographic_levels}
                              value    = {this.props.doc.geographic_level}/>
                <FormHelperText id = "geographic_level-text">
                  <Trans i18nKey={label + '.helpers.geographic_level'}>Select at what geographical level the
                    assessment is (has been) conducted.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Unit(s) of Measurement */}
              <FormControl fullWidth margin = "normal">
                <FormLabel focused error={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.unit_measurement)}>{t('unit_measurement')}</FormLabel>
                <HRInfoSelect type     = "measurement_units"
                              onChange = {(s) => this.props.handleSelectChange('unit_measurement', s)}
                              options  = {this.props.unit_measurement}
                              value    = {this.props.doc.unit_measurement}/>
                <FormHelperText id = "unit_measurement-text">
                  <Trans i18nKey={label + '.helpers.unit_measurement'}>Click on the field and select the unit(s) of
                    measurement used for the assessment.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Report */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused error ={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.report)}>{t('files.assessment_report')}</FormLabel>
                <HRInfoFilesAccessibility onChange={(s) => this.props.handleSelectChange('report', s)}
                             value={this.props.doc.report} />
                <FormHelperText id = "report-text">
                  <Trans i18nKey='helpers.assessment_report'>Upload the assessment report file, stored on your computer
                    or on your Dropbox account, and indicate its level of accessibility. If the file is
                    “Available on request”, write the instructions in the related space.
                    To see File Standards and Naming Conventions click
                    <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Questionnaire */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused error ={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.questionnaire)}>{t('files.assessment_questionnaire')}</FormLabel>
                <HRInfoFilesAccessibility onChange={(s) => this.props.handleSelectChange('questionnaire', s)}
                             value={this.props.doc.questionnaire} />
                <FormHelperText id = "questionnaire-text">
                  <Trans i18nKey='helpers.assessment_questionnaire'>Upload the assessment questionnaire file, stored on
                    your computer or on your Dropbox account, and indicate its level of accessibility.
                    If the file is “Available on request”, write the instructions in the related space.
                    To see File Standards and Naming Conventions click
                    <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.</Trans>
                </FormHelperText>
              </FormControl>

              {/* Data */}
              <FormControl required fullWidth margin = "normal">
                <FormLabel focused error ={this.props.status === 'was-validated' && !this.props.isValid(this.props.doc.data)}>{t('files.assessment_data')}</FormLabel>
                <HRInfoFilesAccessibility onChange={(s) => this.props.handleSelectChange('data', s)}
                             value={this.props.doc.data} />
                <FormHelperText id = "data-text">
                  <Trans i18nKey='helpers.assessment_data'>Upload the assessment data file, stored on your computer or
                    on your Dropbox account, and indicate its level of accessibility. If the file is “Available on request”,
                    write the instructions in the related space. To see File Standards and Naming Conventions  click
                    <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.</Trans>
                </FormHelperText>
              </FormControl>
  					</Grid>
  				</Grid>
  			</Grid>

        <Grid item className="submission">
        {
          this.props.status !== 'submitting' &&
          <span>
            {/*<Button color="primary" variant="contained" onClick={(evt) => {this.props.handleSubmit(evt); this.submit()}}>{t('publish')}</Button>*/}
            <Button color="primary" variant="contained" onClick={(evt) => {this.props.handleSubmit(evt);}}>{t('publish')}</Button>
              &nbsp;
            {/*<Button color="secondary" variant="contained" onClick={(evt) => {this.props.handleSubmit(evt, 1); this.submit()}}>{t('save_as_draft')}</Button>*/}
              &nbsp;
          </span>
        }
        {
          (this.props.status === 'submitting' || this.props.status === 'deleting') &&
          <CircularProgress />
        }
        {
          (this.props.match.params.id && this.props.status !== 'deleting') &&
          <span>
            <Button color="secondary" variant="contained" onClick={this.props.handleDelete}>{t('delete')}</Button>
          </span>
        }
        </Grid>
        <Snackbar anchorOrigin={{
            vertical  : 'bottom',
            horizontal: 'left'
          }}
          open             = {this.props.status === 'was-validated' && this.state.wasSubmitted}
          autoHideDuration = {6000}
          onClose          = {this.hideAlert}
          ContentProps     = {{
            'aria-describedby' : 'message-id'
          }}
          message={<Typography id ="message-id" color="error">{t('form_incomplete')}</Typography>}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={this.hideAlert}>
            {t('close')}
            </Button>
          ]}
        />
      </Grid>
    );
  }
}

export default translate('forms')(AssessmentForm);
