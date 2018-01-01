import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactMarkdown from 'react-markdown';

import styles from './styles.scss';

// const renderer = new marked.Renderer();
// renderer.link = (href, title, text) =>
//   `<a target="_blank" href="${href}" title="${title}">${text}</a>`;
// const defaultImageRender = renderer.image.bind(renderer);

// marked.setOptions({
//   gfm: true,
//   tables: true,
//   breaks: false,
//   pedantic: false,
//   sanitize: false,
//   smartLists: true,
//   smartypants: false,
// });

function ImageRender(props) {
  if (props.alt === ':Person' || props.alt === ':Team') {
    if (typeof props.atRender === 'function') {
      const AtRender = props.atRender;
      return <AtRender id={props.src} type={props.alt.replace(':', '')} />;
    }
    return <a href={`#${props.src}`}>@{props.src}</a>;
  }
  return <img src={props.src} alt={props.alt} />;
}

ImageRender.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  atRender: PropTypes.func,
};

ImageRender.defaultProps = {
  alt: undefined,
  atRender: undefined,
};

function LinkRender(props) {
  return (
    <a target="_blank" href={props.href} title={props.title}>
      {props.children}
    </a>
  );
}

LinkRender.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

LinkRender.defaultProps = {
  title: undefined,
};

function Markdown({
  className,
  text,
  atRender,
}) {
  // renderer.image = (href, title, text) => {
  //   if (text === ':Person' || text === ':Team') {
  //     if (typeof atRender === 'function') {
  //       return atRender({ id: href, type: text });
  //     }
  //     return `<a href="#${href}">@${href}</a>`;
  //   }
  //   return defaultImageRender(href, title, text);
  // };
  /* eslint-disable react/no-danger */
  const renderers = {
    image: (props) => <ImageRender {...props} atRender={atRender} />,
    link: LinkRender,
  };
  return (
    <div className={classnames(styles.root, className)}>
      <ReactMarkdown
        className={styles['markdown-body']}
        source={text}
        renderers={renderers}
      />
    </div>
  );
  /* eslint-enable */
}

Markdown.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
  atRender: PropTypes.func,
};

Markdown.defaultProps = {
  className: undefined,
  atRender: undefined,
};

export default Markdown;
