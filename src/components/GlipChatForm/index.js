import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import 'rc-editor-mention/assets/index.css';
import Mention, { Nav, toString, toEditorState, getMentions } from 'rc-editor-mention';

import EmojiSelect from '../EmojiSelect';

import emojiIcon from '../../assets/images/emoji.png';
import uploadIcon from '../../assets/images/upload.png';
import styles from './styles.scss';

export default class GlipChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: toEditorState(props.textValue),
      suggestions: []
    };
    this._onInputChange = (editorState) => {
      // const text = e.currentTarget.value;
      this.setState({ value: editorState });
      if (typeof this.props.onTextChange === 'function') {
        this.props.onTextChange(toString(editorState));
      }
    };

    this._onSearchChange = (value) => {
      console.log(value);
      const suggestions = this.props.members.map(suggestion =>
        <Nav style={{ height: 34 }} value={suggestion.email} key={suggestion.id} >
          <span>{suggestion.firstName} {suggestion.lastName}</span>
        </Nav>);
      this.setState({
        suggestions,
      });
    };

    this._onSubmit = (e) => {
      console.log('onSubmit');
      // this.props.onSubmit();
      e.preventDefault();
    };
    this._onTextAreaKeyDown = (e) => {
      if (
        e.key === 'Enter' &&
        !e.shiftKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        console.log('onSubmit');
        this.props.onSubmit();
        e.preventDefault();
      }
    };

    this._onSelectEmoji = (emoji) => {
      this.setState((preState) => {
        const nexText = preState.text ? `${preState.text} ${emoji} ` : `${emoji} `;
        if (typeof this.props.onTextChange === 'function') {
          this.props.onTextChange(nexText);
        }
        return {
          text: nexText
        };
      });
    };

    this._onSelectFile = (e) => {
      const file = e.target.files[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onloadend = (evt) => {
        if (evt.target.readyState === FileReader.DONE) {
          this.props.onUploadFile(file.name, evt.target.result);
        }
      };
      reader.readAsArrayBuffer(file);
    };
  }

  componentDidMount() {
    this._autoFocus();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.textValue !== nextProps.textValue) {
      this.setState({ value: toEditorState(nextProps.textValue) });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.groupId !== this.props.groupId
    ) {
      this._autoFocus();
    }
  }

  _autoFocus() {
    // if (this._textInput) {
    //   this._textInput.focus();
    // }
  }

  render() {
    const {
      className,
      placeholder,
    } = this.props;

    return (
      <div className={classnames(styles.root, className)}>
        <div className={styles.tools}>
          <Tooltip
            placement="top"
            trigger="click"
            arrowContent={<div className="rc-tooltip-arrow-inner" />}
            overlayClassName={styles.emojisTooltip}
            overlay={(
              <div style={{ width: 325, height: 250 }}>
                <EmojiSelect onSelect={this._onSelectEmoji} />
              </div>
            )}
          >
            <img alt="emoji" src={emojiIcon} className={styles.emoji} />
          </Tooltip>
          <label className={styles.file}>
            <img alt="emoji" src={uploadIcon} />
            <input type="file" onChange={this._onSelectFile} />
          </label>
        </div>
        <form onSubmit={this._onSubmit}>
          <Mention
            style={{ width: '100%', height: 70, lineHeight: '18px' }}
            className={styles.mentionInput}
            ref={(input) => { this._textInput = input; }}
            placeholder={placeholder}
            value={this.state.value}
            onChange={this._onInputChange}
            onSearchChange={this._onSearchChange}
            suggestions={this.state.suggestions}
            prefix="@"
            notFoundContent=""
            multiLines
          />
        </form>
      </div>
    );
  }
}

GlipChatForm.propTypes = {
  textValue: PropTypes.string,
  className: PropTypes.string,
  onTextChange: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  onUploadFile: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  groupId: PropTypes.string,
  members: PropTypes.array,
};

GlipChatForm.defaultProps = {
  className: undefined,
  textValue: '',
  onTextChange: undefined,
  placeholder: undefined,
  groupId: undefined,
  members: []
};
