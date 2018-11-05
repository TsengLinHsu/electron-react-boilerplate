// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  componentDidMount() {
    fetch('https://www.ptt.cc/bbs/index.html')
      .then(response => response.text())
      .then(str => new DOMParser().parseFromString(str, 'text/html'))
      .then(data => {
        const board = data.querySelectorAll('a.board');
        const boardJSON = {
          board: Array.from(board).map(e => ({
            boardLink: e.href,
            boardName: e.querySelector('div.board-name').textContent,
            boardNuser: e.querySelector('div.board-nuser').textContent,
            boardTitle: e.querySelector('div.board-title').textContent
          }))
        };

        return console.log(boardJSON);
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Home</h2>
        <Link to={routes.COUNTER}>to Counter</Link>
      </div>
    );
  }
}
