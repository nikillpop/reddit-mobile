import React from 'react';
import { models } from 'snoode';
import constants from '../../constants';

import UpvoteIconFactory from '../components/UpvoteIcon';
var UpvoteIcon;
import DownvoteIconFactory from '../components/DownvoteIcon';
var DownvoteIcon;
import MobileButtonFactory from '../components/MobileButton';
var MobileButton;

class Vote extends React.Component {
  constructor(props) {
    super(props);

    this._score = props.thing.score;

    this.state = {
      score: this._score,
      rollover: '',
    };

    var likes = props.thing.likes;

    if (likes === false) {
      this.state.localScore = -1;
    } else if (likes === true) {
      this.state.localScore = 1;
    } else {
      this.state.localScore = 0;
    }

    this._onVote = this._onVote.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps !== this.props || nextState !== this.state);
  }

  componentDidMount() {
    this.props.app.on(constants.VOTE+':'+this.props.thing.id, this._onVote);
  }

  componentWillUnmount() {
    this.props.app.off(constants.VOTE+':'+this.props.thing.id, this._onVote);
  }

  _onClick(str, evt) {
    switch (str) {
      case 'upvote':
        evt.preventDefault();
        this.props.app.emit(constants.VOTE+':'+this.props.thing.id, 1);
        break;
      case 'downvote':
        evt.preventDefault();
        this.props.app.emit(constants.VOTE+':'+this.props.thing.id, -1);
        break;
    }
  }

  _onVote(dir) {
    var localScore = Math.min(1, Math.max(-1, dir - this.state.localScore));
    this.setState({localScore: localScore, score: this._score + localScore});
    this.submitVote(localScore);
  }

  submitVote(direction) {
    if (!this.props.token) {
      // TODO: replace this with login form
      console.warn('Must log in first.');
      return;
    }

    var vote = new models.Vote({
      direction: parseInt(direction),
      id: this.props.thing.name,
    });

    var options = this.props.api.buildOptions(this.props.token);

    options = Object.assign(options, {
      model: vote,
    });

    this.props.api.votes.post(options);
  }

  _onMouseEnter(str) {
    this.setState({rollover: str});
  }

  _onMouseLeave() {
    this.setState({rollover: ''});
  }

  render() {
    return (
        <ul className='linkbar linkbar-compact'>
          <li>
            <form className='vote-form' action={'/vote/'+this.props.thing.name} method='post'>
              <input type='hidden' name='direction' value='1'/>
              <MobileButton type='submit'
                className={'vote text-muted'} data-vote='up' data-thingid={ this.props.thing.name }
                data-no-route='true' onClick={this._onClick.bind(this, 'upvote')} over={this._onMouseEnter.bind(this, 'upvote')} out={this._onMouseLeave}>
                <UpvoteIcon opened={this.state.upvoted} hovered={this.state.rollover=='upvote'} altered={ this.state.localScore > 0 } />
              </MobileButton>
            </form>
          </li>
          <li className='vote-score-container'>
            <span className='vote-score' data-vote-score={this.state.score } data-thingid={ this.props.thing.name }>
              { this.state.score }
            </span>
          </li>
          <li>
            <form className='vote-form' action={'/vote/'+this.props.thing.name} method='post'>
              <input type='hidden' name='direction' value='-1'/>
              <MobileButton type='submit'
                className={'vote text-muted'} data-vote='down' data-thingid={ this.props.thing.name }
                data-no-route='true' onClick={this._onClick.bind(this, 'downvote')} over={this._onMouseEnter.bind(this, 'downvote')} out={this._onMouseLeave}>
                <DownvoteIcon opened={this.state.downvoted} hovered={this.state.rollover=='downvote'} altered={ this.state.localScore < 0 } />
              </MobileButton>
            </form>
          </li>
        </ul>
    );
  }
}

function VoteFactory(app) {
  UpvoteIcon = UpvoteIconFactory(app);
  DownvoteIcon = DownvoteIconFactory(app);
  MobileButton = MobileButtonFactory(app);
  return app.mutate('core/components/vote', Vote);
}

export default VoteFactory;
