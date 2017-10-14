import React, {Component} from 'react';
import logo from './logo.svg';
import xlsx from 'xlsx';
import './App.css';
import testSheet from './testFile.js';

const isDevelopmentMode = window.location.search.includes('dev');

const makeFunction = str => {
  const vars = str.match(/\w+/g).reduce((res, v) => {
    if (!res.includes(v)) res.push(v);
    return res;
  }, []);
  const func = new Function(...vars, `return ${str};`); // this is slightly dangerous
  return {vars, func};
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {rows: []};
  }
  componentDidMount() {
    if (isDevelopmentMode) this.loadSheet(testSheet);
  }
  loadSheet(data) {
    const parsed = xlsx.read(data).Sheets.Sheet1;
    const rows = [];
    for (let row = 0; row < 26; row++) {
      rows[row] = [];
      for (let col = 0; col < 26; col++) {
        const key = String.fromCharCode(col + 65) + (row + 1);
        if (parsed[key]) {
          rows[row][col] = parsed[key];
          if (parsed[key].f) {
            Object.assign(parsed[key], makeFunction(parsed[key].f)); // sets vars and func
          }
        }
      }
    }
    this.setState({rows});
  }
  changeFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      this.loadSheet(btoa(e.target.result));
    };
    reader.readAsBinaryString(file);
  }
  calcalate() {
    // const {rows} = this.state;
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React, dont touch my penis</h1>
          <input type="file" onChange={e => this.changeFile(e.target.files[0])} />
        </header>
        <table>
          <tbody>
            {this.state.rows.map((row, i) => (
              <tr key={i}>
                {row.map((col, j) => (
                  <td key={j} title={JSON.stringify(col)}>
                    {col ? col.v : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
