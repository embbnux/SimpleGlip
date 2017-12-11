import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';

export default class GlipChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.textValue,
    };
    this._onInputChange = (e) => {
      const text = e.currentTarget.value;
      this.setState({ text });
      if (typeof this.props.onTextChange === 'function') {
        this.props.onTextChange(text);
      }
    };
    this._onSubmit = (e) => {
      this.props.onSubmit();
      e.preventDefault();
    };
    this._onTextAreaKeyDown = (e) => {
      if (
        e.key === 'Enter' &&
        !e.shiftKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        this.props.onSubmit();
        e.preventDefault();
      }
    };
  }

  componentDidMount() {
    this._autoFocus();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.textValue !== nextProps.textValue) {
      this.setState({ text: nextProps.textValue });
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
    if (this._textInput) {
      this._textInput.focus();
    }
  }

  render() {
    const {
      className,
      placeholder,
    } = this.props;
    return (
      <div className={classnames(styles.root, className)}>
        <form onSubmit={this._onSubmit}>
          <textarea
            ref={(input) => { this._textInput = input; }}
            placeholder={placeholder}
            value={this.state.text}
            maxLength="1000"
            onChange={this._onInputChange}
            autoFocus
            onKeyPressCapture={this._onTextAreaKeyDown}
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
  placeholder: PropTypes.string,
  groupId: PropTypes.string,
};

GlipChatForm.defaultProps = {
  className: undefined,
  textValue: '',
  onTextChange: undefined,
  placeholder: undefined,
  groupId: undefined,
};
