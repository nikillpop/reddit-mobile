import './styles.less';
import React from 'react';
import { Anchor } from '@r/platform/components';
import { urlFromPage } from '@r/platform/pageUtils';
import { TooltipTarget } from '@r/widgets/tooltip';

import Vote from 'app/components/Vote';
import CommentDropdown from '../CommentDropdown';
import cx from 'lib/classNames';

const T = React.PropTypes;

export default function CommentTools(props) {
  const {
    id,
    score,
    scoreHidden,
    voteDirection,
    commentAuthor,
    username,
    saved,
    permalinkUrl,
    onEdit,
    onDelete,
    onToggleSave,
  } = props;

  const tooltipId = `comment-tooltip-${id}`;

  return (
    <div className='CommentTools'>
      { renderReply(props) }
      { renderSeashells(tooltipId) }
      { renderDivider(props) }
      { renderVote(id, score, scoreHidden, voteDirection) }
      { renderDropdown(tooltipId, permalinkUrl, commentAuthor, username, saved,
                       onEdit, onDelete, onToggleSave) }
    </div>
  );
}

CommentTools.propTypes = {
  id: T.string.isRequired,
  score: T.number.isRequired,
  commentAuthor: T.string.isRequired,
  username: T.string, // The user's name
  scoreHidden: T.bool,
  voteDirection: T.number,
  saved: T.bool,
  permalinkUrl: T.string,
  onEdit: T.func,
  onDelete: T.func,
  onToggleSave: T.func,
};

CommentTools.defaultProps = {
  voteDirection: 0,
  scoreHidden: false,
  saved: false,
  permalinkUrl: '',
  onEdit: () => {},
  onDelete: () => {},
  onToggleSave: () => {},
};

const renderReply = ({ currentPage, id, commentReplying }) => {
  const href = urlFromPage(currentPage, { queryParams: { commentReply: id } });

  return (
    <Anchor
      href= { href }
      className={ cx('CommentTools__reply icon icon-reply2', {
        'CommentTools__reply__replying': commentReplying,
      }) }
    />
  );
};

const renderSeashells = tooltipId => (
  <TooltipTarget
    id={ tooltipId }
    type={ TooltipTarget.TYPE.CLICK }
  >
    <div className='CommentTools__more icon icon-seashells'/>
  </TooltipTarget>
);

const renderVote = (id, score, scoreHidden, voteDirection) => (
  <Vote
    thingId={ id }
    classPrefix='CommentTools'
    score={ score }
    scoreHidden={ scoreHidden }
    voteDirection={ voteDirection }
  />
);

const renderDivider = () => (
  <div className='CommentTools__divider' />
);

const renderDropdown = (
  tooltipId,
  permalink,
  commentAuthor,
  username,
  isSaved,
  onEdit,
  onDelete,
  onToggleSave,
) => (
  <CommentDropdown
    id={ tooltipId }
    permalink={ permalink }
    commentAuthor={ commentAuthor }
    username={ username }
    isSaved={ isSaved }
    onEdit={ onEdit }
    onDelete={ onDelete }
    onToggleSave={ onToggleSave }
  />
);