import React from 'react';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import {stateToHTML} from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Select from 'react-select';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import HRInfoSelect from './HRInfoSelect';
import HRInfoLocations from './HRInfoLocations';
import HRInfoOrganizations from './HRInfoOrganizations';
import HRInfoFiles from './HRInfoFiles';
import RelatedContent from './RelatedContent';

class DocumentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: {
        label: '',
        publication_date: ''
      },
      editorState: EditorState.createEmpty(),
      languages: [
        { value: 'en', label: 'English'},
        { value: 'fr', label: 'French' },
        { value: 'es', label: 'Spanish' },
        { value: 'ru', label: 'Russian' }
      ],
      status: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.postFieldCollections = this.postFieldCollections.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let doc = this.state.doc;
    doc[name] = value;
    this.setState({
      doc: doc
    });
  }

  handleSelectChange (name, selected) {
    let doc = this.state.doc;
    doc[name] = selected;
    this.setState({
      doc: doc
    });
  }

  async postFieldCollections (docid, field_collections) {
    const token = this.props.token;
    for (const fc of field_collections) {
      const body = {
        file: fc.file,
        language: fc.language,
        host_entity: docid
      };
      let url = 'https://www.humanitarianresponse.info/api/v1.0/files_collection';
      let httpMethod = 'POST';
      if (fc.item_id !== '') {
        url = 'https://www.humanitarianresponse.info/api/v1.0/files_collection/' + fc.item_id;
        httpMethod = 'PATCH';
      }
      await fetch(url, {
        method: httpMethod,
        body: JSON.stringify(body),
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      status: 'submitting'
    });
    const token = this.props.token;
    let doc = {};
    let body = JSON.stringify(this.state.doc);
    body = JSON.parse(body);
    body.document_type = body.document_type.id;
    body.operation = [parseInt(body.operation.id, 10)];
    body.publication_date = Math.floor(new Date(this.state.doc.publication_date).getTime() / 1000);
    const selectFields = ['organizations', 'bundles', 'offices', 'disasters', 'themes'];
    selectFields.forEach(function (field) {
      if (body[field]) {
        for (let i = 0; i < body[field].length; i++) {
          body[field][i] = parseInt(body[field][i].id, 10);
        }
      }
    });
    if (body.locations) {
      let locations = [];
      body.locations.forEach(function (location, index) {
        let last = 0;
        for (let j = 0; j < location.length; j++) {
          if (typeof location[j] === 'object') {
            last = j;
          }
        }
        locations.push(parseInt(location[last].id, 10));
      });
      body.locations = locations;
    }
    let field_collections = [];
    body.files.files.forEach(function (file, index) {
      let fc = {};
      if (body.files.languages[index]) {
        fc.language = body.files.languages[index].value;
      }
      fc.file = file.id ? file.id : file.fid;
      fc.file = parseInt(fc.file, 10);
      fc.item_id = '';
      if (body.files.collections[index]) {
        fc.item_id = parseInt(body.files.collections[index], 10);
      }
      field_collections.push(fc);
    });
    delete body.files;
    body.language = body.language.value;

    let httpMethod = 'POST';
    let url = 'https://www.humanitarianresponse.info/api/v1.0/documents';
    if (body.id) {
      httpMethod = 'PATCH';
      url = 'https://www.humanitarianresponse.info/api/v1.0/documents/' + body.id;
      delete body.created;
      delete body.changed;
      delete body.url;
    }

    fetch(url, {
        method: httpMethod,
        body: JSON.stringify(body),
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(results => {
        return results.json();
      })
      .then(data => {
        doc = data.data[0];
        return this.postFieldCollections(doc.id, field_collections);
      })
      .then(res => {
        this.props.history.push('/documents/' + doc.id);
      });
  }

  handleDelete () {
    if (this.props.match.params.id) {
      fetch('https://www.humanitarianresponse.info/api/v1.0/documents/' + this.props.match.params.id, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + this.props.token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(results => {
          return results.json();
        }).then(data => {
          console.log(data);
        }).catch(function(err) {
          console.log("Fetch error: ", err);
        });
    }
  }

  onEditorStateChange (editorState) {
    let html = stateToHTML(editorState.getCurrentContent());
    let doc = this.state.doc;
    doc.body = html;
    this.setState({
      editorState,
      doc: doc
    });
  }

  getDocument () {
    return fetch("https://www.humanitarianresponse.info/api/v1.0/documents/" + this.props.match.params.id)
        .then(results => {
            return results.json();
        }).then(data => {
          return data.data[0];
        }).catch(function(err) {
            console.log("Fetch error: ", err);
        });
  }

  async componentDidMount() {
    if (this.props.match.params.id) {
      const doc = await this.getDocument();
      doc.operation = doc.operation[0];
      this.state.languages.forEach(function (lang) {
        if (doc.language === lang.value) {
          doc.language = lang;
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
    const offices = this.state.doc.operation ? (
      <div className="form-group">
        <label htmlFor="offices">Coordination hub(s)</label>
        <HRInfoSelect type="offices" operation={this.state.doc.operation} isMulti={true} onChange={(s) => this.handleSelectChange('offices', s)} value={this.state.doc.offices} />
      </div>
    ) : '';

    const disasters = this.state.doc.operation ? (
      <div className="form-group">
        <label htmlFor="disasters">Disaster(s)</label>
        <HRInfoSelect type="disasters" operation={this.state.doc.operation} isMulti={true} onChange={(s) => this.handleSelectChange('disasters', s)} value={this.state.doc.disasters} />
      </div>
    ) : '';

    const bundles = this.state.doc.operation ? (
      <div className="form-group">
        <label htmlFor="bundles">Cluster(s)/Sector(s)</label>
        <HRInfoSelect type="bundles" operation={this.state.doc.operation} isMulti={true} onChange={(s) => this.handleSelectChange('bundles', s)} value={this.state.doc.bundles} />
      </div>
    ) : '';

    const { editorState } = this.state;

    return (
      <div>
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="language">Language</label>
          <Select id="language" name="language" options={this.state.languages} value={this.state.doc.language} onChange={(s) => this.handleSelectChange('language', s)} />
        </div>
        <div className="form-group">
          <label htmlFor="operations">Operation</label>
          <HRInfoSelect type="operations" onChange={(s) => this.handleSelectChange('operation', s)} value={this.state.doc.operation} />
        </div>
        <div className="form-group">
          <label htmlFor="label">Label</label>
          <input type="text" className="form-control" name="label" id="label" aria-describedby="labelHelp" placeholder="Enter the title of the document" required="required" value={this.state.doc.label} onChange={this.handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="document_type">Document type</label>
          <HRInfoSelect type="document_types" onChange={(s) => this.handleSelectChange('document_type', s)} value={this.state.doc.document_type} required={true} />
        </div>
        <div className="form-group">
          <label htmlFor="publication_date">Original Publication Date</label>
          <input type="date" className="form-control" id="publication_date" name="publication_date" value={this.state.doc.publication_date} onChange={this.handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="files">Files</label>
          <HRInfoFiles onChange={(s) => this.handleSelectChange('files', s)} value={this.state.doc.files} token={this.props.token} />
        </div>
        <div className="form-group">
          <label htmlFor="body">Body</label>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={this.onEditorStateChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="related_content">Related Content</label>
          <RelatedContent onChange={(s) => this.handleSelectChange('related_content', s)} value={this.state.doc.related_content} />
        </div>
        <div className="form-group">
          <label htmlFor="organizations">Organizations</label>
          <HRInfoOrganizations onChange={(s) => this.handleSelectChange('organizations', s)} value={this.state.doc.organizations} />
        </div>
        <div className="form-group">
          <label htmlFor="locations">Locations</label>
          <HRInfoLocations onChange={(s) => this.handleSelectChange('locations', s)} value={this.state.doc.locations} />
        </div>
        {bundles}
        {offices}
        {disasters}
        <div className="form-group">
          <label htmlFor="themes">Themes</label>
          <HRInfoSelect type="themes" isMulti={true} onChange={(s) => this.handleSelectChange('themes', s)} value={this.state.doc.themes} />
        </div>
        {this.state.status === '' &&
          <input type="submit" value="Submit" />
        }
        {this.state.status === 'submitting' &&
          <FontAwesomeIcon icon={faSpinner} pulse fixedWidth />
        }
      </form>
      {this.props.match.params.id &&
        <button className="btn btn-default btn-alert" onClick={this.handleDelete}>Delete</button>
      }
      </div>
    );
  }
}

export default DocumentForm;
