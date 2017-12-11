import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import marked from 'marked';

import styles from './styles.scss';

const renderer = new marked.Renderer();
renderer.link = (href, title, text) =>
  `<a target="_blank" href="${href}" title="${title}">${text}</a>`;

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
});

function Markdown({
  className,
  text,
}) {
  /* eslint-disable react/no-danger */
  return (
    <div className={classnames(styles.root, className)}>
      <div
        className={styles['markdown-body']}
        dangerouslySetInnerHTML={{ __html: marked(text, { renderer }) }}
      />
    </div>
  );
  /* eslint-enable */
}

Markdown.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
};

Markdown.defaultProps = {
  className: undefined,
};

export default Markdown;
