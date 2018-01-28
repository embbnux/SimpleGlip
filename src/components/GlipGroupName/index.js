import React from 'react';
import PropTypes from 'prop-types';

export default function GlipGroupName({
  group,
}) {
  let name = group.name;
  if (!name && group.detailMembers) {
    let noMes = group.detailMembers.filter(m => !m.isMe);
    if (noMes.length === 0) {
      noMes = group.detailMembers;
    }
    const names = noMes.map(p =>
      `${p.firstName ? p.firstName : ''} ${p.lastName ? p.lastName : ''}`
    );
    name = names.join(', ');
  }
  return (
    <span>{name}</span>
  );
}

GlipGroupName.propTypes = {
  group: PropTypes.object.isRequired,
};
